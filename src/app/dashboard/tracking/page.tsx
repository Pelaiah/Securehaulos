'use client';

import { useState } from 'react';
import { Map } from '@/components/dashboard/Map';
import { TruckCard } from '@/components/dashboard/TruckCard';
import { EmergencyAlert } from '@/components/dashboard/EmergencyAlert';
import { trucks, type Truck } from '@/lib/data';
import { TruckDetailsDialog } from '@/components/dashboard/TruckDetailsDialog';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function TrackingPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
  
  // For shippers, we only show trucks carrying their loads. We'll simulate this.
  const shipperTrucks = trucks.filter(t => ['TR-001', 'TR-004'].includes(t.id));

  const alertTruck = trucks.find((t) => t.unauthorizedDoorOpening);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleTruckClick = (truck: Truck) => {
    setSelectedTruck(truck);
    setIsDetailsOpen(true);
  };
  
  const isLoading = isUserLoading || isUserDataLoading;
  const userType = userData?.userType;

  const displayTrucks = userType === 'Shipper' ? shipperTrucks : trucks;
  const showAlert = userType === 'Shipper' ? alertTruck && shipperTrucks.some(t => t.id === alertTruck.id) : alertTruck;

  if (isLoading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                    <Skeleton className="h-40" />
                    <Skeleton className="h-40" />
                </div>
            </div>
        </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {showAlert && alertTruck && (
          <EmergencyAlert
            truckId={alertTruck.id}
            truckLocation={`${alertTruck.location.lat},${alertTruck.location.lng}`}
          />
        )}

        <Map trucks={displayTrucks} />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold font-headline">
            {userType === 'Shipper' ? 'My Active Shipments' : 'Active Fleet'}
          </h2>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {displayTrucks.map((truck) => (
              <TruckCard key={truck.id} truck={truck} onClick={() => handleTruckClick(truck)} />
            ))}
          </div>
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
