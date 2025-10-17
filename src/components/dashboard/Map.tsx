import { MapPin } from 'lucide-react';
import type { Truck } from '@/lib/data';

type MapProps = {
  trucks: Truck[];
};

export function Map({ trucks }: MapProps) {
  return (
    <div className="h-64 md:h-96 rounded-lg bg-muted border border-border relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-map-pattern opacity-20"></div>
      <p className="text-muted-foreground z-10 font-semibold">
        Map View Placeholder
      </p>
      {/* Example pins */}
      <MapPin className="absolute top-1/4 left-1/4 text-primary" />
      <MapPin className="absolute top-1/2 right-1/4 text-green-500" />
      <MapPin className="absolute bottom-1/4 left-1/2 text-yellow-500" />
      <MapPin className="absolute top-1/3 right-1/2 text-red-500 animate-pulse" />
    </div>
  );
}
