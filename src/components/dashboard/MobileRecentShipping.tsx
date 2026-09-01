'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, Package, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';
import { supabase } from '@/lib/supabase/client';

interface Shipment {
  id: string;
  tripId: string;
  label: string;
  status: 'Awaiting Pickup' | 'In Transit' | 'Completed' | 'Draft';
  price: string;
  carrier: string;
  expectedDate: string;
  notificationCount?: number;
  filterTab: 'assigned' | 'pending' | 'completed' | 'drafts';
}

const STATUS_STYLES: Record<string, string> = {
  'Awaiting Pickup': 'bg-[#7C3AED] text-white',
  'In Transit': 'bg-[#16A34A] text-white',
  'Completed': 'bg-[#2563EB] text-white',
  'Draft': 'bg-[#6B7280] text-white',
};

type FilterTab = 'assigned' | 'pending' | 'completed' | 'drafts';

interface MobileRecentShippingProps {
  onTripSelect?: (tripId: string) => void;
  userType?: 'Shipper' | 'Carrier';
}

export function MobileRecentShipping({
  onTripSelect,
  userType = 'Shipper',
}: MobileRecentShippingProps) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useSupabaseAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('assigned');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    async function fetchShipments() {
      setIsLoading(true);
      try {
        let query = supabase.from('loads').select('*');
        if (userType === 'Shipper') {
          query = query.eq('shipper_id', user!.id);
        } else {
          query = query.eq('carrier_id', user!.id);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          const mapped: Shipment[] = data.map((load: any) => {
            const rawStatus = load.status || 'Draft';
            let status: Shipment['status'] = 'Draft';
            let filterTab: FilterTab = 'drafts';

            if (rawStatus === 'In Transit' || rawStatus === 'On Route') {
              status = 'In Transit';
              filterTab = 'assigned';
            } else if (rawStatus === 'Pending' || rawStatus === 'Posted') {
              status = 'Awaiting Pickup';
              filterTab = 'pending';
            } else if (rawStatus === 'Delivered' || rawStatus === 'Completed') {
              status = 'Completed';
              filterTab = 'completed';
            }

            return {
              id: `#${load.id.slice(0, 8)}`,
              tripId: load.id,
              label: load.commodity || load.origin || 'Freight Load',
              status,
              price: load.price ? `$${load.price}` : '$0',
              carrier: load.carrier_name || (userType === 'Carrier' ? 'My Fleet' : 'Pending Assignment'),
              expectedDate: load.delivery_date ? new Date(load.delivery_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Pending',
              notificationCount: load.status === 'Pending' ? 1 : undefined,
              filterTab,
            };
          });
          setShipments(mapped);
        } else {
          setShipments([]);
        }
      } catch (err) {
        console.error('Error fetching mobile shipments:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchShipments();

    // Supabase Realtime channel
    const channel = supabase
      .channel(`mobile-loads-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loads',
          filter: userType === 'Shipper' ? `shipper_id=eq.${user.id}` : `carrier_id=eq.${user.id}`,
        },
        () => {
          fetchShipments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userType]);

  const handleCardClick = (tripId: string) => {
    if (onTripSelect) {
      onTripSelect(tripId);
    } else {
      router.push(`/dashboard/shipper/tracking/${tripId}`);
    }
  };

  const filtered = shipments.filter((s: Shipment) => {
    const matchesTab = s.filterTab === activeTab;
    const matchesSearch =
      !searchQuery ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.carrier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'assigned', label: 'Assigned' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
    { key: 'drafts', label: 'Drafts' },
  ];

  return (
    <div className="md:hidden flex flex-col min-h-screen bg-[#0E1015] text-white">
      {/* ── Header ───────────────────────────── */}
      <div className="px-5 pt-10 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-headline">
            My Shipments
          </h1>
          <button
            type="button"
            className="relative w-11 h-11 rounded-full bg-[#1A1C26] border border-white/10 flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-white/80" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shipment"
            className="w-full bg-[#1A1C26] border border-white/5 text-sm placeholder:text-muted-foreground/60 text-white rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150',
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-[0_4px_12px_rgba(255,107,0,0.35)]'
                  : 'text-muted-foreground hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Cards ───────────────────────────── */}
      <div className="flex-1 px-5 pb-32 space-y-3">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-muted-foreground text-sm">Loading shipments...</p>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">No shipments found</p>
          </div>
        )}

        {filtered.map((shipment) => (
          <button
            key={shipment.id}
            type="button"
            onClick={() => handleCardClick(shipment.tripId)}
            className="w-full text-left bg-[#16181F] border border-white/[0.07] rounded-2xl p-4 active:scale-[0.99] transition-transform duration-100"
          >
            {/* Row 1: ID + Status Badge */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#22252F] flex items-center justify-center">
                  <Package className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-white leading-none">{shipment.id}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{shipment.label}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-[11px] font-semibold',
                    STATUS_STYLES[shipment.status]
                  )}
                >
                  {shipment.status}
                </span>
                {shipment.notificationCount && (
                  <div className="w-5 h-5 rounded-full bg-[#FF6B00] flex items-center justify-center text-[10px] font-bold text-white">
                    {shipment.notificationCount}
                  </div>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Row 2: Price */}
            <p className="text-xl font-extrabold text-white mb-3 pl-[42px]">
              {shipment.price}
            </p>

            {/* Divider */}
            <div className="h-px bg-white/[0.05] mb-3" />

            {/* Row 3: Carrier + Expected */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <p className="text-muted-foreground">Shipped by:</p>
                <p className="font-semibold text-white mt-0.5">{shipment.carrier}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Expected on:</p>
                <p className="font-semibold text-white mt-0.5">{shipment.expectedDate}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
