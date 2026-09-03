'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { tripData, trucks as fallbackTrucks, type Truck } from '@/lib/data';
import { MobileRecentShipping } from '@/components/dashboard/MobileRecentShipping';
import { ShipperTactileDashboard } from '@/components/dashboard/shipper/ShipperTactileDashboard';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

type Trip = (typeof tripData)[0];

export default function ShipperDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useSupabaseAuth();
  const [loads, setLoads] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const fetchLoads = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('loads')
        .select('*')
        .eq('shipper_id', user.id);

      if (!error && data && data.length > 0) {
        setLoads(data);
        const mappedTrips: Trip[] = data.map((d: any) => ({
          id: d.id,
          name: d.commodity || d.origin || 'Freight Load',
          date: d.pickup_date || new Date().toDateString(),
          status: (d.status === 'In Transit' ? 'Active' : 'Completed') as 'Active' | 'Completed',
          earned: d.price ? String(d.price) : '0',
          avatar: 'https://i.pravatar.cc/150?u=' + d.id,
          truckId: d.assigned_truck_id || d.assignedTruckId || 'TR-001',
        }));
        setSelectedTrip((prev) => (prev ? mappedTrips.find((t) => t.id === prev.id) || mappedTrips[0] : mappedTrips[0]));
      } else {
        setLoads([]);
        setSelectedTrip(tripData[2]);
      }
    } catch (err) {
      console.error('Error loading shipper loads:', err);
      setSelectedTrip(tripData[2]);
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

    fetchLoads();

    // Supabase Realtime channel for shipper loads
    const channel = supabase
      .channel(`shipper-loads-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loads',
          filter: `shipper_id=eq.${user.id}`,
        },
        () => {
          fetchLoads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, authLoading, router, fetchLoads]);

  const handleMobileTripSelect = (tripId: string) => {
    router.push(`/dashboard/shipper/tracking/${tripId}`);
  };

  if (authLoading || isDataLoading) {
    return (
      <div className="p-6 space-y-6 bg-[#c8ccc6] min-h-screen flex flex-col justify-center items-center">
        <div className="w-full max-w-5xl bg-[#f2f3ef] p-6 rounded-2xl space-y-4 shadow-xl">
          <Skeleton className="h-12 w-full bg-[#e2e4dd]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-40 w-full bg-[#e2e4dd]" />
            <Skeleton className="h-40 w-full bg-[#e2e4dd]" />
            <Skeleton className="h-40 w-full bg-[#e2e4dd]" />
          </div>
          <Skeleton className="h-80 w-full bg-[#e2e4dd]" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View: 100% influence from design Screen 2 */}
      <div className="block md:hidden">
        <MobileRecentShipping
          userType="Shipper"
          onTripSelect={handleMobileTripSelect}
        />
      </div>

      {/* Desktop / Tablet View: Exact Loadrive / SecureHaul Tactile Dashboard */}
      <div className="hidden md:block w-full min-h-screen">
        <ShipperTactileDashboard realLoads={loads} />
      </div>
    </>
  );
}
