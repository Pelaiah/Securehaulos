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
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import { drivers } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

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

export function PendingLoadDetailsDialog({
  load,
  isOpen,
  onOpenChange,
}: PendingLoadDetailsDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [assignedTruck, setAssignedTruck] = useState<Truck | null>(null);
  const [isLoadingTruck, setIsLoadingTruck] = useState(false);
  const [carrierData, setCarrierData] = useState<any>(null);
  const [carrierDocs, setCarrierDocs] = useState<CarrierDocument[]>([]);
  const [areCarrierDocsLoading, setAreCarrierDocsLoading] = useState(false);
  const submittedDocs: SubmittedDocument[] = [];
  const isLoadingDocs = false;

  useEffect(() => {
    if (!load?.assignedTruckId) return;
    setIsLoadingTruck(true);
    supabase.from('trucks').select('*').eq('id', load.assignedTruckId).single()
      .then(({ data }) => {
        if (data) setAssignedTruck(data as unknown as Truck);
        setIsLoadingTruck(false);
      });
  }, [load?.assignedTruckId]);

  useEffect(() => {
    if (!load?.carrierId) return;
    supabase.from('carriers').select('*').eq('id', load.carrierId).single()
      .then(({ data }) => {
        if (data) setCarrierData(data);
      });

    setAreCarrierDocsLoading(true);
    supabase.from('verification_documents').select('*').eq('user_id', load.carrierId)
      .then(({ data }) => {
        if (data) setCarrierDocs(data as unknown as CarrierDocument[]);
        setAreCarrierDocsLoading(false);
      });
  }, [load?.carrierId]);

  const assignedDriver = getDriverForTruck(assignedTruck?.id);

  const handleDecision = async (decision: 'Approved' | 'Rejected') => {
    if (!load) return;
    
    setIsSubmitting(true);
    
    try {
        if (decision === 'Approved') {
            await supabase.from('loads').update({ status: 'In Transit' }).eq('id', load.id);
            if (load.assignedTruckId) {
              await supabase.from('trucks').update({ status: 'On-time' }).eq('id', load.assignedTruckId);
            }
            if (load.carrierId) {
              await supabase.from('carriers').update({ verified: true }).eq('id', load.carrierId);
            }
            toast({
                title: 'Load Approved!',
                description: `Carrier has been assigned and load #${load.id} is now In Transit.`,
            });
        } else {
            await supabase.from('loads').update({ status: 'Posted', carrier_id: null, assigned_truck_id: null }).eq('id', load.id);
            if (load.assignedTruckId) {
              await supabase.from('trucks').update({ status: 'Idle' }).eq('id', load.assignedTruckId);
            }
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
            description: error.message || 'An unexpected error occurred. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDocumentVerification = async (docId: string, status: 'Approved' | 'Rejected') => {
    if (!load?.carrierId) return;

    try {
        const { error } = await supabase
          .from('verification_documents')
          .update({ status })
          .eq('id', docId)
          .eq('user_id', load.carrierId);

        if (error) throw error;

        setCarrierDocs(prev => prev.map(d => d.id === docId ? { ...d, status } : d));

        toast({
            title: `Document ${status}`,
            description: `The document has been marked as ${status.toLowerCase()}.`
        });
    } catch (error: any) {
        toast({
            title: 'Verification Failed',
            description: 'Could not update the document status. Please check permissions.',
            variant: 'destructive'
        });
    }
  };

  if (!load) return null;

  const isVerified = carrierData?.verified;
  const isLoading = isLoadingTruck || areCarrierDocsLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Review Application for Load #{load.id}
          </DialogTitle>
           {carrierData && <DialogDescription>
            Carrier <span className="font-semibold">{carrierData.companyName}</span> has applied for this load. Review their details and documents below.
          </DialogDescription>}
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
                            <p className="font-semibold">{carrierData?.companyName || 'Loading...'}</p>
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
                        {isLoadingTruck ? <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div> : assignedTruck ? (
                            <>
                                <div className='relative aspect-video'>
                                   {assignedTruck.imageUrl && <Image src={assignedTruck.imageUrl} alt={assignedTruck.name} fill className="object-contain" data-ai-hint="truck side view" />}
                               </div>
                               <p className="font-semibold text-center">{assignedTruck.name}</p>
                               <div className="grid grid-cols-3 gap-4 text-center text-xs">
                                   <div className="flex flex-col items-center gap-1">
                                        {assignedTruck?.sensors?.door ? <ShieldCheck className="w-6 h-6 text-green-500" /> : <ShieldAlert className="w-6 h-6 text-yellow-500" />}
                                        <p>Door Sensor</p>
                                        <Badge variant={assignedTruck?.sensors?.door ? 'outline' : 'secondary'} className={cn(assignedTruck?.sensors?.door && 'border-green-500/50 text-green-500')}>
                                          {assignedTruck?.sensors?.door ? 'Equipped' : 'Not Present'}
                                        </Badge>
                                   </div>
                                    <div className="flex flex-col items-center gap-1">
                                        {assignedTruck?.sensors?.temperature ? <Thermometer className="w-6 h-6 text-green-500" /> : <Thermometer className="w-6 h-6 text-muted-foreground" />}
                                        <p>Temp. Sensor</p>
                                        <Badge variant={assignedTruck?.sensors?.temperature ? 'outline' : 'secondary'} className={cn(assignedTruck?.sensors?.temperature && 'border-green-500/50 text-green-500')}>
                                          {assignedTruck?.sensors?.temperature ? 'Equipped' : 'Not Present'}
                                        </Badge>
                                   </div>
                                    <div className="flex flex-col items-center gap-1">
                                        {assignedTruck?.sensors?.gps ? <GpsIcon className="w-6 h-6 text-green-500" /> : <GpsIcon className="w-6 h-6 text-muted-foreground" />}
                                        <p>GPS Tracking</p>
                                        <Badge variant={assignedTruck?.sensors?.gps ? 'outline' : 'secondary'} className={cn(assignedTruck?.sensors?.gps && 'border-green-500/50 text-green-500')}>
                                          {assignedTruck?.sensors?.gps ? 'Active' : 'Inactive'}
                                        </Badge>
                                   </div>
                               </div>
                            </>
                        ) : <p className='text-muted-foreground text-center py-8'>No truck assigned.</p>}
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
                                                <Button variant="ghost" size="icon" asChild>
                                                   <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        ))}
                                         {submittedDocs?.length === 0 && !isLoadingDocs && (
                                            <TableRow>
                                                <TableCell colSpan={2} className="text-center text-muted-foreground">No load-specific documents submitted.</TableCell>
                                            </TableRow>
                                        )}
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
                                        {areCarrierDocsLoading && (
                                             <TableRow>
                                                <TableCell colSpan={3} className="text-center">Loading documents...</TableCell>
                                            </TableRow>
                                        )}
                                        {carrierDocs?.map((doc) => (
                                            <TableRow key={doc.id}>
                                                <TableCell>
                                                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline flex items-center gap-2">
                                                        <Download className="w-3 h-3 text-muted-foreground"/>
                                                        <span>{doc.name}</span>
                                                    </a>
                                                    <p className='text-xs text-muted-foreground'>Expires: {doc.expiryDate || 'N/A'}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={cn('border-0', doc.status === 'Approved' ? 'text-green-400 bg-green-500/10' : 'text-yellow-400 bg-yellow-500/10')}>
                                                        {doc.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                   <div className='flex gap-2 justify-end'>
                                                        <Button variant="outline" size="icon" className='h-8 w-8' onClick={() => handleDocumentVerification(doc.id, 'Approved')} disabled={doc.status === 'Approved'}>
                                                            <Check className="w-4 h-4" />
                                                        </Button>
                                                         <Button variant="outline" size="icon" className='h-8 w-8' onClick={() => handleDocumentVerification(doc.id, 'Rejected')} disabled={doc.status === 'Rejected'}>
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                   </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {carrierDocs?.length === 0 && !areCarrierDocsLoading && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-muted-foreground">No carrier documents found.</TableCell>
                                            </TableRow>
                                        )}
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
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject Application
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Close
          </Button>
           <Button onClick={() => handleDecision('Approved')} disabled={isSubmitting || isLoading}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Approve and Assign Load
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
