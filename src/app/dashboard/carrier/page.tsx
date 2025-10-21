'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { trucks as allTrucks, type Truck } from '@/lib/data';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { TrackingList } from '@/components/dashboard/TrackingList';
import { TrackingDetails } from '@/components/dashboard/TrackingDetails';


interface TrackingPageProps {
    displayTrucks: Truck[];
    selectedDriver: any;
}

export default function CarrierDashboardPage({ 
    displayTrucks,
    selectedDriver,
}: TrackingPageProps) {
  const { isUserLoading } = useUser();
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(allTrucks.find(t => t.id === 'SD-752069247') || allTrucks[0]);

  const isLoading = isUserLoading;

  if (isLoading) {
    return (
       <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] xl:grid-cols-[1fr_2fr] h-screen">
        <div className="p-4 border-r">
          <Skeleton className="h-12 w-full mb-4" />
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        </div>
        <div className="p-4">
            <Skeleton className="h-full w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] xl:grid-cols-[1fr_2fr] h-screen">
        <div className="p-4 border-r overflow-y-auto">
            <TrackingList 
                trucks={allTrucks}
                selectedTruckId={selectedTruck?.id}
                onTruckSelect={setSelectedTruck}
            />
        </div>
        <div className="p-4 overflow-y-auto">
            {selectedTruck && <TrackingDetails truck={selectedTruck} />}
        </div>
    </div>
  );
}
