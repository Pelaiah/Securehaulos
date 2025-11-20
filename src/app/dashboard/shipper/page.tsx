'use client';
import { useState, useMemo } from 'react';
import { InformationCard } from '@/components/dashboard/InformationCard';
import { ShipmentList } from '@/components/dashboard/ShipmentList';
import { VehicleInfoCard } from '@/components/dashboard/VehicleInfoCard';
import { tripData, trucks } from '@/lib/data';
import { Header } from '@/components/dashboard/Header';
import {
  BarChart,
  DollarSign,
  Map,
  Package,
  Ruler,
  Users,
  Weight,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OrderInfoCard } from '@/components/dashboard/OrderInfoCard';
import { Map as MapComponent } from '@/components/dashboard/Map';

type Trip = (typeof tripData)[0];

export default function ShipperDashboardPage() {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(tripData[2]);

  const selectedTruck = useMemo(() => {
    if (!selectedTrip) return null;
    return trucks.find((truck) => truck.id === selectedTrip.truckId) || null;
  }, [selectedTrip]);

  const handleTripSelect = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  return (
    <div className="flex flex-col h-full bg-muted/30">
      <Header title="Dashboard" onLogout={() => {}} />
      <div className="flex-grow grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Month Order
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">132</div>
                <p className="text-xs text-muted-foreground">
                  +20% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Weight
                </CardTitle>
                <Weight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">19,500 lbs</div>
                <p className="text-xs text-muted-foreground">
                  -2% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Distance
                </CardTitle>
                <Ruler className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">872 mi</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <InformationCard driver={selectedTrip} />
              <VehicleInfoCard truck={selectedTruck} />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <OrderInfoCard trip={selectedTrip} />
              <Card className="h-[300px]">
                <CardHeader>
                  <CardTitle>Map Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <MapComponent trucks={trucks} selectedTruckId={selectedTruck?.id} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 flex flex-col">
          <ShipmentList
            title="Orders"
            onTripSelect={handleTripSelect}
            selectedTripId={selectedTrip?.id}
          />
        </div>
      </div>
    </div>
  );
}
