import { MapPin } from 'lucide-react';
import type { Truck } from '@/lib/data';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type MapProps = {
  trucks: Truck[];
  selectedTruckId?: string | null;
};

export function Map({ trucks, selectedTruckId }: MapProps) {
  // Define positions for the 4 trucks as percentages for responsive placement
  const truckPositions = [
    { top: '25%', left: '25%' }, // TR-001
    { top: '40%', left: '65%' }, // TR-002
    { top: '70%', left: '30%' }, // TR-003
    { top: '55%', left: '50%' }, // TR-004
  ];

  return (
    <div className="h-96 rounded-lg bg-card relative overflow-hidden border">
      <Image
        src="https://i.imgur.com/7lNiwq1.png"
        alt="City map background"
        layout="fill"
        objectFit="cover"
        className="opacity-20"
        data-ai-hint="city map"
      />
      {trucks.map((truck, index) => {
        const position = truckPositions[index % truckPositions.length];
        
        let colorClass = 'text-primary';
        if(truck.status === 'On-time') colorClass = 'text-green-500';
        if(truck.status === 'Delayed') colorClass = 'text-yellow-500';
        if(truck.status === 'Idle') colorClass = 'text-gray-500';
        if(truck.status === 'Alert') colorClass = 'text-red-500';
        
        const isSelected = truck.id === selectedTruckId;

        return (
          <div
            key={truck.id}
            className="absolute transition-transform duration-300"
            style={{ top: position.top, left: position.left, transform: `translate(-50%, -50%) scale(${isSelected ? 1.5 : 1})` }}
          >
            <MapPin className={cn('w-6 h-6 drop-shadow-lg', colorClass, isSelected && 'fill-current')} />
          </div>
        );
      })}
    </div>
  );
}
