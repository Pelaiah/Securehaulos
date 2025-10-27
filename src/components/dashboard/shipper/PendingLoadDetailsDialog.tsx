'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Load, Truck, Driver, Document as CarrierDocument } from '@/lib/data';
import { useEffect, useMemo, useState } from 'react';
import {
  FileText,
  Truck as TruckIcon,
  ShieldCheck,
  ShieldAlert,
  Thermometer,
  MapPin as GpsIcon,
  Contact,
  Download,
  Check,
  X,
  BadgeCheck,
} from 'lucide-react';
import Image from 'next/image';
import { drivers, documents as mockCarrierDocs } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, errorEmitter, FirestorePermissionError, useMemoFirebase, useDoc } from '@/firebase';
import { collection, doc, updateDoc, writeBatch } from 'firebase/firestore';


type SubmittedDocument = {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    status: 'Submitted' | 'Approved' | 'Rejected';
    submittedAt: string;
    fileUrl: string;
}

type PendingLoadDetailsDialogProps = {
  load: Load | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

// Find a driver associated with the truck for demo purposes
const getDriverForTruck = (truckId?: string) => {
    if (!truckId) return drivers[0];
    return drivers.find(d => d.truck === truckId) || drivers[0];
}

const getTruckForLoad = (load: Load | null, allTrucks: Truck[]) => {
    if (!load?.assignedTruckId) return undefined;
    return allTrucks.find(t => t.id === load.assignedTruckId);
}


export function PendingLoadDetailsDialog({
  load,
  isOpen,
  onOpenChange,
}: PendingLoadDetailsDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const assignedTruck = getTruckForLoad(load, drivers.map(d => ({...d, ...d.truck && {truck: d.truck}} as any))); // This is messy, needs fixing
  const assignedDriver = getDriverForTruck(assignedTruck?.id);
  
  const documentsRef = useMemoFirebase(() => {
    if (!firestore || !load) return null;
    return collection(firestore, 'loads', load.id, 'submitted_documents');
  }, [firestore, load]);
  const { data: submittedDocs, isLoading: isLoadingDocs } = useCollection<SubmittedDocument>(documentsRef);

  const carrierDocRef = useMemoFirebase(() => {
    if (!firestore || !load?.carrierId) return null;
    return doc(firestore, 'carriers', load.carrierId);
  }, [firestore, load]);
  const { data: carrierData } = useDoc(carrierDocRef);

  const handleDecision = async (decision: 'Approved' | 'Rejected') => {
    if (!load || !firestore || !load.assignedTruckId) return;
    
    setIsSubmitting(true);
    
    try {
        const batch = writeBatch(firestore);
        const loadRef = doc(firestore, 'loads', load.id);
        const truckRef = doc(firestore, 'trucks', load.assignedTruckId);
        
        if (decision === 'Approved') {
            batch.update(loadRef, { status: 'In Transit' });
            batch.update(truckRef, { status: 'On-time' });

            if (carrierDocRef) {
              batch.update(carrierDocRef, { verified: true });
            }
        } else {
            batch.update(loadRef, { status: 'Posted', carrierId: null, assignedTruckId: null });
            batch.update(truckRef, { status: 'Idle' });
        }
        
        await batch.commit();

        if (decision === 'Approved') {
            toast({
                title: 'Load Approved!',
                description: `Carrier has been assigned and load #${load.id} is now In Transit.`,
            });
        } else {
             toast({
                title: 'Application Rejected',
                description: `Load #${load.id} has been returned to the load board.`,
                variant: 'destructive'
            });
        }
        onOpenChange(false);
    } catch (error: any) {
        toast({
            title: 'Update Failed',
            description: error.message || 'An unexpected error occurred. Please check security rules.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleDocumentVerification = (docId: string, status: 'Approved' | 'Rejected') => {
    // In a real app, you'd update the document status in Firestore
    console.log(`Document ${docId} ${status}`);
    toast({
      title: `Document ${status}`,
      description: `The document has been marked as ${status.toLowerCase()}.`
    })
  }

  if (!load || !assignedTruck || !assignedDriver) return null;

  const isVerified = carrierData?.verified;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Review Application for Load #{load.id}
          </DialogTitle>
          <DialogDescription>
            Carrier <span className="font-semibold">{assignedTruck.name}</span> has applied for this load. Review their details and documents below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 flex-grow overflow-y-auto pr-2 -mx-6 px-6">
            {/* Left Column */}
            <div className='space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between font-headline"><span className="flex items-center gap-2"><Contact /> Carrier & Driver Details</span> {isVerified && <Badge variant="outline" className="text-green-500 border-green-500/50 bg-green-500/10"><BadgeCheck className="w-4 h-4 mr-1.5" />Verified</Badge>}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div>
                            <p className="text-sm text-muted-foreground">Carrier Company</p>
                            <p className="font-semibold">{assignedTruck.name}</p>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={assignedDriver.avatar} alt={assignedDriver.name} />
                                <AvatarFallback>{assignedDriver.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                             <div>
                                <p className="text-sm text-muted-foreground">Assigned Driver</p>
                                <p className="font-semibold">{assignedDriver.name}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline"><TruckIcon /> Assigned Truck & Sensors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className='relative aspect-video'>
                           <Image src={assignedTruck.imageUrl} alt={assignedTruck.name} fill className="object-contain" data-ai-hint="truck side view" />
                       </div>
                       <p className="font-semibold text-center">{assignedTruck.name}</p>
                       <div className="grid grid-cols-3 gap-4 text-center text-xs">
                           <div className="flex flex-col items-center gap-1">
                                {assignedTruck.sensors.door ? <ShieldCheck className="w-6 h-6 text-green-500" /> : <ShieldAlert className="w-6 h-6 text-yellow-500" />}
                                <p>Door Sensor</p>
                                <Badge variant={assignedTruck.sensors.door ? 'outline' : 'secondary'} className={cn(assignedTruck.sensors.door && 'border-green-500/50 text-green-500')}>
                                  {assignedTruck.sensors.door ? 'Equipped' : 'Not Present'}
                                </Badge>
                           </div>
                            <div className="flex flex-col items-center gap-1">
                                {assignedTruck.sensors.temperature ? <Thermometer className="w-6 h-6 text-green-500" /> : <Thermometer className="w-6 h-6 text-muted-foreground" />}
                                <p>Temp. Sensor</p>
                                <Badge variant={assignedTruck.sensors.temperature ? 'outline' : 'secondary'} className={cn(assignedTruck.sensors.temperature && 'border-green-500/50 text-green-500')}>
                                  {assignedTruck.sensors.temperature ? 'Equipped' : 'Not Present'}
                                </Badge>
                           </div>
                            <div className="flex flex-col items-center gap-1">
                                {assignedTruck.sensors.gps ? <GpsIcon className="w-6 h-6 text-green-500" /> : <GpsIcon className="w-6 h-6 text-muted-foreground" />}
                                <p>GPS Tracking</p>
                                <Badge variant={assignedTruck.sensors.gps ? 'outline' : 'secondary'} className={cn(assignedTruck.sensors.gps && 'border-green-500/50 text-green-500')}>
                                  {assignedTruck.sensors.gps ? 'Active' : 'Inactive'}
                                </Badge>
                           </div>
                       </div>
                    </CardContent>
                </Card>
            </div>
            {/* Right Column */}
             <div>
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><FileText /> Submitted Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-y-auto">
                        <div className="space-y-4">
                            <div>
                                <h4 className='text-sm font-semibold mb-2'>Load-Specific Documents</h4>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                        <TableHead>Document Name</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoadingDocs && (
                                            <TableRow>
                                                <TableCell colSpan={2} className="text-center">Loading documents...</TableCell>
                                            </TableRow>
                                        )}
                                        {submittedDocs?.map((doc) => (
                                        <TableRow key={doc.id}>
                                            <TableCell className="font-medium">{doc.fileName}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon">
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                             <div>
                                <h4 className='text-sm font-semibold mb-2'>Carrier Verification Documents</h4>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Document</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockCarrierDocs.filter(d => d.type !== 'Registration').map((doc) => (
                                            <TableRow key={doc.id}>
                                                <TableCell>
                                                    <p className='font-medium'>{doc.name}</p>
                                                    <p className='text-xs text-muted-foreground'>Expires: {doc.expiryDate}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={cn('border-0', doc.status === 'Approved' ? 'text-green-400 bg-green-500/10' : 'text-yellow-400 bg-yellow-500/10')}>
                                                        {doc.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                   <div className='flex gap-2 justify-end'>
                                                        <Button variant="outline" size="icon" className='h-8 w-8' onClick={() => handleDocumentVerification(doc.id, 'Approved')}>
                                                            <Check className="w-4 h-4" />
                                                        </Button>
                                                         <Button variant="outline" size="icon" className='h-8 w-8' onClick={() => handleDocumentVerification(doc.id, 'Rejected')}>
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                   </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        <DialogFooter className="pt-4 border-t mt-auto flex-col-reverse sm:flex-row gap-2">
          <Button variant="destructive" onClick={() => handleDecision('Rejected')} disabled={isSubmitting}>
              Reject Application
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Close
          </Button>
           <Button onClick={() => handleDecision('Approved')} disabled={isSubmitting || isLoadingDocs}>
              Approve and Assign Load
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    