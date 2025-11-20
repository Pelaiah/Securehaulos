'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Truck } from '@/lib/data';

interface VehicleInfoCardProps {
  truck?: Truck | null;
}

export function VehicleInfoCard({ truck }: VehicleInfoCardProps) {
  if (!truck) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Wheeled Robot Trailer</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p>Select a trip to view vehicle details.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Wheeled Robot Trailer</CardTitle>
        <p className="text-sm text-muted-foreground">{truck.id}</p>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video mb-4">
          <Image
            src="https://i.imgur.com/uFLl3cT.png"
            alt={truck.name}
            fill
            className="object-contain"
            data-ai-hint="futuristic truck"
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Load Weight</p>
            <p className="font-semibold">{truck.loadWeight.toLocaleString()} lbs</p>
          </div>
          <div>
            <p className="text-muted-foreground">Volume</p>
            <p className="font-semibold">70,243 in³</p>
          </div>
          <div>
            <p className="text-muted-foreground">Cargo Area (L)</p>
            <p className="font-semibold">24 in</p>
          </div>
          <div>
            <p className="text-muted-foreground">Cargo Area (W)</p>
            <p className="font-semibold">12 in</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
