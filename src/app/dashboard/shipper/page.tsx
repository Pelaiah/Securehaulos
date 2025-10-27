'use client';
import { useState, useMemo } from 'react';
import { Map } from '@/components/dashboard/Map';
import { InformationCard } from '@/components/dashboard/InformationCard';
import { ShipmentList } from '@/components/dashboard/ShipmentList';
import { VehicleInfoCard } from '@/components/dashboard/VehicleInfoCard';
import { TripInfoCard } from '@/components/dashboard/TripInfoCard';
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
          <InformationCard driver={selectedTrip} />
          <VehicleInfoCard truck={selectedTruck} />
           <Card className='flex-grow'>
              <CardContent className="p-4 grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Timer className="w-5 h-5" />
                        <p>Trip Time</p>
                    </div>
                     <div className="flex items-center gap-2 text-muted-foreground">
                        <Fuel className="w-5 h-5" />
                        <p>Fuel consumption</p>
                    </div>
                     <div className="flex items-center gap-2 text-muted-foreground">
                        <Weight className="w-5 h-5" />
                        <p>Load Weight</p>
                    </div>
                </div>
                 <div className="space-y-4 text-right">
                    <p className="font-semibold">1h 10m</p>
                    <p className="font-semibold">12 liters</p>
                    <p className="font-semibold">15,500 kg</p>
                </div>
              </CardContent>
          </Card>
        </div>

        {/* Middle Column */}
        <div className="xl:col-span-2 space-y-6 flex flex-col">
            <div className="h-[280px] rounded-lg overflow-hidden">
                 <Map trucks={trucks} selectedTruckId={selectedTruck?.id} />
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
