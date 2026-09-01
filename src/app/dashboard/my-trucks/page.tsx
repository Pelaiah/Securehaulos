'use client';

import { useEffect, useState, useMemo } from 'react';
import { trucks as mockTrucks, type Truck } from '@/lib/data';
import { TruckCard } from '@/components/dashboard/TruckCard';
import { TruckDetailsDialog } from '@/components/dashboard/TruckDetailsDialog';
import { EditTruckDialog } from '@/components/dashboard/EditTruckDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function MyTrucksPage() {
  const { user, carrierProfile, isLoading: isAuthLoading } = useSupabaseAuth();
  const [dbTrucks, setDbTrucks] = useState<Truck[]>([]);
  const [isLoadingTrucks, setIsLoadingTrucks] = useState(true);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    async function fetchCarrierTrucks() {
      if (!user) {
        setIsLoadingTrucks(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('trucks')
          .select('*')
          .eq('carrier_id', user.id);

        if (error) {
          console.warn('Error fetching trucks from Supabase, using mock fallback:', error.message);
          setDbTrucks([]);
        } else if (data && data.length > 0) {
          const mappedTrucks: Truck[] = data.map((t: any) => ({
            id: t.id,
            name: t.name,
            imageUrl: t.image_url || 'https://i.imgur.com/gJt3wGk.png',
            licensePlate: t.license_plate || '',
            truckType: t.truck_type,
            tonnage: t.tonnage,
            color: t.color,
            location: t.location || { lat: 34.0522, lng: -118.2437 },
            status: t.status || 'Incomplete',
            fuelLevel: t.fuel_level ?? 100,
            idleTime: t.idle_time || '0h 0m',
            loadWeight: t.load_weight || 0,
            cargoIntegrity: t.cargo_integrity ?? true,
            unauthorizedDoorOpening: t.unauthorized_door_opening ?? false,
            sensors: { door: true, temperature: true, gps: true },
          }));
          setDbTrucks(mappedTrucks);
        } else {
          setDbTrucks([]);
        }
      } catch (err) {
        console.error('Truck fetch error:', err);
      } finally {
        setIsLoadingTrucks(false);
      }
    }

    fetchCarrierTrucks();
  }, [user]);

  const displayedTrucks = useMemo(() => {
    if (dbTrucks.length > 0) {
      // Sort incomplete trucks to the top
      return [...dbTrucks].sort((a, b) => {
        if (a.status === 'Incomplete' || a.status === 'Pending') return -1;
        if (b.status === 'Incomplete' || b.status === 'Pending') return 1;
        return 0;
      });
    }

    // Fallback: If carrier declared a fleet size in profile, generate demo incomplete trucks
    if (carrierProfile?.fleet_size) {
      const generated: Truck[] = Array.from({ length: carrierProfile.fleet_size }).map((_, i) => ({
        id: `DEMO-TRK-${i + 1}`,
        name: `Truck #${i + 1} (Setup Required)`,
        imageUrl: 'https://i.imgur.com/gJt3wGk.png',
        licensePlate: '',
        status: 'Incomplete',
        fuelLevel: 100,
        idleTime: '0h 0m',
        loadWeight: 0,
        cargoIntegrity: true,
        unauthorizedDoorOpening: false,
        location: { lat: 34.0522, lng: -118.2437 },
        sensors: { door: true, temperature: true, gps: true },
      }));
      return generated;
    }

    return mockTrucks;
  }, [dbTrucks, carrierProfile]);

  const handleTruckClick = (truck: Truck) => {
    setSelectedTruck(truck);
    if (truck.status === 'Incomplete' || truck.status === 'Pending' || !truck.licensePlate) {
      setIsEditOpen(true);
    } else {
      setIsDetailsOpen(true);
    }
  };

  const handleTruckUpdated = (updated: Truck) => {
    setDbTrucks((prev) => {
      const exists = prev.some((t) => t.id === updated.id);
      if (exists) {
        return prev.map((t) => (t.id === updated.id ? updated : t));
      }
      return [...prev, updated];
    });
  };

  if (isAuthLoading || isLoadingTrucks) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          <Skeleton className="h-8 w-48" />
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Fleet ({displayedTrucks.length} Trucks)</h1>
            <p className="text-sm text-muted-foreground">
              Manage your fleet vehicles, complete truck setup, and view status.
            </p>
          </div>
          <Button
            onClick={() => {
              const newTruck: Truck = {
                id: `TRK-NEW-${Date.now()}`,
                name: `New Truck #${displayedTrucks.length + 1}`,
                imageUrl: 'https://i.imgur.com/gJt3wGk.png',
                licensePlate: '',
                status: 'Incomplete',
                fuelLevel: 100,
                idleTime: '0h 0m',
                loadWeight: 0,
                cargoIntegrity: true,
                unauthorizedDoorOpening: false,
                location: { lat: 34.0522, lng: -118.2437 },
                sensors: { door: true, temperature: true, gps: true },
              };
              setSelectedTruck(newTruck);
              setIsEditOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Truck
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedTrucks.map((truck) => (
            <TruckCard
              key={truck.id}
              truck={truck}
              onClick={() => handleTruckClick(truck)}
            />
          ))}
        </div>
      </div>

      <TruckDetailsDialog
        truck={selectedTruck}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEditClick={() => {
          setIsDetailsOpen(false);
          setIsEditOpen(true);
        }}
      />

      <EditTruckDialog
        truck={selectedTruck}
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        onTruckUpdated={handleTruckUpdated}
      />
    </>
  );
}
