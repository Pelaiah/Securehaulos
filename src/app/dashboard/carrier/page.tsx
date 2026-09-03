'use client';

import { useState, useEffect, useCallback } from 'react';
import { trucks as fallbackTrucks, type Truck } from '@/lib/data';
import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { MobileRecentShipping } from '@/components/dashboard/MobileRecentShipping';
import { CarrierOptimizationDashboard } from '@/components/dashboard/carrier/CarrierOptimizationDashboard';
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
      <div className="p-6 space-y-6 bg-[#F7F8F6] min-h-screen">
        <Skeleton className="h-16 w-full bg-[#E1E6E2]/60" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full bg-[#E1E6E2]/60" />
          <Skeleton className="h-32 w-full bg-[#E1E6E2]/60" />
          <Skeleton className="h-32 w-full bg-[#E1E6E2]/60" />
        </div>
        <Skeleton className="h-96 w-full bg-[#E1E6E2]/60" />
      </div>
    );
  }

  return (
    <>
      {/* Mobile View: High-fidelity mobile layout */}
      <div className="block md:hidden">
        <MobileRecentShipping
          userType="Carrier"
          onTripSelect={(tripId) => router.push(`/dashboard/my-trucks`)}
        />
      </div>

      {/* Desktop / Tablet View: Bespoke XPO Logistics Fleet OS */}
      <div className="hidden md:block w-full h-screen">
        <CarrierOptimizationDashboard initialTrucks={trucks} />
      </div>
    </>
  );
}
