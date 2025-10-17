
'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { loads } from '@/lib/data';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AddLoadForm } from './AddLoadForm';
import { cn } from '@/lib/utils';

// Mock status, in a real app this would be part of the load data
const getStatus = (id: string) => {
    const statuses = ['In Transit', 'Posted', 'Delivered'];
    const index = parseInt(id.slice(-1), 16) % statuses.length;
    return statuses[index] as 'In Transit' | 'Posted' | 'Delivered';
}

const statusColors = {
  'In Transit': 'text-blue-500 bg-blue-500/10',
  Posted: 'text-yellow-500 bg-yellow-500/10',
  Delivered: 'text-green-500 bg-green-500/10',
};


export function ShipperLoads() {
  const [isAddLoadOpen, setAddLoadOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline">My Posted Loads</CardTitle>
                <CardDescription>
                    Manage your active and past shipments.
                </CardDescription>
            </div>
            <Button onClick={() => setAddLoadOpen(true)}>
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
                <TableHead>Payout</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loads.map((load) => {
                const status = getStatus(load.id);
                return (
                  <TableRow key={load.id}>
                    <TableCell className="font-medium">{load.cargo}</TableCell>
                    <TableCell>
                        {load.origin} to {load.destination}
                    </TableCell>
                     <TableCell className='text-green-500 font-semibold'>${load.payout.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(statusColors[status])}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Bids</DropdownMenuItem>
                          <DropdownMenuItem>Track Shipment</DropdownMenuItem>
                           <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Cancel Load
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isAddLoadOpen} onOpenChange={setAddLoadOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center gap-2">
              <PlusCircle />
              Post a New Load
            </DialogTitle>
            <DialogDescription>
              Fill out the details below to add your shipment to the load board.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <AddLoadForm onFormSubmit={() => setAddLoadOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
