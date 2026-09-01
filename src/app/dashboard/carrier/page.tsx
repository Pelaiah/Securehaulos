'use client';

import { useState, useEffect, useCallback } from 'react';
import { trucks as fallbackTrucks, type Truck } from '@/lib/data';
import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { TrackingList } from '@/components/dashboard/TrackingList';
import { TrackingDetails } from '@/components/dashboard/TrackingDetails';
import { MobileRecentShipping } from '@/components/dashboard/MobileRecentShipping';
import { useRouter } from 'next/navigation';

export default function CarrierDashboardPage() {
  const router = useRouter();
  const { user, userProfile, isLoading: authLoading } = useSupabaseAuth();
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Helper to map Supabase database record to UI Truck model
  const mapTruckRecord = (record: any): Truck => ({
    id: record.id,
    name: record.name || `Truck ${record.id.slice(0, 6)}`,
    imageUrl: record.image_url || record.imageUrl || 'https://i.imgur.com/tVrGgid.png',
    licensePlate: record.license_plate || record.licensePlate || 'N/A',
    truckType: record.truck_type || record.equipmentType || 'Flatbed',
    location: record.location || { lat: 34.0522, lng: -118.2437 },
    status: record.status || 'Idle',
    fuelLevel: record.fuel_level ?? record.fuelLevel ?? 75,
    idleTime: record.idle_time || record.idleTime || '0h 0m',
    loadWeight: record.load_weight ?? record.loadWeight ?? 0,
    cargoIntegrity: record.cargo_integrity ?? record.cargoIntegrity ?? true,
    unauthorizedDoorOpening: record.unauthorized_door_opening ?? record.unauthorizedDoorOpening ?? false,
    sensors: record.sensors || { door: true, temperature: true, gps: true },
  });

  const fetchTrucks = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('trucks')
        .select('*')
        .eq('carrier_id', user.id);

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapTruckRecord);
        setTrucks(mapped);
        setSelectedTruck((prev) => (prev ? mapped.find((t) => t.id === prev.id) || mapped[0] : mapped[0]));
      } else {
        // If carrier has no trucks in database yet, fallback gracefully
        setTrucks(fallbackTrucks);
        setSelectedTruck((prev) => prev || fallbackTrucks[0]);
      }
    } catch (err) {
      console.error('Error fetching carrier trucks:', err);
      setTrucks(fallbackTrucks);
      setSelectedTruck((prev) => prev || fallbackTrucks[0]);
    } finally {
      setIsDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }

    fetchTrucks();

    // Supabase Realtime channel for truck status and telematics changes
    const channel = supabase
      .channel(`carrier-trucks-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trucks',
          filter: `carrier_id=eq.${user.id}`,
        },
        () => {
          fetchTrucks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, authLoading, router, fetchTrucks]);

  const isLoading = authLoading || isDataLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] xl:grid-cols-[1fr_2fr] h-screen">
        <div className="p-4 border-r">
          <Skeleton className="h-12 w-full mb-4" />
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
        <div className="p-4">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View: 100% influence from design Screen 2 */}
      <div className="block md:hidden">
        <MobileRecentShipping
          userType="Carrier"
          onTripSelect={(tripId) => router.push(`/dashboard/shipper/tracking/${tripId}`)}
        />
      </div>

      {/* Desktop / Tablet View */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-[2fr_3fr] xl:grid-cols-[1fr_2fr] h-screen">
        <div className="p-4 border-r overflow-y-auto">
          <TrackingList
            trucks={trucks}
            selectedTruckId={selectedTruck?.id}
            onTruckSelect={setSelectedTruck}
          />
        </div>
        <div className="p-4 overflow-y-auto">
          {selectedTruck && <TrackingDetails truck={selectedTruck} />}
        </div>
      </div>
    </>
  );
}
