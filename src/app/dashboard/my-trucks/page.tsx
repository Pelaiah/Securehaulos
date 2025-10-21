'use client';
import { Dispatch, SetStateAction } from 'react';
import { trucks, type Truck } from '@/lib/data';
import { TruckCard } from '@/components/dashboard/TruckCard';
import { TruckDetailsDialog } from '@/components/dashboard/TruckDetailsDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/firebase';

interface MyTrucksPageProps {
    selectedTruck: Truck | null;
    setSelectedTruck: Dispatch<SetStateAction<Truck | null>>;
    isDetailsOpen: boolean;
    setIsDetailsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function MyTrucksPage({ 
    selectedTruck,
    setSelectedTruck,
    isDetailsOpen,
    setIsDetailsOpen,
}: MyTrucksPageProps) {
  const { isUserLoading } = useUser();
  
  const handleTruckClick = (truck: Truck) => {
    setSelectedTruck(truck);
    setIsDetailsOpen(true);
  }

  if (isUserLoading) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
        </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trucks.map((truck) => (
          <TruckCard 
            key={truck.id} 
            truck={truck} 
            onClick={() => handleTruckClick(truck)}
            />
        ))}
      </div>
      <TruckDetailsDialog 
        truck={selectedTruck} 
        isOpen={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen} 
      />
    </>
  );
}
