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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Driver, Document, Load, Truck } from '@/lib/data';
import { useState } from 'react';
import {
  FileText,
  Truck as TruckIcon,
  User,
  ShieldCheck,
  ShieldAlert,
  Thermometer,
  MapPin as GpsIcon,
  Contact
} from 'lucide-react';
import Image from 'next/image';
import { drivers, documents as mockCarrierDocs } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';


type PendingLoadDetailsDialogProps = {
  load: Load | null;
  assignedTruck: Truck | undefined;
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
  assignedTruck,
  isOpen,
  onOpenChange,
}: PendingLoadDetailsDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const assignedDriver = getDriverForTruck(assignedTruck?.id);

  const documentStatusColors: { [key: string]: string } = {
    Approved: 'text-green-400 bg-green-500/10',
    Pending: 'text-yellow-400 bg-yellow-500/10',
    Rejected: 'text-red-400 bg-red-500/10',
    Expired: 'text-gray-400 bg-gray-500/10',
  };

  const handleDecision = async (decision: 'Approved' | 'Rejected') => {
    if (!load || !firestore || !assignedTruck) return;
    
    setIsSubmitting(true);
    try {
        const loadRef = doc(firestore, 'loads', load.id);
        const truckRef = doc(firestore, 'trucks', assignedTruck.id);
        
        if (decision === 'Approved') {
            await updateDoc(loadRef, { status: 'In Transit' });
            await updateDoc(truckRef, { status: 'On-time' });
            toast({
                title: 'Load Approved!',
                description: `Carrier has been assigned and load #${load.id} is now In Transit.`,
            });
        } else {
            await updateDoc(loadRef, { status: 'Posted' });
            await updateDoc(truckRef, { status: 'Idle' });
             toast({
                title: 'Application Rejected',
                description: `Load #${load.id} has been returned to the load board.`,
                variant: 'destructive'
            });
        }

        onOpenChange(false);
    } catch (error) {
        console.error('Error updating status:', error);
        toast({
            title: 'Error',
            description: 'Failed to update load status. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (!load || !assignedTruck || !assignedDriver) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Review Application for Load #{load.id}
          </DialogTitle>
          <DialogDescription>
            Carrier <span className="font-semibold">{load.shipper}</span> has applied for this load. Review their details and documents below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 flex-grow overflow-y-auto pr-2 -mx-6 px-6">
            {/* Left Column */}
            <div className='space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline"><Contact /> Carrier & Driver Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div>
                            <p className="text-sm text-muted-foreground">Carrier Company</p>
                            <p className="font-semibold">{load.shipper}</p>
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
                                <Badge variant={assignedTruck.sensors.door ? "outline" : "secondary"} className={cn(assignedTruck.sensors.door && "border-green-500/50 text-green-500")}>
                                  {assignedTruck.sensors.door ? 'Equipped' : 'Not Present'}
                                </Badge>
                           </div>
                            <div className="flex flex-col items-center gap-1">
                                {assignedTruck.sensors.temperature ? <Thermometer className="w-6 h-6 text-green-500" /> : <Thermometer className="w-6 h-6 text-muted-foreground" />}
                                <p>Temp. Sensor</p>
                                <Badge variant={assignedTruck.sensors.temperature ? "outline" : "secondary"} className={cn(assignedTruck.sensors.temperature && "border-green-500/50 text-green-500")}>
                                  {assignedTruck.sensors.temperature ? 'Equipped' : 'Not Present'}
                                </Badge>
                           </div>
                            <div className="flex flex-col items-center gap-1">
                                {assignedTruck.sensors.gps ? <GpsIcon className="w-6 h-6 text-green-500" /> : <GpsIcon className="w-6 h-6 text-muted-foreground" />}
                                <p>GPS Tracking</p>
                                <Badge variant={assignedTruck.sensors.gps ? "outline" : "secondary"} className={cn(assignedTruck.sensors.gps && "border-green-500/50 text-green-500")}>
                                  {assignedTruck.sensors.gps ? 'Active' : 'Inactive'}
                                </Badge>
                           </div>
                       </div>
                    </CardContent>
                </Card>
            </div>
            {/* Right Column */}
             <div>
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><FileText /> Submitted Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Document Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Expires</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockCarrierDocs.slice(0,3).map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="font-medium">{doc.name}</TableCell>
                                    <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={cn('border-0', documentStatusColors[doc.status])}
                                    >
                                        {doc.status}
                                    </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{doc.expiryDate || 'N/A'}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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
           <Button onClick={() => handleDecision('Approved')} disabled={isSubmitting}>
              Approve and Assign Load
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
