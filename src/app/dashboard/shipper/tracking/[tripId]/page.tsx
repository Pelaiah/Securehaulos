'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Map } from '@/components/dashboard/Map';
import { InformationCard } from '@/components/dashboard/InformationCard';
import { ShipmentList } from '@/components/dashboard/ShipmentList';
import { VehicleInfoCard } from '@/components/dashboard/VehicleInfoCard';
import { TripInfoCard } from '@/components/dashboard/TripInfoCard';
import { Card, CardContent } from '@/components/ui/card';
import { tripData } from '@/lib/data';
import { Header } from '@/components/dashboard/Header';
import { Fuel, Timer, Users, Weight } from 'lucide-react';
import { trucks } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

type Trip = (typeof tripData)[0];

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.tripId as string;
  const [selectedDriver, setSelectedDriver] = useState<Trip | null>(null);

  useEffect(() => {
    if (tripId) {
      const driver = tripData.find(trip => trip.id === tripId);
      setSelectedDriver(driver || null);
    }
  }, [tripId]);

  const handleTripSelect = (trip: Trip) => {
    router.push(`/dashboard/shipper/tracking/${trip.id}`);
  };

  const selectedTruck = trucks.find(truck => truck.id === selectedDriver?.truckId);


  if (!selectedDriver) {
    return (
        <div className="flex flex-col h-full">
            <Header title="Loading Trip..." onLogout={() => {}} />
            <div className="flex-grow grid grid-cols-1 xl:grid-cols-4 gap-6 p-6">
                <div className="xl:col-span-1 space-y-6">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-32" />
                </div>
                <div className="xl:col-span-2 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Skeleton className="h-64" />
                        <Skeleton className="h-64" />
                    </div>
                    <Skeleton className="h-full" />
                </div>
                <div className="xl:col-span-1">
                    <Skeleton className="h-full" />
                </div>
            </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={selectedDriver.name} onLogout={() => {}} />
      <div className="flex-grow grid grid-cols-1 xl:grid-cols-4 gap-6 p-6">
        {/* Left Column */}
        <div className="xl:col-span-1 space-y-6 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
            <VehicleInfoCard truck={selectedTruck} />
            <InformationCard driver={selectedDriver} />
          </div>
        </div>

        {/* Middle Column */}
        <div className="xl:col-span-2 space-y-6 flex flex-col">
            <div className='grid md:grid-cols-2 gap-6'>
                <TripInfoCard />
            </div>
            <div className="h-[280px] rounded-lg overflow-hidden flex flex-col gap-6">
                 <Map trucks={trucks} selectedTruckId={selectedTruck?.id} />
                 <Card>
                  <CardContent className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Timer className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p className='text-muted-foreground'>Trip Time</p>
                            <p className="font-semibold">1h 10m</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Fuel className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p className='text-muted-foreground'>Fuel consumption</p>
                            <p className="font-semibold">12 liters</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Weight className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p className='text-muted-foreground'>Load Weight</p>
                            <p className="font-semibold">15,500 kg</p>
                        </div>
                    </div>
                  </CardContent>
              </Card>
            </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-1">
          <ShipmentList 
            title="Trips" 
            onTripSelect={handleTripSelect}
            selectedTripId={selectedDriver.id}
          />
        </div>
      </div>
    </div>
  );
}
