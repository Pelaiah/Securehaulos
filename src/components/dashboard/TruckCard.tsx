'use client';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import type { Truck } from '@/lib/data';
import {
  ShieldCheck,
  ShieldOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type TruckCardProps = {
  truck: Truck;
  onClick: () => void;
};

export function TruckCard({ truck, onClick }: TruckCardProps) {
  const statusColors = {
    'On-time': 'bg-green-500/20 text-green-400 border-green-500/30',
    Delayed: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Idle: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    Alert: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md hover:border-primary/50 relative overflow-hidden bg-card-alt/50',
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
          {truck.cargoIntegrity ? (
            <ShieldCheck className="w-5 h-5 text-green-500" />
          ) : (
            <ShieldOff className="w-5 h-5 text-red-500" />
          )}
        </div>
        <div className="relative w-full aspect-[16/9]">
            <Image src="https://i.imgur.com/gJt3wGk.png" alt={`Image of ${truck.name}`} fill style={{objectFit: "contain"}} data-ai-hint="truck side view" />
        </div>
        <div className='flex justify-between text-sm'>
            <p className='font-medium'>{truck.id}</p>
            <p className='text-muted-foreground'>{truck.status}</p>
        </div>

      </CardContent>
    </Card>
  );
}
