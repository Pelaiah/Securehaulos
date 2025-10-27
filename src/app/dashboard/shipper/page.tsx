'use client';
import { useState, useMemo } from 'react';
import { Map } from '@/components/dashboard/Map';
import { InformationCard } from '@/components/dashboard/InformationCard';
import { ShipmentList } from '@/components/dashboard/ShipmentList';
import { VehicleInfoCard } from '@/components/dashboard/VehicleInfoCard';
import { Card, CardContent } from '@/components/ui/card';
import { tripData, trucks } from '@/lib/data';
import { Header } from '@/components/dashboard/Header';
import { Fuel, Timer, Weight } from 'lucide-react';

type Trip = (typeof tripData)[0];

export default function ShipperDashboardPage() {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(tripData[2]);

  const selectedTruck = useMemo(() => {
    if (!selectedTrip) return null;
    return trucks.find(truck => truck.id === selectedTrip.truckId) || null;
  }, [selectedTrip]);

  const handleTripSelect = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  return (
    <div className="flex flex-col h-full">
      <Header title={selectedTrip?.name || "Dashboard"} onLogout={() => {}} />
      <div className="flex-grow grid grid-cols-1 xl:grid-cols-4 gap-6 p-6">
        {/* Left Column */}
        <div className="xl:col-span-1 space-y-6 flex flex-col">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VehicleInfoCard truck={selectedTruck} />
              <InformationCard driver={selectedTrip} />
            </div>
        </div>

        {/* Middle Column */}
        <div className="xl:col-span-2 space-y-6 flex flex-col">
            <div className="h-full rounded-lg overflow-hidden flex flex-col gap-6">
                 <div className="h-[280px]">
                    <Map trucks={trucks} selectedTruckId={selectedTruck?.id} />
                 </div>
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
        <div className="xl:col-span-1 space-y-6 flex flex-col">
            <TripInfoCard />
            <div className="flex-grow">
                <ShipmentList 
                  title="Trips"
                  onTripSelect={handleTripSelect}
                  selectedTripId={selectedTrip?.id}
                />
            </div>
        </div>
      </div>
    </div>
  );
}
