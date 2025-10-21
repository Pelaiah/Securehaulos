'use client';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { type Truck } from '@/lib/data';
import { TruckCard } from '@/components/dashboard/TruckCard';
import { TruckDetailsDialog } from '@/components/dashboard/TruckDetailsDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

interface MyTrucksPageProps {
    // selectedTruck: Truck | null;
    // setSelectedTruck: Dispatch<SetStateAction<Truck | null>>;
    // isDetailsOpen: boolean;
    // setIsDetailsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function MyTrucksPage({ 
    // selectedTruck,
    // setSelectedTruck,
    // isDetailsOpen,
    // setIsDetailsOpen,
}: MyTrucksPageProps) {
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
    if (!carrierData) return [];

    const fleetSize = carrierData.equipment; // e.g., '1', '2-5', '6-10', '11+'
    let numberOfTrucks = 0;

    if (fleetSize === '1') {
      numberOfTrucks = 1;
    } else if (fleetSize === '2-5') {
      numberOfTrucks = 3; // Representative number
    } else if (fleetSize === '6-10') {
      numberOfTrucks = 7;
    } else if (fleetSize === '11+') {
      numberOfTrucks = 15;
    }

    // Generate mock truck data
    return Array.from({ length: numberOfTrucks }, (_, i) => ({
        id: `CARR-TR-${100 + i + 1}`,
        name: `Truck #${i + 1}`,
        location: { lat: 34.0522, lng: -118.2437 },
        status: i % 4 === 0 ? 'Idle' : i % 4 === 1 ? 'On-time' : i % 4 === 2 ? 'Delayed' : 'Alert',
        fuelLevel: Math.floor(Math.random() * 80) + 20,
        idleTime: `${i % 3}h ${Math.floor(Math.random() * 60)}m`,
        loadWeight: Math.floor(Math.random() * 10000) + 10000,
        cargoIntegrity: i % 4 !== 3,
        unauthorizedDoorOpening: i % 4 === 3,
    })) as Truck[];

  }, [carrierData]);


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
