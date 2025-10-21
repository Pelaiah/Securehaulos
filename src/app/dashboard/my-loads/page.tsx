'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { loads, type Load } from '@/lib/data';
import { MoreHorizontal, PlusCircle, ArrowRight, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Extend Load type to include status for the shipper view
type ShipperLoad = Load & { status: 'Posted' | 'In Transit' | 'Delivered'; bids: number };

const myLoads: ShipperLoad[] = loads.map((load, index) => ({
    ...load,
    status: index % 3 === 0 ? 'Posted' : index % 2 === 0 ? 'In Transit' : 'Delivered',
    bids: Math.floor(Math.random() * 5),
}));


export default function MyLoadsPage() {
  const statusColors = {
    'Posted': 'text-blue-400 bg-blue-500/10',
    'In Transit': 'text-yellow-400 bg-yellow-500/10',
    'Delivered': 'text-green-400 bg-green-500/10',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">My Loads</CardTitle>
          <CardDescription>View, manage, and post your loads.</CardDescription>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Post New Load
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cargo</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Bids</TableHead>
              <TableHead>Payout</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myLoads.map((load) => (
              <TableRow key={load.id}>
                <TableCell className="font-medium">{load.cargo}</TableCell>
                <TableCell>
                    <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1.5" />
                        <span>{load.origin}</span>
                        <ArrowRight className="w-3 h-3 mx-1.5" />
                        <span>{load.destination}</span>
                    </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn('border-0', statusColors[load.status])}
                  >
                    {load.status}
                  </Badge>
                </TableCell>
                <TableCell>
                    <Badge variant="secondary">{load.bids} bids</Badge>
                </TableCell>
                <TableCell className="font-semibold">${load.payout.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>View Bids</DropdownMenuItem>
                      <DropdownMenuItem>Edit Load</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Cancel Load
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
