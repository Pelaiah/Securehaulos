import { MapPin } from 'lucide-react';
import type { Truck } from '@/lib/data';
import Image from 'next/image';

type MapProps = {
  trucks: Truck[];
};

export function Map({ trucks }: MapProps) {
  // Define positions for the 4 trucks as percentages for responsive placement
  const truckPositions = [
    { top: '25%', left: '25%' }, // TR-001
    { top: '40%', left: '65%' }, // TR-002
    { top: '70%', left: '30%' }, // TR-003
    { top: '55%', left: '50%' }, // TR-004
  ];

  return (
    <div className="h-64 md:h-96 rounded-lg bg-muted border border-border relative overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1594951944996-9878174b9a9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYXAlMjBjaXR5fGVufDB8fHx8MTc2MDczNTAwMHww&ixlib=rb-4.1.0&q=80&w=1080"
        alt="City map background"
        fill
        className="object-cover opacity-30"
        data-ai-hint="city map"
      />
      {trucks.map((truck, index) => {
        const position = truckPositions[index % truckPositions.length];
        let colorClass = 'text-primary';
        if(truck.status === 'On-time') colorClass = 'text-green-500';
        if(truck.status === 'Delayed') colorClass = 'text-yellow-500';
        if(truck.status === 'Idle') colorClass = 'text-gray-500';
        if(truck.status === 'Alert') colorClass = 'text-red-500 animate-pulse';

        return (
          <div
            key={truck.id}
            className="absolute"
            style={{ top: position.top, left: position.left, transform: 'translate(-50%, -50%)' }}
          >
            <MapPin className={`w-6 h-6 ${colorClass}`} />
          </div>
        );
      })}
    </div>
  );
}
