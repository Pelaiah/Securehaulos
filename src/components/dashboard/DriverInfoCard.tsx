'use client';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function DriverInfoCard() {
    const driverImage = PlaceHolderImages.find((img) => img.id === 'driver-avatar');

    return (
        <Card>
            <CardContent className="p-4 flex flex-col items-center text-center">
                {driverImage && (
                    <Avatar className="w-16 h-16 mb-3">
                        <AvatarImage src={driverImage.imageUrl} alt="Alex Williams" />
                        <AvatarFallback>AW</AvatarFallback>
                    </Avatar>
                )}
                <p className="font-semibold">Alex Williams</p>
                <p className="text-xs text-muted-foreground">alexwilliams@gmail.com</p>
                
                <div className="flex gap-8 my-4">
                    <div >
                        <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold">4.8</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Rate</p>
                    </div>
                    <div>
                        <p className="font-bold">7 years</p>
                        <p className="text-xs text-muted-foreground">Driver Experience</p>
                    </div>
                </div>

                <Button className="w-full">Start a chat</Button>
            </CardContent>
        </Card>
    );
}
