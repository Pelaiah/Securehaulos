'use client';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import type { Truck } from '@/lib/data';
import {
  ShieldCheck,
  ShieldOff,
  Fuel,
  Weight,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '../ui/badge';

type TruckCardProps = {
  truck: Truck;
  onClick: () => void;
};

export function TruckCard({ truck, onClick }: TruckCardProps) {
  const statusColors = {
    'On-time': 'bg-green-500/20 text-green-400 border-transparent',
    'Delayed': 'bg-yellow-500/20 text-yellow-400 border-transparent',
    'Idle': 'bg-gray-500/20 text-gray-400 border-transparent',
    'Alert': 'bg-red-500/20 text-red-400 border-transparent',
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md hover:border-primary/50 relative overflow-hidden bg-card',
        truck.unauthorizedDoorOpening &&
          'border-destructive/50 animate-red-alert-sweep bg-gradient-to-r from-destructive/20 via-destructive/5 to-destructive/20'
      )}
      style={
        truck.unauthorizedDoorOpening
          ? ({ '--bg-size': '400%' } as React.CSSProperties)
          : undefined
      }
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <p className='font-bold'>{truck.name}</p>
          <Badge variant="outline" className={cn("text-xs", statusColors[truck.status])}>
            {truck.status}
          </Badge>
        </div>
        <div className="relative w-full aspect-video my-2">
            <Image src="https://i.imgur.com/gJt3wGk.png" alt={`Image of ${truck.name}`} fill style={{objectFit: "contain"}} data-ai-hint="truck side view" />
        </div>
        <div className='flex justify-between text-sm text-muted-foreground'>
            <div className="flex items-center gap-1">
              <Fuel className="w-4 h-4" />
              <span>{truck.fuelLevel}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Weight className="w-4 h-4" />
              <span>{truck.loadWeight} kg</span>
            </div>
             <div className="flex items-center gap-1">
              {truck.cargoIntegrity ? (
                <ShieldCheck className="w-4 h-4 text-green-500" />
              ) : (
                <ShieldOff className="w-4 h-4 text-red-500" />
              )}
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
