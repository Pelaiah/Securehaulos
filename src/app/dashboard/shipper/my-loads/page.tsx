'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { shipperLoads as allLoads } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Check,
  MoreHorizontal,
  FileDown,
  Plus,
  Pencil,
  X,
} from 'lucide-react';

const statusStyles = {
  Paid: 'bg-green-500/10 text-green-400 border-green-500/20',
  'Awaiting Payment': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'In Transit': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const loadsByStatus = allLoads.reduce((acc, load) => {
  const status = load.status;
  if (!acc[status]) {
    acc[status] = [];
  }
  acc[status].push(load);
  return acc;
}, {} as Record<string, typeof allLoads>);

export default function MyLoadsPage() {
  const getStatusComponent = (status: string, date?: string) => {
    if (status === 'Paid') {
      return (
        <Button
          variant="outline"
          className={cn(
            'border-2 font-semibold',
            statusStyles['Paid']
          )}
        >
          <Check className="mr-2 h-4 w-4" />
          Paid: {date}
        </Button>
      );
    }
    return (
      <Button className="bg-primary/80 hover:bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        Fix payment
      </Button>
    );
  };

  return (
    <div className="p-6 space-y-8 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">My Loads</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Post New Load
        </Button>
      </div>

      {Object.entries(loadsByStatus).map(([status, loads]) => (
        <div key={status}>
          <h2 className="text-xl font-semibold mb-4 font-headline capitalize">
            {status.toLowerCase()} Loads
          </h2>
          <Card>
            <CardContent className="p-4 space-y-2">
              {loads.map((load) => (
                <div
                  key={load.id}
                  className="flex items-center p-3 rounded-lg hover:bg-muted/50"
                >
                  <Button variant="ghost" className="text-muted-foreground">
                    <FileDown className="mr-2" /> PDF
                  </Button>
                  <div className="ml-4 flex-1 grid grid-cols-6 items-center gap-4">
                    <div>
                      <p className="font-semibold">{load.date}</p>
                      <p className="text-xs text-muted-foreground">
                        {load.id}
                      </p>
                    </div>
                    <p className="font-semibold">{load.cargo}</p>
                    <div>
                      <p className="font-semibold">
                        ${load.invoiceValue.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Invoice value
                      </p>
                    </div>
                    <div className="relative ml-2.5">
                      <p className="font-semibold">
                        ${load.afterTax.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">After tax</p>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2 mt-10">
                      {getStatusComponent(load.status, load.paidDate)}
                      <Button variant="ghost" size="icon" className='text-muted-foreground'>
                        <Pencil className="w-4 h-4" />
                      </Button>
                       <Button variant="ghost" size="icon" className='text-muted-foreground'>
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
