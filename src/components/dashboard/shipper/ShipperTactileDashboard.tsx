'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Bell,
  SlidersHorizontal,
} from 'lucide-react';
import { ShipperEarningsCard } from './ShipperEarningsCard';
import { ShipperBidQueueCard, DEFAULT_BIDS, type BidQueueItem } from './ShipperBidQueueCard';
import { ShipperFleetMixCard } from './ShipperFleetMixCard';
import { ShipperFleetCarousel } from './ShipperFleetCarousel';
import { ShipperHeroLoadStage } from './ShipperHeroLoadStage';
import { ShipperTactileMap } from './ShipperTactileMap';
import { SecureHaulLogo } from '@/components/ui/SecureHaulLogo';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';
import { DEFAULT_IN_TRANSIT_LOADS, type ShipperInTransitLoad } from './transitData';

interface ShipperTactileDashboardProps {
  realLoads?: any[];
}

export function ShipperTactileDashboard({ realLoads = [] }: ShipperTactileDashboardProps) {
  const { user, userProfile } = useSupabaseAuth();
  const { toast } = useToast();

  const [selectedBidIndex, setSelectedBidIndex] = useState<number>(0);
  const [selectedFleetIndex, setSelectedFleetIndex] = useState<number>(0);

  // In-transit fleet loads
  const inTransitLoads: ShipperInTransitLoad[] = useMemo(() => {
    if (realLoads && realLoads.length > 0) {
      const activeFromReal = realLoads.filter((l: any) => l.status === 'In Transit' || l.status === 'En route');
      if (activeFromReal.length > 0) {
        return activeFromReal.map((d: any, idx: number) => {
          const fallback = DEFAULT_IN_TRANSIT_LOADS[idx % DEFAULT_IN_TRANSIT_LOADS.length];
          return {
            ...fallback,
            id: d.id || fallback.id,
            plate: d.assigned_truck_id || fallback.plate,
            origin: d.origin || fallback.origin,
            destination: d.destination || fallback.destination,
            cargo: d.commodity || fallback.cargo,
            price: Number(d.price) || fallback.price,
            driver: d.assigned_driver || fallback.driver,
            driverInitials: (d.assigned_driver || fallback.driver).split(' ').map((n: string) => n[0]).join(''),
            statusText: (d.status || 'En route') + ' · 35 min ETA',
            distanceKm: d.distance_miles ? Math.round(d.distance_miles * 1.6) : fallback.distanceKm,
          };
        });
      }
    }
    return DEFAULT_IN_TRANSIT_LOADS;
  }, [realLoads]);

  // Derive Bids from real loads if available, or use defaults
  const bids: BidQueueItem[] = useMemo(() => {
    if (realLoads && realLoads.length > 0) {
      return realLoads.map((d: any, idx: number) => ({
        id: d.id || `real-${idx}`,
        origin: d.origin || 'Harare',
        destination: d.destination || 'Bulawayo',
        cargo: d.commodity || 'General Freight',
        weight: d.weight ? `${d.weight} lbs` : '1.2t',
        price: Number(d.price) || 340,
        driver: d.assigned_driver || 'Tendai M.',
        driverInitials: (d.assigned_driver || 'TM').split(' ').map((n: string) => n[0]).join(''),
        driverRating: '4.9',
        plate: d.assigned_truck_id || 'AZT 4521',
        statusText: (d.status || 'En route') + ' · 35 min ETA',
        distanceKm: d.distance_miles ? Math.round(d.distance_miles * 1.6) : 439,
        vehicleType: (d.equipment_type?.toLowerCase().includes('van') ? 'van' : 'truck') as any,
        suggestedFairFare: (Number(d.price) || 340) + 25,
      }));
    }
    return DEFAULT_BIDS;
  }, [realLoads]);

  // The active middle truck in the carousel
  const selectedTransitLoad = inTransitLoads[selectedFleetIndex] || inTransitLoads[0];

  const handleSendCounter = (amount: number) => {
    toast({
      title: 'Counter Offer Submitted',
      description: `Counter offer of $${amount} sent for route ${selectedTransitLoad.origin} → ${selectedTransitLoad.destination}.`,
    });
  };

  const handleDeclineLoad = () => {
    toast({
      variant: 'destructive',
      title: 'Load Declined',
      description: `Offer for route ${selectedTransitLoad.origin} → ${selectedTransitLoad.destination} was declined.`,
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#f2f3ef] flex flex-col font-sans text-[#171a16] antialiased">
      {/* ── APP MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── TOPBAR: BRAND & LIVE KPIS ── */}
        <header className="flex items-center gap-6 sm:gap-8 px-6 py-4.5 border-b border-[#e2e4dd] bg-[#f2f3ef] flex-wrap select-none">
          {/* Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <SecureHaulLogo size="sm" />
          </div>

          {/* 4 Live KPI stats */}
          <div className="flex gap-6 sm:gap-8 flex-1 flex-wrap">
            <div>
              <div className="text-[12px] text-[#82877c] mb-1">Active fleet</div>
              <div className="text-[22px] sm:text-[25px] font-bold text-[#171a16] leading-none tracking-tight font-mono">
                42<span className="text-[14px] font-medium text-[#82877c]">/50</span>
              </div>
            </div>

            <div>
              <div className="text-[12px] text-[#82877c] mb-1">Bid win rate</div>
              <div className="text-[22px] sm:text-[25px] font-bold text-[#171a16] leading-none tracking-tight font-mono">
                78<span className="text-[14px] font-medium text-[#82877c]">%</span>
              </div>
            </div>

            <div>
              <div className="text-[12px] text-[#82877c] mb-1">Avg match time</div>
              <div className="text-[22px] sm:text-[25px] font-bold text-[#171a16] leading-none tracking-tight font-mono">
                4.2<span className="text-[14px] font-medium text-[#82877c]">min</span>
              </div>
            </div>

            <div>
              <div className="text-[12px] text-[#82877c] mb-1">Escrow held</div>
              <div className="text-[22px] sm:text-[25px] font-bold text-[#171a16] leading-none tracking-tight font-mono">
                $18.4<span className="text-[14px] font-medium text-[#82877c]">k</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              aria-label="Search"
              className="w-8.5 h-8.5 rounded-full bg-white border border-[#e2e4dd] flex items-center justify-center text-[#171a16] hover:border-[#d3d6cd] shadow-sm transition-all active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              aria-label="Notifications"
              className="relative w-8.5 h-8.5 rounded-full bg-white border border-[#e2e4dd] flex items-center justify-center text-[#171a16] hover:border-[#d3d6cd] shadow-sm transition-all active:scale-95"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#2c7350] text-white text-[9px] font-bold flex items-center justify-center">
                3
              </span>
            </button>

            <button
              type="button"
              aria-label="Filters"
              className="w-8.5 h-8.5 rounded-full bg-white border border-[#e2e4dd] flex items-center justify-center text-[#171a16] hover:border-[#d3d6cd] shadow-sm transition-all active:scale-95"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* ── 3-COLUMN ASYMMETRIC GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_340px] gap-4.5 p-4.5 sm:p-5 flex-1 overflow-y-auto">
          {/* ── LEFT COLUMN: EARNINGS, BID QUEUE, FLEET MIX ── */}
          <div className="flex flex-col gap-4 min-w-0">
            <ShipperEarningsCard />
            <ShipperBidQueueCard
              bids={bids}
              selectedIndex={selectedBidIndex}
              onSelectBid={setSelectedBidIndex}
            />
            <ShipperFleetMixCard />
          </div>

          {/* ── CENTER HERO STAGE: 3-TRUCK GSAP CAROUSEL + SELECTED MIDDLE TRUCK LOAD DETAIL ── */}
          <section className="bg-white border border-[#e2e4dd] rounded-[20px] p-5 flex flex-col min-w-0 shadow-sm">
            {/* GSAP 3-Picture In-Transit Carousel (Past, Selected Middle, Next) */}
            <ShipperFleetCarousel
              loads={inTransitLoads}
              selectedIndex={selectedFleetIndex}
              onSelectLoad={setSelectedFleetIndex}
            />

            {/* Middle Truck Load Details Stage */}
            <ShipperHeroLoadStage
              selectedLoad={selectedTransitLoad}
              onSendCounter={handleSendCounter}
              onDeclineLoad={handleDeclineLoad}
            />
          </section>

          {/* ── RIGHT COLUMN: TACTILE VECTOR MAP WITH REAL-TIME LOCATION PIN ── */}
          <section className="flex flex-col min-w-0">
            <ShipperTactileMap
              selectedTruck={selectedTransitLoad}
              allTrucks={inTransitLoads}
              onSelectTruckIndex={setSelectedFleetIndex}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
