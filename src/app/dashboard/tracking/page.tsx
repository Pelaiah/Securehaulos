'use client';

import { useState } from 'react';
import { Map } from '@/components/dashboard/Map';
import { TruckCard } from '@/components/dashboard/TruckCard';
import { EmergencyAlert } from '@/components/dashboard/EmergencyAlert';
import { trucks, type Truck } from '@/lib/data';
import { TruckDetailsDialog } from '@/components/dashboard/TruckDetailsDialog';

export default function TrackingPage() {
  const alertTruck = trucks.find((t) => t.unauthorizedDoorOpening);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleTruckClick = (truck: Truck) => {
    setSelectedTruck(truck);
    setIsDetailsOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        {alertTruck && (
          <EmergencyAlert
            truckId={alertTruck.id}
            truckLocation={`${alertTruck.location.lat},${alertTruck.location.lng}`}
          />
        )}

        <Map trucks={trucks} />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold font-headline">Active Fleet</h2>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {trucks.map((truck) => (
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
