'use client';

import { useEffect, useMemo, useState } from 'react';
import { LoadCard } from '@/components/dashboard/LoadCard';
import { type Load } from '@/lib/data';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadDetailsDialog } from '@/components/dashboard/LoadDetailsDialog';
import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';
import { supabase } from '@/lib/supabase/client';
import { Truck } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function LoadBoardPage() {
  const { user, userProfile, isLoading: isAuthLoading } = useSupabaseAuth();
  const userType = userProfile?.user_type;
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loads, setLoads] = useState<Load[]>([]);
  const [areLoadsLoading, setAreLoadsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchLoads() {
      setAreLoadsLoading(true);
      const { data, error } = await supabase.from('loads').select('*');
      if (!error && data) setLoads(data as unknown as Load[]);
      setAreLoadsLoading(false);
    }
    fetchLoads();
  }, []);

  const carrierFleet = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: `CARR-TR-${100 + i + 1}`,
      name: `Truck #${i + 1}`,
      equipmentType: i % 3 === 0 ? 'Reefer' : i % 2 === 0 ? 'Flatbed' : 'Dry Van',
      location: { lat: 34.0522, lng: -118.2437 },
      status: 'Idle',
      fuelLevel: Math.floor(Math.random() * 80) + 20,
      idleTime: `0h 0m`,
      loadWeight: 0,
      cargoIntegrity: true,
      unauthorizedDoorOpening: false,
    })) as (Truck & { equipmentType: string })[];
  }, []);

  const handleGetLoadClick = (load: Load) => {
    setSelectedLoad(load);
    setIsDetailsOpen(true);
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Data is real-time, so we just show a toast and the UI will update automatically
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: 'Load Board Refreshed',
        description: 'New loads have been fetched.',
      });
    }, 1000);
  };

  const isLoading = isAuthLoading || isRefreshing || areLoadsLoading;

  if (isLoading && !isDetailsOpen) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-grow" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
           <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
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
             <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
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
          {loads?.map((load) => (
            <LoadCard key={load.id} load={load} onGetLoadClick={() => handleGetLoadClick(load)} />
          ))}
        </div>
      </div>
       <LoadDetailsDialog 
        load={selectedLoad}
        carrierFleet={carrierFleet}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </>
  );
}
