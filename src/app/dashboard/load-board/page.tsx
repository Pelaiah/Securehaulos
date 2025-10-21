'use client';

import { useState } from 'react';
import { LoadCard } from '@/components/dashboard/LoadCard';
import { loads, type Load } from '@/lib/data';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShipperLoads } from '@/components/dashboard/ShipperLoads';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadDetailsDialog } from '@/components/dashboard/LoadDetailsDialog';

interface LoadBoardPageProps {
  userType?: 'Shipper' | 'Carrier';
  isLoading: boolean;
}

export default function LoadBoardPage({ userType, isLoading }: LoadBoardPageProps) {
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleGetLoadClick = (load: Load) => {
    setSelectedLoad(load);
    setIsDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-grow" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (userType === 'Shipper') {
    return <ShipperLoads />;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by location or cargo..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Equipment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dry-van">Dry Van</SelectItem>
                <SelectItem value="reefer">Reefer</SelectItem>
                <SelectItem value="flatbed">Flatbed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {loads.map((load) => (
            <LoadCard key={load.id} load={load} onGetLoadClick={() => handleGetLoadClick(load)} />
          ))}
        </div>
      </div>
       <LoadDetailsDialog 
        load={selectedLoad}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </>
  );
}
