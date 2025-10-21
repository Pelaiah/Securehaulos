import { MapPin, Circle, CheckCircle2 } from 'lucide-react';
import type { Truck } from '@/lib/data';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type MapProps = {
  trucks: Truck[];
  selectedTruckId?: string | null;
};

// These positions are hardcoded for demonstration purposes
const truckPositions = [
  { top: '25%', left: '25%' }, // TR-001
  { top: '40%', left: '65%' }, // TR-002
  { top: '70%', left: '30%' }, // TR-003
  { top: '55%', left: '50%' }, // TR-004
];

const tripPoints = [
    { type: 'Start Point', location: 'Jackson Heights', status: 'completed', pos: { top: '30%', left: '20%' } },
    { type: 'Stop Point', location: 'Staten Island', status: 'completed', pos: { top: '50%', left: '40%' } },
    { type: 'Stop Point', location: 'Brooklyn', status: 'active', pos: { top: '40%', left: '68%' } },
    { type: 'Finish Point', location: 'Bay Shore', status: 'pending', pos: { top: '75%', left: '75%' } },
];

export function Map({ trucks = [], selectedTruckId }: MapProps) {
  
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
      {/* Lines between points */}
      {tripPoints.slice(0, -1).map((point, index) => {
        const nextPoint = tripPoints[index + 1];
        const x1 = parseFloat(point.pos.left);
        const y1 = parseFloat(point.pos.top);
        const x2 = parseFloat(nextPoint.pos.left);
        const y2 = parseFloat(nextPoint.pos.top);
        
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

        return (
          <div
            key={`line-${index}`}
            className="absolute h-0.5 bg-primary/50 origin-left"
            style={{
              left: `${x1}%`,
              top: `${y1}%`,
              width: `${length}%`,
              transform: `rotate(${angle}deg)`
            }}
          />
        );
      })}

      {/* Trip Points */}
      {tripPoints.map((point, index) => {
          const isCompleted = point.status === 'completed';
          const isActive = point.status === 'active';
          
          return(
            <div key={`point-${index}`} className="absolute" style={{ top: point.pos.top, left: point.pos.left, transform: 'translate(-50%, -50%)' }}>
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-primary bg-background rounded-full" />
              ) : (
                <Circle className={cn("w-5 h-5 fill-current", isActive ? 'text-primary animate-pulse' : 'text-muted-foreground/50')} />
              )}
            </div>
          )
      })}


      {/* Trucks */}
      {trucks.map((truck, index) => {
        const position = truckPositions[index % truckPositions.length];
        
        let colorClass = 'text-primary';
        if(truck.status === 'On-time') colorClass = 'text-green-500';
        if(truck.status === 'Delayed') colorClass = 'text-yellow-500';
        if(truck.status === 'Idle') colorClass = 'text-gray-500';
        if(truck.status === 'Alert') colorClass = 'text-red-500';
        
        const isSelected = truck.id === selectedTruckId;

        // For this demo, let's assume the first truck is following the trip points path
        const isActiveTripTruck = truck.id === 'TR-001';
        const activePoint = tripPoints.find(p => p.status === 'active');

        let truckStyle = { 
            top: position.top, 
            left: position.left, 
            transform: `translate(-50%, -50%) scale(${isSelected ? 1.5 : 1})` 
        };

        if(isActiveTripTruck && activePoint){
            truckStyle.top = activePoint.pos.top;
            truckStyle.left = activePoint.pos.left;
        }

        return (
          <div
            key={truck.id}
            className="absolute transition-all duration-500"
            style={truckStyle}
          >
            <MapPin className={cn('w-6 h-6 drop-shadow-lg', colorClass, isSelected && 'fill-current')} />
          </div>
        );
      })}
    </div>
  );
}
