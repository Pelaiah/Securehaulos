'use client';

import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function VehicleInfoCard() {
    const carImage = PlaceHolderImages.find((img) => img.id === 'volvo-xc40');

    return (
        <Card className="bg-primary/90 text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
                {carImage && (
                    <div className="relative aspect-[4/3] mb-4">
                        <Image
                            src={carImage.imageUrl}
                            alt="Volvo XC40"
                            fill
                            className="object-contain"
                            data-ai-hint={carImage.imageHint}
                        />
                    </div>
                )}
                <h3 className="text-xl font-bold font-headline">Volvo XC40</h3>
                <div className="flex items-center gap-1 text-yellow-300">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-primary-foreground/70">Mileage</p>
                        <p className="font-semibold">72,487 km</p>
                    </div>
                     <div>
                        <p className="text-primary-foreground/70">Battery charge time</p>
                        <p className="font-semibold">3 to 42h at 220V</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
