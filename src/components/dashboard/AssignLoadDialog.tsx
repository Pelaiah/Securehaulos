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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Load, Truck } from '@/lib/data';
import { Loader2, Truck as TruckIcon } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { useFirestore, errorEmitter, FirestorePermissionError, useUser } from '@/firebase';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';

type AssignLoadDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  load: Load | null;
  availableTrucks: (Truck & { equipmentType: string })[];
};

export function AssignLoadDialog({
  isOpen,
  onOpenChange,
  load,
  availableTrucks,
}: AssignLoadDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTruckId, setSelectedTruckId] = useState<string | undefined>();
  const [files, setFiles] = useState<File[]>([]);

  const handleAssignLoad = async () => {
    if (!load || !firestore || !selectedTruckId || !user) return;

    if (!selectedTruckId) {
      toast({
        variant: 'destructive',
        title: 'No Truck Selected',
        description: 'Please select a truck to assign this load to.',
      });
      return;
    }

    if (files.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Documents Required',
        description: 'Please upload the required documents.',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
        const batch = writeBatch(firestore);

        const loadRef = doc(firestore, 'loads', load.id);
        const truckRef = doc(firestore, 'trucks', selectedTruckId);

        const loadUpdateData = { status: 'Pending', carrierId: user.uid, assignedTruckId: selectedTruckId };
        const truckUpdateData = { status: 'Pending' };

        batch.update(loadRef, loadUpdateData);
        batch.update(truckRef, truckUpdateData);
        
        // In a real app, you would upload files to Firebase Storage and get URLs.
        // For this demo, we'll just create document references with mock data.
        files.forEach((file) => {
            const docRef = doc(firestore, 'loads', load.id, 'submitted_documents', file.name.replace(/[^a-zA-Z0-9]/g, ''));
            const docData = {
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                status: 'Submitted',
                submittedAt: new Date().toISOString(),
                // In a real app, this would be a gs:// or https:// URL from Firebase Storage.
                fileUrl: 'https://example.com/placeholder.pdf',
            };
            batch.set(docRef, docData);
        });
        
        await batch.commit();

        toast({
            title: 'Documents Submitted for Review',
            description: `The shipper will now review your application for load #${load.id}.`,
        });
        onOpenChange(false);
        router.push('/dashboard/my-trucks');

    } catch (error: any) {
        console.error("Error during load assignment:", error);
        toast({
            title: 'Assignment Failed',
            description: error.message || 'An unexpected error occurred. Please check security rules and try again.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!load) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">
            Assign Load
          </DialogTitle>
          <DialogDescription>
            Assign a truck and upload documents for Load ID:{' '}
            <span className="font-semibold text-foreground">{load.id}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4 overflow-y-auto pr-4 flex-grow">
          <div>
            <label className="text-sm font-medium">Available Trucks</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {availableTrucks.map((truck) => (
                <Button
                  key={truck.id}
                  variant={
                    selectedTruckId === truck.id ? 'default' : 'outline'
                  }
                  className="h-auto flex-col items-start p-3 gap-2"
                  onClick={() => setSelectedTruckId(truck.id)}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <TruckIcon className="w-4 h-4" />
                    <span>{truck.name}</span>
                  </div>
                  <span className="font-normal text-xs text-muted-foreground">
                    {truck.equipmentType}
                  </span>
                </Button>
              ))}
            </div>
            {availableTrucks.length === 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                No idle trucks available.
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Required Documents</label>
            <FileUpload onFilesChange={setFiles} />
          </div>
        </div>
        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4 border-t mt-auto">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignLoad}
            disabled={isSubmitting || availableTrucks.length === 0 || !selectedTruckId}
            className="w-full sm:w-auto"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign and Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
