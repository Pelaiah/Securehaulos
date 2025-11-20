'use client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Package } from 'lucide-react';
import type { Truck } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { tripData, type tripData as TripDataType } from '@/lib/data';
import React from 'react';
import { Separator } from '../ui/separator';

type Trip = (typeof tripData)[0];

type TripListItemProps = {
  item: Trip;
  onTripSelect: (trip: Trip) => void;
  isSelected: boolean;
};

function TripListItem({ item, onTripSelect, isSelected }: TripListItemProps) {
    const statusColors = {
        'Active': 'bg-yellow-400/20 text-yellow-400',
        'Completed': 'bg-green-400/20 text-green-400',
    };

    return (
        <div 
          onClick={() => onTripSelect(item)}
          className={cn(
            "block p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer",
            isSelected && "bg-accent"
          )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className='p-3 bg-muted rounded-md'>
                        <Package className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="font-semibold">#{item.truckId}</p>
                        <p className="text-sm text-muted-foreground">{item.name}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold">${item.earned}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
            </div>
        </div>
    );
}

type ShipmentListProps = {
  title: string;
  onTripSelect: (trip: Trip) => void;
  selectedTripId?: string | null;
};

export function ShipmentList({ title, onTripSelect, selectedTripId }: ShipmentListProps) {

  return (
    <Card className="h-full flex flex-col bg-card border-0">
        <CardHeader>
            <CardTitle className="font-headline text-xl">
            {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-2 overflow-y-auto">
            <div className="space-y-1">
            {tripData.map((trip, index) => (
                <React.Fragment key={trip.id}>
                    <TripListItem 
                        item={trip}
                        onTripSelect={onTripSelect}
                        isSelected={trip.id === selectedTripId}
                    />
                    {index < tripData.length -1 && <Separator />}
                </React.Fragment>
            ))}
            </div>
        </CardContent>
    </Card>
  )
}
