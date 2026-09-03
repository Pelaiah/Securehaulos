'use client';

import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface FleetTruckLoad {
  id: number;
  image: string;
  driver: string;
  cargo: string;
  weight: string;
  destination: string;
  status: string;
  origin?: string;
  payout?: number;
}

export const FLEET_LOADS: FleetTruckLoad[] = [
  {
    id: 1,
    image: '/Flat Truck.jfif',
    driver: 'Michael T.',
    cargo: 'Construction Steel',
    weight: '12,500 kg',
    destination: 'Brooklyn • 14:30',
    status: 'In Transit',
    origin: 'Newark Hub',
    payout: 3450,
  },
  {
    id: 2,
    image: '/Clean & Modern Transport Truck Design.jfif',
    driver: 'Sarah W.',
    cargo: 'Electronics & Medical',
    weight: '8,420 kg',
    destination: 'Manhattan • 16:45',
    status: 'On Schedule',
    origin: 'Queens Terminal',
    payout: 4200,
  },
  {
    id: 3,
    image: '/Bulkheads separate the main storage section and minimize back-and-forth motion and maximize efficiency_.jfif',
    driver: 'James R.',
    cargo: 'Liquid Chemicals',
    weight: '18,000 L',
    destination: 'Queens • 09:15',
    status: 'Loading',
    origin: 'Jersey City Chem Depot',
    payout: 5100,
  },
  {
    id: 4,
    image: '/download.jfif',
    driver: 'David K.',
    cargo: 'Refrigerated Produce',
    weight: '14,200 kg',
    destination: 'Bronx • 18:00',
    status: 'In Transit',
    origin: 'Philadelphia Cold Storage',
    payout: 3890,
  },
];

interface ShipperGsapFleetCarouselProps {
  onSelectTruck?: (truck: FleetTruckLoad) => void;
  className?: string;
}

export function ShipperGsapFleetCarousel({ onSelectTruck, className }: ShipperGsapFleetCarouselProps) {
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [displayedTruck, setDisplayedTruck] = useState<FleetTruckLoad>(FLEET_LOADS[1]);
  const truckTrackRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Update visual state of the truck carousel items with GSAP
  useEffect(() => {
    if (!truckTrackRef.current) return;
    const items = truckTrackRef.current.querySelectorAll('.gsap-truck-item');

    items.forEach((item, index) => {
      if (index === activeIndex) {
        gsap.to(item, {
          scale: 1.15,
          opacity: 1,
          duration: 0.45,
          ease: 'power3.out',
          zIndex: 10,
        });
      } else {
        gsap.to(item, {
          scale: 0.8,
          opacity: 0.4,
          duration: 0.45,
          ease: 'power3.out',
          zIndex: 1,
        });
      }
    });
  }, [activeIndex]);

  // Handle truck click and animate load details in/out
  const handleSelectTruck = (index: number) => {
    if (index === activeIndex) return;

    setActiveIndex(index);
    const nextTruck = FLEET_LOADS[index];
    onSelectTruck?.(nextTruck);

    // GSAP details transition: fade & slide down slightly, swap data, fade & slide up
    if (detailsRef.current) {
      gsap.to(detailsRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: () => {
          setDisplayedTruck(nextTruck);
          gsap.to(detailsRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
          });
        },
      });
    } else {
      setDisplayedTruck(nextTruck);
    }
  };

  return (
    <div className={cn('bg-white border border-[#e2e4dd] rounded-[22px] p-5 sm:p-6 shadow-sm select-none', className)}>
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-headline text-[#171a16] tracking-tight">
            Active Assigned Loads
          </h2>
          <p className="text-xs text-[#82877c]">
            Interactive GSAP fleet visualizer · Click any truck to inspect live cargo metrics
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-[#e7f4ee] border-green-500/30 text-[#2c7350] font-semibold px-3 py-1 text-xs flex items-center gap-1.5"
        >
          <span className="w-2 h-2 rounded-full bg-[#4fb583] animate-pulse" />
          Live Fleet ({FLEET_LOADS.length})
        </Badge>
      </div>

      {/* ── GSAP HORIZONTAL TRUCK CAROUSEL ── */}
      <div className="relative w-full h-[180px] sm:h-[220px] flex items-center justify-center my-2 overflow-hidden">
        {/* Background baseline */}
        <div
          className="absolute left-[4%] right-[4%] bottom-[20%] h-px"
          style={{
            backgroundImage: 'linear-gradient(to right, #d3d6cd 0 6px, transparent 6px 14px)',
            backgroundSize: '14px 1px',
            backgroundRepeat: 'repeat-x',
          }}
        />

        <div ref={truckTrackRef} className="flex items-center justify-center gap-4 sm:gap-6 w-full">
          {FLEET_LOADS.map((truck, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={truck.id}
                onClick={() => handleSelectTruck(idx)}
                className="gsap-truck-item relative cursor-pointer flex-shrink-0 w-[170px] sm:w-[230px] h-[110px] sm:h-[140px] flex items-center justify-center p-2 rounded-xl transition-shadow"
                style={{ opacity: isActive ? 1 : 0.4, transform: `scale(${isActive ? 1.15 : 0.8})` }}
              >
                <img
                  src={truck.image}
                  alt={`Truck ${truck.id}`}
                  className="w-full h-full object-contain filter drop-shadow-md hover:drop-shadow-lg transition-all"
                  onError={(e) => {
                    // Fallback to high-quality SVG illustration if jfif is loading locally
                    (e.target as HTMLImageElement).src =
                      'https://i.imgur.com/tVrGgid.png';
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── LOAD DETAILS SECTION (ANIMATED WITH GSAP) ── */}
      <div
        ref={detailsRef}
        className="bg-[#f4f5f7] border border-[#e2e4dd] rounded-2xl p-4 sm:p-5 mt-2"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#82877c] mb-1">
              Cargo Type
            </span>
            <span className="text-sm sm:text-base font-bold text-[#171a16] truncate">
              {displayedTruck.cargo}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#82877c] mb-1">
              Load Weight / Vol
            </span>
            <span className="text-sm sm:text-base font-bold text-[#171a16]">
              {displayedTruck.weight}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#82877c] mb-1">
              Destination & ETA
            </span>
            <span className="text-sm sm:text-base font-bold text-[#2c7350]">
              {displayedTruck.destination}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#82877c] mb-1">
              Assigned Driver
            </span>
            <span className="text-sm sm:text-base font-bold text-[#171a16] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2c7350]" />
              {displayedTruck.driver}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
