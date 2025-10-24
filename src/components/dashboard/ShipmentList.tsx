'use client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MoreHorizontal } from 'lucide-react';
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
            "block p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer",
            isSelected && "bg-accent"
          )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Earned</p>
                    <p className="font-bold text-lg">${item.earned}</p>
                </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
                 <Badge variant="outline" className={cn("border-0 text-xs", statusColors[item.status])}>{item.status}</Badge>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Contact</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
    <Card className="h-full flex flex-col bg-card-alt border-0">
        <CardHeader>
            <CardTitle className="flex items-center justify-between font-headline text-xl">
            {title}
            <div className="relative w-32">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-8 h-9 bg-background/50" />
            </div>
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-2 overflow-y-auto">
            <div className="space-y-2">
            {tripData.map((trip) => (
                <TripListItem 
                    key={trip.id}
                    item={trip}
                    onTripSelect={onTripSelect}
                    isSelected={trip.id === selectedTripId}
                />
            ))}
            </div>
        </CardContent>
        <CardFooter>
            <Button variant="outline" className="w-full bg-primary/20 border-primary/50 text-primary-foreground hover:bg-primary/30">View History</Button>
        </CardFooter>
    </Card>
  )
}

    