'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Truck } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TrackingListProps {
    trucks: Truck[];
    selectedTruckId?: string | null;
    onTruckSelect: (truck: Truck) => void;
}

interface TruckListItemProps {
    truck: Truck;
    isSelected: boolean;
    onClick: () => void;
}

const statusColors = {
    'On Route': 'text-green-500',
    'Waiting': 'text-yellow-500',
    'Inactive': 'text-gray-500',
    'Alert': 'text-red-500',
};

const getStatusForDisplay = (truck: Truck) => {
    if(truck.status === 'Idle' || truck.status === 'Delayed') return 'Waiting';
    if(truck.status === 'On-time') return 'On Route';
    return truck.status;
}

const TruckListItem: React.FC<TruckListItemProps> = ({ truck, isSelected, onClick }) => {
    const displayStatus = getStatusForDisplay(truck);
    
    return (
        <Card
            className={cn(
                "cursor-pointer transition-all hover:shadow-md hover:bg-card-alt",
                isSelected ? "border-primary bg-card-alt" : "border-border"
            )}
            onClick={onClick}
        >
            <CardContent className="p-3">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-semibold">{truck.id}</p>
                    <p className={cn("text-xs font-semibold", statusColors[displayStatus as keyof typeof statusColors] || 'text-muted-foreground')}>
                        {displayStatus}
                    </p>
                </div>
                 <div className="relative w-full h-20">
                    <Image src="https://i.imgur.com/uFLl3cT.png" alt={`Image of ${truck.name}`} fill style={{ objectFit: 'contain' }} data-ai-hint="truck side view"/>
                </div>
                <div className="text-xs text-muted-foreground mt-2 flex justify-between">
                     <span>00:33m</span>
                    <span>23.4mi, left</span>
                </div>
            </CardContent>
        </Card>
    );
};

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);


export function TrackingList({ trucks, selectedTruckId, onTruckSelect }: TrackingListProps) {
    const filteredTrucks = trucks.filter(truck => {
        const displayStatus = getStatusForDisplay(truck);
        return displayStatus === 'On Route' || displayStatus === 'Waiting' || displayStatus === 'Alert';
    });

    return (
        <div className="h-full flex flex-col gap-4">
            <header className="space-y-4">
                <div className='flex justify-between items-center'>
                    <h1 className="text-xl font-bold">Active Trucks</h1>
                    <Search className="w-5 h-5 text-muted-foreground" />
                </div>
            </header>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto">
                {filteredTrucks.map(truck => (
                    <TruckListItem 
                        key={truck.id}
                        truck={truck}
                        isSelected={truck.id === selectedTruckId}
                        onClick={() => onTruckSelect(truck)}
                    />
                ))}
            </div>
        </div>
    );
}
