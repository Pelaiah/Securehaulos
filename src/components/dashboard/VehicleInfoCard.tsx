'use client';

import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import type { Truck } from '@/lib/data';

interface VehicleInfoCardProps {
    truck?: Truck | null;
}

export function VehicleInfoCard({ truck }: VehicleInfoCardProps) {
    
    if (!truck) {
        return (
            <Card className="bg-primary/90 text-primary-foreground overflow-hidden flex items-center justify-center">
                <CardContent className="p-6 text-center">
                    <p>Select a trip to view vehicle details.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-primary/90 text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
                <div className="relative aspect-video mb-4">
                    <Image
                        src={truck.imageUrl}
                        alt={truck.name}
                        fill
                        className="object-contain"
                        data-ai-hint="truck side view"
                    />
                </div>
                <h3 className="text-xl font-bold font-headline">{truck.name}</h3>
                <div className="flex items-center gap-1 text-yellow-300">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-primary-foreground/70">Fuel Level</p>
                        <p className="font-semibold">{truck.fuelLevel}%</p>
                    </div>
                     <div>
                        <p className="text-primary-foreground/70">Load Weight</p>
                        <p className="font-semibold">{truck.loadWeight.toLocaleString()} kg</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

    