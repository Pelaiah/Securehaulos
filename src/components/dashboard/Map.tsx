'use client';
import { MapPin, Circle, CheckCircle2 } from 'lucide-react';
import type { Truck } from '@/lib/data';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

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
  const mapRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    if (mapRef.current) {
      resizeObserver.observe(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        resizeObserver.unobserve(mapRef.current);
      }
    };
  }, []);
  
  const activePoint = tripPoints.find(p => p.status === 'active');
  
  return (
    <div ref={mapRef} className="h-full w-full rounded-lg bg-card relative overflow-hidden border">
      <Image
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNnx8bWFwfGVufDB8fHx8MTc2MTU1MjIxMXww&ixlib=rb-4.1.0&q=80&w=1080"
        alt="City map background"
        layout="fill"
        objectFit="cover"
        className="opacity-20"
        data-ai-hint="dark city map"
      />
      {/* Lines between points */}
      {dimensions.width > 0 && tripPoints.slice(0, -1).map((point, index) => {
        const nextPoint = tripPoints[index + 1];
        
        const x1 = parseFloat(point.pos.left) / 100 * dimensions.width;
        const y1 = parseFloat(point.pos.top) / 100 * dimensions.height;
        const x2 = parseFloat(nextPoint.pos.left) / 100 * dimensions.width;
        const y2 = parseFloat(nextPoint.pos.top) / 100 * dimensions.height;
        
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

        return (
          <div
            key={`line-${index}`}
            className="absolute h-0.5 bg-primary/50 origin-left"
            style={{
              left: `${x1}px`,
              top: `${y1}px`,
              width: `${length}px`,
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
                <div className="relative flex items-center justify-center">
                    {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-primary bg-background rounded-full" />
                    ) : (
                        <Circle className={cn("w-5 h-5 fill-current", isActive ? 'text-primary' : 'text-muted-foreground/50')} />
                    )}
                    {isActive && (
                         <div className="absolute w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
                    )}
                </div>
            </div>
          )
      })}


      {/* Truck Position */}
      {selectedTruckId && activePoint && (
          <div
            className="absolute transition-all duration-500"
            style={{
                top: activePoint.pos.top, 
                left: activePoint.pos.left, 
                transform: `translate(-50%, -50%) scale(1.5)` 
            }}
          >
            <MapPin className='w-8 h-8 drop-shadow-lg text-primary fill-current' />
          </div>
        )}
    </div>
  );
}
