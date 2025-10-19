'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Map } from '@/components/dashboard/Map';
import { EmergencyAlert } from '@/components/dashboard/EmergencyAlert';
import { trucks, type Truck } from '@/lib/data';
import { TruckDetailsDialog } from '@/components/dashboard/TruckDetailsDialog';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { TripInfoCard } from '@/components/dashboard/TripInfoCard';
import { ShipmentList } from '@/components/dashboard/ShipmentList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Fuel, Weight } from 'lucide-react';
import { cn } from '@/lib/utils';


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
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(trucks[0]);
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
  const showAlert = userType === 'Shipper' ? alertTruck && shipperTrucks.some(t => t.id === alertTruck.id) : alertTruck;
  
  const StatCard = ({ icon: Icon, title, value, className }: { icon: React.ElementType, title: string, value: string | number, className?: string }) => (
    <Card className={cn("bg-card/50 backdrop-blur-sm", className)}>
      <CardContent className="p-4 flex items-center gap-4">
        <Icon className="w-6 h-6 text-muted-foreground" />
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="font-bold text-lg">{value}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-96" />
          <div className="grid grid-cols-3 gap-6">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-64" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-full" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
           {showAlert && alertTruck && (
            <>
              <EmergencyAlert
                truckId={alertTruck.id}
                truckLocation={`${alertTruck.location.lat},${alertTruck.location.lng}`}
              />
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image 
                    src="https://picsum.photos/seed/truck-alert/800/450" 
                    alt="Truck from alert" 
                    layout="fill" 
                    objectFit="cover"
                    data-ai-hint="truck side"
                />
              </div>
            </>
            )}
          
          {selectedTruck && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard icon={Clock} title="Idle Time" value={selectedTruck.idleTime} />
              <StatCard icon={Fuel} title="Fuel" value={`${selectedTruck.fuelLevel}%`} />
              <StatCard icon={Weight} title="Load Weight" value={`${selectedTruck.loadWeight.toLocaleString()} kg`} />
            </div>
          )}

          <Map trucks={displayTrucks} selectedTruckId={selectedTruck?.id} />

          <TripInfoCard />
        </div>

        <div className="lg:col-span-1">
          <ShipmentList 
            trucks={displayTrucks} 
            selectedTruckId={selectedTruck?.id}
            onTruckSelect={handleTruckClick}
            onTruckDetails={handleOpenDetails}
            title={userType === 'Shipper' ? 'My Active Shipments' : 'Active Fleet'}
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
