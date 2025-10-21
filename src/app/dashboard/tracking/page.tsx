'use client';

import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { Map } from '@/components/dashboard/Map';
import { trucks, type Truck } from '@/lib/data';
import { TruckDetailsDialog } from '@/components/dashboard/TruckDetailsDialog';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { TripInfoCard } from '@/components/dashboard/TripInfoCard';
import { ShipmentList } from '@/components/dashboard/ShipmentList';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Droplet, Weight } from 'lucide-react';
import { VehicleInfoCard } from '@/components/dashboard/VehicleInfoCard';
import { InformationCard } from '@/components/dashboard/InformationCard';

interface TrackingPageProps {
    selectedTruck: Truck | null;
    setSelectedTruck: Dispatch<SetStateAction<Truck | null>>;
    isDetailsOpen: boolean;
    setIsDetailsOpen: Dispatch<SetStateAction<boolean>>;
    displayTrucks: Truck[];
    selectedDriver: any;
    setSelectedDriver?: Dispatch<SetStateAction<any>>;
}

export default function TrackingPage({ 
    selectedTruck,
    setSelectedTruck,
    isDetailsOpen,
    setIsDetailsOpen,
    displayTrucks,
    selectedDriver,
    setSelectedDriver,
}: TrackingPageProps) {
  const { isUserLoading } = useUser();
  const { isLoading: isUserDataLoading } = useDoc(null); // Simplified for layout changes

  const handleTruckClick = (truck: Truck) => {
    setSelectedTruck(truck);
  };

  const handleOpenDetails = (truck: Truck) => {
    setSelectedTruck(truck);
    setIsDetailsOpen(true);
  }
  
  const isLoading = isUserLoading || isUserDataLoading;
  
  const StatCard = ({ icon: Icon, title, value }: { icon: React.ElementType, title: string, value: string | number }) => (
    <Card className="bg-card">
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
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Skeleton className="h-80" />
                <Skeleton className="h-80" />
            </div>
            <div className="grid grid-cols-3 gap-6">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
            </div>
            <Skeleton className="h-96" />
        </div>
        <div className="hidden md:block">
            <Skeleton className="h-full" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left & Middle Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <VehicleInfoCard />
            <InformationCard driver={selectedDriver} />
          </div>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard icon={Clock} title="Trip Time" value="1h 10m" />
              <StatCard icon={Droplet} title="Fuel consumption" value="12 liters" />
              <StatCard icon={Weight} title="Load Weight" value="18,000 kg" />
            </div>
             <Card>
                <CardContent className="p-0 grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
                    <div className="p-4 border-r">
                       <Map trucks={displayTrucks} selectedTruckId={selectedTruck?.id} />
                    </div>
                    <div className="p-4">
                       <TripInfoCard />
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Right Column */}
        <div className="h-full hidden md:block">
          {setSelectedDriver && (
            <ShipmentList 
              onDriverSelect={setSelectedDriver}
              title="Trips"
            />
          )}
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
