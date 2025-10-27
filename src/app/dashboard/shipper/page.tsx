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
import { TripInfoCard } from '@/components/dashboard/TripInfoCard';

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
        
        <div className="xl:col-span-3 space-y-6">
            {/* Top row with Vehicle and Driver Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VehicleInfoCard truck={selectedTruck} />
                <InformationCard driver={selectedTrip} />
            </div>

            {/* Bottom row with Map and Trip Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-[400px] flex flex-col gap-6">
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
                 <div className="lg:col-span-1">
                    <TripInfoCard />
                </div>
            </div>
        </div>

        {/* Right Column for Shipment List */}
        <div className="xl:col-span-1 flex flex-col">
            <ShipmentList 
              title="Trips"
              onTripSelect={handleTripSelect}
              selectedTripId={selectedTrip?.id}
            />
        </div>
      </div>
    </div>
  );
}
