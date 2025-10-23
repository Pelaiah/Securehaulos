'use client';
import { useMemo, useState } from 'react';
import { trucks as allTrucks, type Truck } from '@/lib/data';
import { TruckCard } from '@/components/dashboard/TruckCard';
import { TruckDetailsDialog } from '@/components/dashboard/TruckDetailsDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function MyTrucksPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const carrierDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'carriers', user.uid);
  }, [user, firestore]);

  const { data: carrierData, isLoading: isCarrierLoading } = useDoc(carrierDocRef);

  const trucksToDisplay = useMemo(() => {
    // For demo purposes, we'll just use the mock data
    return allTrucks;
  }, []);


  const handleTruckClick = (truck: Truck) => {
    setSelectedTruck(truck);
    setIsDetailsOpen(true);
  }

  if (isUserLoading || isCarrierLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4"><Skeleton className="h-8 w-48" /></h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Trucks ({trucksToDisplay.length})</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trucksToDisplay.map((truck) => (
            <TruckCard 
                key={truck.id} 
                truck={truck} 
                onClick={() => handleTruckClick(truck)}
                />
            ))}
        </div>
      </div>
      <TruckDetailsDialog 
        truck={selectedTruck} 
        isOpen={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen} 
      />
    </>
  );
}
