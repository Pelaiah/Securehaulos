'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight, Truck, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DEFAULT_IN_TRANSIT_LOADS,
  type ShipperInTransitLoad,
} from './transitData';

export type ShipperTransitLoad = ShipperInTransitLoad;
export { DEFAULT_IN_TRANSIT_LOADS as DEFAULT_TRANSIT_LOADS };

interface ShipperFleetCarouselProps {
  loads?: ShipperInTransitLoad[];
  selectedIndex?: number;
  onSelectLoad?: (index: number) => void;
  className?: string;
}

export function ShipperFleetCarousel({
  loads = DEFAULT_IN_TRANSIT_LOADS,
  selectedIndex = 0,
  onSelectLoad,
  className,
}: ShipperFleetCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const total = loads.length;

  // Compute the 3 indices: past (left), middle (selected center), and next (right)
  const pastIndex = (selectedIndex - 1 + total) % total;
  const middleIndex = selectedIndex;
  const nextIndex = (selectedIndex + 1) % total;

  const pastTruck = loads[pastIndex];
  const selectedTruck = loads[middleIndex];
  const nextTruck = loads[nextIndex];

  // GSAP animation for the 3 truck items
  useEffect(() => {
    if (!containerRef.current) return;

    const leftCard = containerRef.current.querySelector('.gsap-truck-left');
    const centerCard = containerRef.current.querySelector('.gsap-truck-center');
    const rightCard = containerRef.current.querySelector('.gsap-truck-right');

    if (centerCard) {
      gsap.to(centerCard, {
        scale: 1.15,
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power3.out',
        zIndex: 10,
      });
    }

    if (leftCard) {
      gsap.to(leftCard, {
        scale: 0.82,
        opacity: 0.4,
        y: 6,
        duration: 0.45,
        ease: 'power3.out',
        zIndex: 2,
      });
    }

    if (rightCard) {
      gsap.to(rightCard, {
        scale: 0.82,
        opacity: 0.4,
        y: 6,
        duration: 0.45,
        ease: 'power3.out',
        zIndex: 2,
      });
    }
  }, [selectedIndex]);

  const handlePrev = () => {
    onSelectLoad?.(pastIndex);
  };

  const handleNext = () => {
    onSelectLoad?.(nextIndex);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'border-b border-[#e2e4dd] pb-4 mb-4 select-none min-w-0 flex flex-col',
        className
      )}
    >
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold font-headline text-[#171a16] tracking-tight">
              Active Assigned Loads
            </h2>
            <span className="text-[11px] font-semibold text-[#82877c]">
              ({selectedIndex + 1}/{total} In Transit)
            </span>
          </div>
          <p className="text-xs text-[#82877c]">
            Interactive GSAP fleet visualizer · Click past or next truck to inspect
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Fleet Badge */}
          <div className="rounded-full border transition-colors bg-[#e7f4ee] border-green-500/30 text-[#2c7350] font-semibold px-2.5 py-1 text-xs flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#4fb583] animate-pulse" />
            <span>Live Fleet ({total})</span>
          </div>

          {/* Stepper Chevrons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous truck"
              className="w-7 h-7 rounded-full border border-[#e2e4dd] bg-white flex items-center justify-center text-[#82877c] hover:border-[#d3d6cd] hover:text-[#171a16] transition-all active:scale-95 shadow-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next truck"
              className="w-7 h-7 rounded-full border border-[#e2e4dd] bg-white flex items-center justify-center text-[#82877c] hover:border-[#d3d6cd] hover:text-[#171a16] transition-all active:scale-95 shadow-xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 3-TRUCK HORIZONTAL GSAP TRACK (PAST, SELECTED MIDDLE, NEXT) ── */}
      <div className="relative w-full h-[180px] sm:h-[210px] flex items-center justify-center my-1 overflow-hidden">
        {/* Road baseline with tactile dash pattern */}
        <div
          className="absolute left-[2%] right-[2%] bottom-[20%] h-px"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgb(211, 214, 205) 0px, rgb(211, 214, 205) 6px, transparent 6px, transparent 14px)',
            backgroundSize: '14px 1px',
            backgroundRepeat: 'repeat-x',
          }}
        />

        <div className="flex items-center justify-center gap-3 sm:gap-6 w-full max-w-4xl px-2">
          {/* ── 1. PAST TRUCK (LEFT) ── */}
          <div
            onClick={() => onSelectLoad?.(pastIndex)}
            role="button"
            tabIndex={0}
            className="gsap-truck-left relative cursor-pointer flex-shrink-0 w-[140px] sm:w-[200px] h-[110px] sm:h-[135px] flex flex-col items-center justify-center p-2 rounded-xl transition-all hover:opacity-70 group"
          >
            <span className="text-[10px] font-semibold text-[#82877c] mb-1 opacity-80 group-hover:text-[#171a16] transition-colors truncate max-w-full">
              ← Past: {pastTruck.plate}
            </span>
            <div className="w-full h-full flex items-center justify-center relative">
              <img
                src={pastTruck.image}
                alt={`Past truck ${pastTruck.plate}`}
                className="w-full h-full object-contain filter drop-shadow-sm group-hover:drop-shadow-md transition-all"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://i.imgur.com/tVrGgid.png';
                }}
              />
            </div>
          </div>

          {/* ── 2. SELECTED MIDDLE TRUCK (CENTER) ── */}
          <div
            role="button"
            tabIndex={0}
            className="gsap-truck-center relative cursor-pointer flex-shrink-0 w-[170px] sm:w-[250px] h-[130px] sm:h-[155px] flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gradient-to-b from-white/90 to-[#fbfbf9]/95 border border-[#2c7350]/30 shadow-[0_8px_24px_-10px_rgba(44,115,80,0.35)]"
          >
            {/* Active Tag */}
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#2c7350] mb-0.5">
              <span className="w-2 h-2 rounded-full bg-[#4fb583] animate-ping" />
              <span>Selected Active · {selectedTruck.plate}</span>
            </div>

            <div className="w-full h-full flex items-center justify-center relative">
              <img
                src={selectedTruck.image}
                alt={`Selected truck ${selectedTruck.plate}`}
                className="w-full h-full object-contain filter drop-shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://i.imgur.com/tVrGgid.png';
                }}
              />
            </div>

            {/* Quick destination caption */}
            <span className="text-[10px] text-[#82877c] font-medium mt-0.5 truncate max-w-[220px]">
              {selectedTruck.origin} → {selectedTruck.destination} ({selectedTruck.eta})
            </span>
          </div>

          {/* ── 3. NEXT TRUCK (RIGHT) ── */}
          <div
            onClick={() => onSelectLoad?.(nextIndex)}
            role="button"
            tabIndex={0}
            className="gsap-truck-right relative cursor-pointer flex-shrink-0 w-[140px] sm:w-[200px] h-[110px] sm:h-[135px] flex flex-col items-center justify-center p-2 rounded-xl transition-all hover:opacity-70 group"
          >
            <span className="text-[10px] font-semibold text-[#82877c] mb-1 opacity-80 group-hover:text-[#171a16] transition-colors truncate max-w-full">
              Next: {nextTruck.plate} →
            </span>
            <div className="w-full h-full flex items-center justify-center relative">
              <img
                src={nextTruck.image}
                alt={`Next truck ${nextTruck.plate}`}
                className="w-full h-full object-contain filter drop-shadow-sm group-hover:drop-shadow-md transition-all"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://i.imgur.com/tVrGgid.png';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── DOTS INDICATOR STRIP ── */}
      <div className="flex items-center justify-center gap-2 mt-1">
        {loads.map((load, idx) => {
          const isActive = idx === selectedIndex;
          return (
            <button
              key={load.id}
              type="button"
              onClick={() => onSelectLoad?.(idx)}
              aria-label={`Select truck ${load.plate}`}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                isActive ? 'w-6 bg-[#2c7350]' : 'w-2 bg-[#d3d6cd] hover:bg-[#b4b8ac]'
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
