'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Load } from '@/lib/data';
import {
  MapPin,
  ArrowRight,
  Truck,
  Weight,
  Calendar,
  Clock,
  FileText,
  DollarSign,
  Package,
} from 'lucide-react';

type LoadDetailsDialogProps = {
  load: Load | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LoadDetailsDialog({
  load,
  isOpen,
  onOpenChange,
}: LoadDetailsDialogProps) {
  if (!load) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl flex items-center gap-2">
            <Package />
            {load.cargo}
          </DialogTitle>
          <DialogDescription>
            Posted by {load.shipper}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between text-lg font-semibold">
            <div className="flex items-center gap-2">
              <MapPin className="text-primary" />
              <span>{load.origin}</span>
            </div>
            <ArrowRight className="text-muted-foreground" />
             <div className="flex items-center gap-2">
              <MapPin className="text-primary" />
              <span>{load.destination}</span>
            </div>
          </div>
          
          <Separator />

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
             <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Payout</p>
                <p className="font-bold text-lg text-green-500">${load.payout.toLocaleString()}</p>
              </div>
            </div>
             <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Equipment</p>
                <p className="font-semibold">{load.equipment}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Weight className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Weight</p>
                <p className="font-semibold">22,500 kg</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Pickup Date</p>
                <p className="font-semibold">July 28, 2024</p>
              </div>
            </div>
             <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Est. Delivery</p>
                <p className="font-semibold">July 30, 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Distance</p>
                <p className="font-semibold">372 miles</p>
              </div>
            </div>
          </div>
          
          <Separator />

          <div>
             <h4 className="font-semibold mb-2">Required Documents</h4>
             <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Proof of Insurance</Badge>
                <Badge variant="secondary">Carrier Authority</Badge>
                <Badge variant="secondary">W-9 Form</Badge>
             </div>
          </div>

        </div>
        <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            <Button className="w-full">Accept Load</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
