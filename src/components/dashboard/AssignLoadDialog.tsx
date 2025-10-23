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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Load, Truck } from '@/lib/data';
import { Loader2 } from 'lucide-react';
import { FileUpload } from './FileUpload';

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
  availableTrucks
}: AssignLoadDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTruckId, setSelectedTruckId] = useState<string | undefined>();
  const [files, setFiles] = useState<File[]>([]);

  const handleAssignLoad = () => {
    if (!selectedTruckId) {
        toast({
            variant: 'destructive',
            title: 'No Truck Selected',
            description: 'Please select a truck to assign this load to.'
        });
        return;
    }

    if (files.length === 0) {
        toast({
            variant: 'destructive',
            title: 'Documents Required',
            description: 'Please upload the required documents.'
        });
        return;
    }


    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
        setIsSubmitting(false);
        onOpenChange(false);
        toast({
            title: 'Load Assigned Successfully!',
            description: `${load?.cargo} has been assigned to truck ${selectedTruckId}.`,
        });
        router.push('/dashboard/my-trucks');
    }, 1500);

  };

  if (!load) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">Assign Load</DialogTitle>
          <DialogDescription>
            Assign a truck and upload documents for Load ID: <span className="font-semibold text-foreground">{load.id}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 overflow-y-auto pr-4">
             <div>
                <label className="text-sm font-medium">Available Trucks</label>
                 <Select onValueChange={setSelectedTruckId} value={selectedTruckId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an available truck..." />
                    </SelectTrigger>
                    <SelectContent>
                        {availableTrucks.map(truck => (
                            <SelectItem key={truck.id} value={truck.id}>
                                {truck.name} ({truck.equipmentType})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {availableTrucks.length === 0 && <p className="text-xs text-muted-foreground mt-1">No idle trucks available.</p>}
             </div>
             <div>
                <label className="text-sm font-medium">Required Documents</label>
                <FileUpload onFilesChange={setFiles} />
             </div>
        </div>
        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4 border-t mt-auto">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleAssignLoad} disabled={isSubmitting || availableTrucks.length === 0} className="w-full sm:w-auto">
             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign and Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
