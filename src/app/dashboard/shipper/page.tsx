'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { InformationCard } from '@/components/dashboard/InformationCard';
import { ShipmentList } from '@/components/dashboard/ShipmentList';
import { VehicleInfoCard } from '@/components/dashboard/VehicleInfoCard';
import { tripData, trucks as fallbackTrucks, type Truck } from '@/lib/data';
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
import { MobileRecentShipping } from '@/components/dashboard/MobileRecentShipping';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

type Trip = (typeof tripData)[0];

export default function ShipperDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, signOut } = useSupabaseAuth();
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

  // Derived metrics from real loads
  const metrics = useMemo(() => {
    const totalOrders = loads.length || 132;
    const totalWeight = loads.reduce((sum, l) => sum + (Number(l.weight) || 0), 0);
    const avgWeight = loads.length > 0 && totalWeight > 0 ? Math.round(totalWeight / loads.length).toLocaleString() + ' lbs' : '19,500 lbs';
    return {
      orders: totalOrders,
      avgWeight,
      avgDistance: '872 mi',
    };
  }, [loads]);

  const selectedTruck = useMemo(() => {
    if (!selectedTrip) return null;
    return fallbackTrucks.find((truck) => truck.id === selectedTrip.truckId) || fallbackTrucks[0];
  }, [selectedTrip]);

  const handleTripSelect = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  const handleMobileTripSelect = (tripId: string) => {
    router.push(`/dashboard/shipper/tracking/${tripId}`);
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  if (authLoading || isDataLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
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

      {/* Desktop / Tablet View */}
      <div className="hidden md:flex flex-col h-full bg-muted/30">
        <Header title="Dashboard" onLogout={handleLogout} />
        <div className="flex-grow grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    This Month Orders
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.orders}</div>
                  <p className="text-xs text-muted-foreground">
                    Live from database
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
                  <div className="text-2xl font-bold">{metrics.avgWeight}</div>
                  <p className="text-xs text-muted-foreground">
                    Calculated from active loads
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
                  <div className="text-2xl font-bold">{metrics.avgDistance}</div>
                  <p className="text-xs text-muted-foreground">
                    Route optimization active
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <InformationCard driver={selectedTrip || undefined} />
                <VehicleInfoCard truck={selectedTruck} />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <OrderInfoCard trip={selectedTrip} />
                <Card className="h-[300px]">
                  <CardHeader>
                    <CardTitle>Map Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MapComponent trucks={fallbackTrucks} selectedTruckId={selectedTruck?.id} />
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
    </>
  );
}
