'use client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MoreHorizontal } from 'lucide-react';
import type { Truck } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ShipmentListItemProps = {
  truck: Truck;
  isSelected: boolean;
  onSelect: () => void;
  onDetails: () => void;
};

function ShipmentListItem({ truck, isSelected, onSelect, onDetails }: ShipmentListItemProps) {
    const statusColors = {
        'On-time': 'bg-green-400/20 text-green-400',
        'Delayed': 'bg-yellow-400/20 text-yellow-400',
        'Idle': 'bg-gray-400/20 text-gray-400',
        'Alert': 'bg-red-400/20 text-red-400',
    };

    return (
        <div 
            onClick={onSelect}
            className={cn(
                "p-3 rounded-lg cursor-pointer transition-colors",
                isSelected ? "bg-primary/10" : "hover:bg-muted/50"
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback>{truck.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{truck.name}</p>
                        <p className="text-sm text-muted-foreground">{truck.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("border-0", statusColors[truck.status])}>{truck.status}</Badge>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onDetails}>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Contact Driver</DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}

type ShipmentListProps = {
  trucks: Truck[];
  selectedTruckId?: string | null;
  onTruckSelect: (truck: Truck) => void;
  onTruckDetails: (truck: Truck) => void;
  title: string;
};

export function ShipmentList({ trucks, selectedTruckId, onTruckSelect, onTruckDetails, title }: ShipmentListProps) {
  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <CardTitle className="flex items-center justify-between font-headline">
            {title}
            <div className="relative w-40">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-8 h-9" />
            </div>
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-2 overflow-y-auto">
            <div className="space-y-2">
            {trucks.map((truck) => (
                <ShipmentListItem 
                    key={truck.id}
                    truck={truck}
                    isSelected={truck.id === selectedTruckId}
                    onSelect={() => onTruckSelect(truck)}
                    onDetails={() => onTruckDetails(truck)}
                />
            ))}
            </div>
        </CardContent>
        <CardFooter>
            <Button variant="outline" className="w-full">View History</Button>
        </CardFooter>
    </Card>
  )
}
