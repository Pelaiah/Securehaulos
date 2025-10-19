import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Truck } from '@/lib/data';
import {
  Clock,
  Fuel,
  MapPin,
  ShieldCheck,
  ShieldOff,
  Truck as TruckIcon,
  Weight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TruckCardProps = {
  truck: Truck;
  onClick: () => void;
};

export function TruckCard({ truck, onClick }: TruckCardProps) {
  const statusColors = {
    'On-time': 'bg-green-500/20 text-green-400 border-green-500/30',
    Delayed: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Idle: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    Alert: 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse',
  };

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all hover:shadow-md hover:border-primary/50',
        truck.unauthorizedDoorOpening && 'border-destructive border-2 hover:border-destructive'
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 font-headline">
              <TruckIcon className="w-5 h-5" />
              {truck.name}
            </CardTitle>
            <CardDescription>{truck.id}</CardDescription>
          </div>
          <Badge className={cn(statusColors[truck.status], 'ml-auto')}>
            {truck.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Fuel className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="font-semibold">{truck.fuelLevel}%</p>
            <p className="text-muted-foreground">Fuel</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Weight className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="font-semibold">
              {truck.loadWeight.toLocaleString()} kg
            </p>
            <p className="text-muted-foreground">Load</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="font-semibold">{truck.idleTime}</p>
            <p className="text-muted-foreground">Idle Time</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {truck.cargoIntegrity ? (
            <ShieldCheck className="w-4 h-4 text-green-500" />
          ) : (
            <ShieldOff className="w-4 h-4 text-red-500" />
          )}
          <div>
            <p
              className={cn(
                'font-semibold',
                truck.cargoIntegrity ? 'text-green-500' : 'text-red-500'
              )}
            >
              {truck.cargoIntegrity ? 'Secure' : 'Compromised'}
            </p>
            <p className="text-muted-foreground">Cargo</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
