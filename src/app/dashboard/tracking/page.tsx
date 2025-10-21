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
}

export default function TrackingPage({ 
    selectedTruck,
    setSelectedTruck,
    isDetailsOpen,
    setIsDetailsOpen,
    displayTrucks,
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
       <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] xl:grid-cols-[3fr_2fr_2fr] gap-6">
        <div className="space-y-6 xl:col-span-2">
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
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] xl:grid-cols-[3fr_2fr_2fr] gap-6 items-start">
        {/* Left & Middle Column */}
        <div className="space-y-6 xl:col-span-2">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <VehicleInfoCard />
            <InformationCard />
          </div>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard icon={Clock} title="Trip Time" value="1h 10m" />
              <StatCard icon={Droplet} title="Fuel consumption" value="12 liters" />
              <StatCard icon={Weight} title="Load Weight" value="18,000 kg" />
            </div>
             <Card>
                <CardContent className="p-0 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
                    <div className="p-4 border-r">
                       <Map trucks={displayTrucks || []} selectedTruckId={selectedTruck?.id} />
                    </div>
                    <div className="p-4">
                       <TripInfoCard />
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Right Column */}
        <div className="hidden xl:block h-full">
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
