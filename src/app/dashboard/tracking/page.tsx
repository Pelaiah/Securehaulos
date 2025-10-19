'use client';

import { useState } from 'react';
import { Map } from '@/components/dashboard/Map';
import { trucks, type Truck } from '@/lib/data';
import { TruckDetailsDialog } from '@/components/dashboard/TruckDetailsDialog';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { TripInfoCard } from '@/components/dashboard/TripInfoCard';
import { ShipmentList } from '@/components/dashboard/ShipmentList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Droplet, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VehicleInfoCard } from '@/components/dashboard/VehicleInfoCard';
import { PaymentInfoCard } from '@/components/dashboard/PaymentInfoCard';
import { DriverInfoCard } from '@/components/dashboard/DriverInfoCard';
import { EmergencyAlert } from '@/components/dashboard/EmergencyAlert';

export default function TrackingPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
  
  const shipperTrucks = trucks.filter(t => ['TR-001', 'TR-004'].includes(t.id));

  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(shipperTrucks[0]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleTruckClick = (truck: Truck) => {
    setSelectedTruck(truck);
  };

  const handleOpenDetails = (truck: Truck) => {
    setSelectedTruck(truck);
    setIsDetailsOpen(true);
  }
  
  const isLoading = isUserLoading || isUserDataLoading;
  const userType = userData?.userType;

  const displayTrucks = userType === 'Shipper' ? shipperTrucks : trucks;
  
  const StatCard = ({ icon: Icon, title, value, className }: { icon: React.ElementType, title: string, value: string | number, className?: string }) => (
    <Card className={cn("bg-card-alt", className)}>
      <CardContent className="p-4 flex items-center gap-4">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <div>
          <p className="font-bold text-sm">{value}</p>
          <p className="text-muted-foreground text-xs">{title}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
       <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] xl:grid-cols-[1fr_1fr_1fr] gap-6">
        <div className="space-y-6">
            <Skeleton className="h-56" />
            <div className="grid grid-cols-3 gap-6">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
            </div>
            <Skeleton className="h-96" />
        </div>
        <div className="space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-40" />
            <Skeleton className="h-64" />
        </div>
        <div className="hidden xl:block">
            <Skeleton className="h-full" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] xl:grid-cols-[1fr_1fr_0.8fr] gap-6 items-start">
        {/* Left Column */}
        <div className="space-y-6">
          {selectedTruck?.unauthorizedDoorOpening && (
            <EmergencyAlert
              truckId={selectedTruck.id}
              truckLocation={`${selectedTruck.location.lat},${selectedTruck.location.lng}`}
            />
          )}
          <VehicleInfoCard />
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard icon={Clock} title="Trip Time" value="1h 10m" />
              <StatCard icon={Droplet} title="Fuel consumption" value="12 liters" />
              <StatCard icon={Users} title="Passenger number" value="4 persons" />
            </div>
          <Map trucks={displayTrucks} selectedTruckId={selectedTruck?.id} />
        </div>

        {/* Middle Column */}
        <div className="space-y-6">
          <PaymentInfoCard />
          <DriverInfoCard />
          <TripInfoCard />
        </div>

        {/* Right Column */}
        <div className="hidden xl:block">
          <ShipmentList 
            trucks={trucks} 
            selectedTruckId={selectedTruck?.id}
            onTruckSelect={handleTruckClick}
            onTruckDetails={handleOpenDetails}
            title="Trips"
          />
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
