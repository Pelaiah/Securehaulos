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
import { CheckCircle, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';

type AcceptLoadConfirmationDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AcceptLoadConfirmationDialog({
  isOpen,
  onOpenChange,
}: AcceptLoadConfirmationDialogProps) {
  const router = useRouter();

  const handleViewMyTrucks = () => {
    onOpenChange(false);
    router.push('/dashboard/my-trucks');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="bg-green-500/10 rounded-full p-3 w-fit">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <DialogTitle className="font-headline text-xl">Load Accepted!</DialogTitle>
          <DialogDescription>
            The load has been successfully assigned to your recommended truck. You can now track it in your "My Trucks" section.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Close
          </Button>
          <Button onClick={handleViewMyTrucks} className="w-full sm:w-auto">
            <Truck className="mr-2 h-4 w-4" />
            View My Trucks
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
