
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
import { loads, type Load } from '@/lib/data';
import { MoreHorizontal, PlusCircle, X, MapPin, ArrowRight, Truck, DollarSign, Info } from 'lucide-react';
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
  DialogClose,
} from '@/components/ui/dialog';
import { AddLoadForm } from './AddLoadForm';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);

  const handleStatusClick = (load: Load) => {
    setSelectedLoad(load);
    setDetailsOpen(true);
  }

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
                      <Button variant="ghost" className="p-0 h-auto" onClick={() => handleStatusClick(load)}>
                        <Badge variant="outline" className={cn(statusColors[status], "cursor-pointer")}>
                          {status}
                        </Badge>
                      </Button>
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
      
      {/* Add Load Dialog */}
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
      
      {/* Load Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedLoad && (
            <>
              <DialogHeader>
                <DialogTitle className="font-headline flex items-center justify-between">
                  <span>Load Details</span>
                   <Badge variant="outline" className={cn(statusColors[getStatus(selectedLoad.id)])}>
                      {getStatus(selectedLoad.id)}
                    </Badge>
                </DialogTitle>
                <DialogDescription>
                  ID: {selectedLoad.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 text-lg">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span>{selectedLoad.origin}</span>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    <span>{selectedLoad.destination}</span>
                  </div>
                <Separator />
                <div className='space-y-3'>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cargo:</span>
                    <span className="font-semibold">{selectedLoad.cargo}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Equipment:</span>
                    <span className="font-semibold">{selectedLoad.equipment}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Payout:</span>
                    <span className="font-bold text-lg text-green-500">${selectedLoad.payout.toLocaleString()}</span>
                  </div>
                   <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Shipper:</span>
                    <span className="font-semibold">{selectedLoad.shipper}</span>
                  </div>
                </div>
                 {getStatus(selectedLoad.id) === 'Posted' && (
                    <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                      <Info className="h-4 w-4 !text-blue-400" />
                      <AlertTitle>Awaiting Bids</AlertTitle>
                      <AlertDescription>
                        This load is live on the board. You will be notified when carriers start placing bids.
                      </AlertDescription>
                    </Alert>
                  )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
