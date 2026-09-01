'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { Truck } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Truck as TruckIcon,
  User,
  Clock,
  Fuel,
  Weight,
  Thermometer,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  MapPin,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type TruckDetailsDialogProps = {
  truck: Truck | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEditClick?: () => void;
};

const statusColors: Record<string, string> = {
  'On-time': 'text-green-500 bg-green-500/10',
  Delayed: 'text-yellow-500 bg-yellow-500/10',
  Idle: 'text-gray-500 bg-gray-500/10',
  Alert: 'text-red-500 bg-red-500/10',
  Pending: 'text-orange-500 bg-orange-500/10',
  Incomplete: 'text-amber-500 bg-amber-500/10',
};

export function TruckDetailsDialog({
  truck,
  isOpen,
  onOpenChange,
  onEditClick,
}: TruckDetailsDialogProps) {
  if (!truck) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between font-headline">
            <div className="flex items-center gap-2">
              <TruckIcon />
              <span>{truck.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn(statusColors[truck.status] || statusColors['Idle'])}>
                {truck.status}
              </Badge>
              {onEditClick && (
                <Button size="sm" variant="outline" onClick={onEditClick}>
                  <Wrench className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            ID: {truck.id} &bull; License Plate: {truck.licensePlate || 'Not Set'} {truck.truckType ? `• Type: ${truck.truckType}` : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Trip Progress</p>
            <div className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2 truncate">
                <MapPin className="h-4 w-4 text-green-500" />
                <span className="truncate">Los Angeles, CA</span>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex items-center gap-2 truncate">
                <Link href={`/dashboard/shipper/tracking/${truck.id}`} className="flex items-center gap-2 text-red-500 hover:underline">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">Phoenix, AZ</span>
                </Link>
              </div>
            </div>
            <Link href={`/dashboard/shipper/tracking/${truck.id}`} className="cursor-pointer">
              <Progress value={65} className="h-2" />
            </Link>
            <p className="text-xs text-muted-foreground text-right">65% complete</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Driver</p>
                <p className="font-semibold">Alex Ray</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Idle Time</p>
                <p className="font-semibold">{truck.idleTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Fuel className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Fuel Level</p>
                <p className="font-semibold">{truck.fuelLevel}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Weight className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Load Weight / Capacity</p>
                <p className="font-semibold">{truck.loadWeight || 0} kg {truck.tonnage ? `(${truck.tonnage} Tons)` : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Reefer Temp.</p>
                <p className="font-semibold">-2°C</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {truck.cargoIntegrity ? (
                <ShieldCheck className="w-5 h-5 text-green-500" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className="text-muted-foreground">Cargo Integrity</p>
                <p className={cn("font-semibold", truck.cargoIntegrity ? 'text-green-500' : 'text-red-500')}>
                  {truck.cargoIntegrity ? 'Secure' : 'Compromised'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
