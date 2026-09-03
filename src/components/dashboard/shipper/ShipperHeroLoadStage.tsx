'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  ArrowRight,
  Star,
  Check,
  X,
  Car,
  Truck,
  Bus,
  List,
  FileText,
  Heart,
  Utensils,
  Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BidQueueItem } from './ShipperBidQueueCard';
import type { ShipperInTransitLoad } from './transitData';

interface ShipperHeroLoadStageProps {
  selectedLoad?: (BidQueueItem & Partial<ShipperInTransitLoad>) | ShipperInTransitLoad;
  onSendCounter?: (amount: number) => void;
  onDeclineLoad?: () => void;
}

export function ShipperHeroLoadStage({
  selectedLoad,
  onSendCounter,
  onDeclineLoad,
}: ShipperHeroLoadStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLoad = selectedLoad || {
    id: 'bid-1',
    origin: 'Harare',
    destination: 'Bulawayo',
    cargo: 'Electronics',
    weight: '1.2t',
    price: 340,
    driver: 'Tendai M.',
    driverInitials: 'TM',
    driverRating: '4.9',
    driverLoads: 312,
    plate: 'AZT 4521',
    statusText: 'En route · 42 min ETA',
    distanceKm: 439,
    vehicleType: 'truck' as const,
    suggestedFairFare: 365,
  };

  const clientOffer = currentLoad.price || 340;
  const initialCounter = clientOffer + 45;

  const [counterFare, setCounterFare] = useState<number>(initialCounter);
  const [negoStatus, setNegoStatus] = useState<string>('Awaiting client response');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [activeVehicleFilter, setActiveVehicleFilter] = useState<string>(
    currentLoad.vehicleType || 'truck'
  );

  // Sync state and trigger GSAP micro-transition when selected load changes
  useEffect(() => {
    setCounterFare(clientOffer + 45);
    setNegoStatus('Awaiting client response');
    setIsLocked(false);
    if (currentLoad.vehicleType) {
      setActiveVehicleFilter(currentLoad.vehicleType);
    }

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0.7, y: 5 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [selectedLoad, clientOffer, currentLoad.vehicleType]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCounterFare(Number(e.target.value));
    setNegoStatus('Awaiting client response');
    setIsLocked(false);
  };

  const handleSendCounter = () => {
    setIsLocked(true);
    setNegoStatus(`Fare locked · $${counterFare}`);
    onSendCounter?.(counterFare);
  };

  const handleDecline = () => {
    setIsLocked(false);
    setNegoStatus('Counter declined');
    onDeclineLoad?.();
  };

  const cargoChips = (currentLoad as any).cargoChips || [
    { type: 'cpu', name: 'Electronics', weight: '420kg' },
    { type: 'file', name: 'Documents', weight: '16kg' },
    { type: 'heart', name: 'Medical', weight: '188kg' },
    { type: 'utensils', name: 'Food', weight: '60kg' },
  ];

  return (
    <div ref={containerRef} className="flex flex-col flex-1 min-w-0">
      {/* ── DRIVER & PLATE HEADER ── */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        {/* Driver */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#171a16] text-white flex items-center justify-center text-xs font-bold shadow-sm ring-2 ring-[#e2e4dd]">
            {currentLoad.driverInitials || 'TM'}
          </div>
          <div>
            <div className="text-[13.5px] font-bold text-[#171a16] leading-tight">
              {currentLoad.driver || 'Tendai M.'}
            </div>
            <div className="text-[11.5px] text-[#82877c] flex items-center gap-1">
              <Star className="w-2.5 h-2.5 text-[#2c7350] fill-[#2c7350]" />
              <span>{currentLoad.driverRating || '4.9'}</span>
              <span>· {(currentLoad as any).driverLoads || 312} loads</span>
            </div>
          </div>
        </div>

        {/* License plate & live radar */}
        <div className="flex items-center gap-2 text-[12px] text-[#82877c]">
          <span className="font-mono font-bold text-[#171a16] bg-[#f4f5f7] px-2 py-0.5 rounded border border-[#e2e4dd]">
            {currentLoad.plate || 'AZT 4521'}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#2c7350] font-semibold bg-[#e7f4ee] px-2 py-0.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4fb583] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4fb583]" />
            </span>
            <span>{currentLoad.statusText || 'En route · 42 min ETA'}</span>
          </span>
        </div>
      </div>

      {/* ── ROUTE LINE ── */}
      <div className="flex items-center gap-2.5 text-[18px] sm:text-[20px] font-bold tracking-tight text-[#171a16] mb-0.5">
        <span>{currentLoad.origin}</span>
        <ArrowRight className="w-4 h-4 text-[#b4b8ac] shrink-0" />
        <span>{currentLoad.destination}</span>
      </div>
      <div className="text-[12.5px] text-[#82877c] mb-4">
        {currentLoad.distanceKm || 439} km ·{' '}
        {(currentLoad.vehicleType as string) === 'car'
          ? 'Car · Sedan courier'
          : (currentLoad.vehicleType as string) === 'bus'
          ? 'Bus · 24-seat coach'
          : 'Truck · 6-wheel flatbed'}{' '}
        · <span className="font-semibold text-[#171a16]">{currentLoad.cargo}</span> ({currentLoad.weight})
      </div>

      {/* ── VEHICLE STAGE WITH FLOATING CARGO CHIPS ── */}
      <div className="relative flex-1 min-h-[210px] flex items-center justify-center mb-4 py-2">
        {/* Road baseline */}
        <div
          className="absolute left-[6%] right-[6%] bottom-[18%] h-px"
          style={{
            backgroundImage:
              'linear-gradient(to right, #d3d6cd 0 6px, transparent 6px 14px)',
            backgroundSize: '14px 1px',
            backgroundRepeat: 'repeat-x',
          }}
        />

        {/* ── SELECTED TRUCK PHOTO — same image as the carousel's active center slot ── */}
        <div className="relative w-full h-full flex items-end justify-center z-10">
          <img
            src={(currentLoad as any).image || '/Flat Truck.jfif'}
            alt={`Truck ${currentLoad.plate || 'AZT 4521'}`}
            className="w-full max-w-full h-full object-contain filter drop-shadow-xl transition-all duration-500"
            style={{ maxHeight: '190px' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/Flat Truck.jfif';
            }}
          />
        </div>

        {/* Top-Right Cargo Chip Cluster */}
        <div className="absolute top-[8%] right-[2%] flex flex-col gap-2 z-20">
          {cargoChips.slice(0, 3).map((chip: any, i: number) => {
            const Icon =
              chip.type === 'cpu'
                ? Cpu
                : chip.type === 'heart'
                ? Heart
                : chip.type === 'utensils'
                ? Utensils
                : FileText;
            return (
              <div
                key={i}
                className="bg-white border border-[#e2e4dd] shadow-[0_14px_30px_-18px_rgba(23,26,22,0.35)] rounded-[10px] px-3 py-1.5 text-[11.5px] flex items-center gap-1.5 whitespace-nowrap"
              >
                <Icon className="w-3.5 h-3.5 text-[#2c7350]" />
                <b className="font-semibold text-[#171a16]">{chip.name}</b>
                <span className="text-[#82877c]">{chip.weight}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom-Left Cargo Chip Cluster */}
        <div className="absolute bottom-[6%] left-[2%] flex flex-col gap-2 z-20">
          {cargoChips.slice(3, 4).map((chip: any, i: number) => {
            const Icon =
              chip.type === 'cpu'
                ? Cpu
                : chip.type === 'heart'
                ? Heart
                : chip.type === 'utensils'
                ? Utensils
                : FileText;
            return (
              <div
                key={i}
                className="bg-white border border-[#e2e4dd] shadow-[0_14px_30px_-18px_rgba(23,26,22,0.35)] rounded-[10px] px-3 py-1.5 text-[11.5px] flex items-center gap-1.5 whitespace-nowrap"
              >
                <Icon className="w-3.5 h-3.5 text-[#2c7350]" />
                <b className="font-semibold text-[#171a16]">{chip.name}</b>
                <span className="text-[#82877c]">{chip.weight}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FARE NEGOTIATION DOCK ── */}
      <div className="border-t border-[#e2e4dd] pt-3.5 flex flex-col gap-2.5">
        {/* Figures header */}
        <div className="flex justify-between items-end flex-wrap gap-2">
          <div>
            <div className="text-[11px] text-[#82877c] mb-0.5">Client offer</div>
            <div className="text-[16px] font-bold text-[#171a16] font-mono">
              ${clientOffer}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#82877c] mb-0.5">Your counter</div>
            <div className="text-[16px] font-bold text-[#2c7350] font-mono">
              ${counterFare}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#82877c] mb-0.5">Suggested fair fare</div>
            <div className="text-[16px] font-bold text-[#171a16] font-mono">
              ${currentLoad.suggestedFairFare || 365}
            </div>
          </div>
        </div>

        {/* Interactive slider */}
        <div className="py-1">
          <input
            type="range"
            min={Math.max(100, clientOffer - 60)}
            max={clientOffer + 150}
            step={5}
            value={counterFare}
            onChange={handleSliderChange}
            aria-label="Set counter fare"
            className="w-full h-1.5 rounded-full bg-[#e2e4dd] accent-[#2c7350] cursor-pointer"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleSendCounter}
            className="h-9 px-4 rounded-[9px] bg-[#171a16] hover:bg-black text-white text-[12.5px] font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            Send counter
          </button>

          <button
            type="button"
            onClick={handleDecline}
            className="h-9 px-4 rounded-[9px] bg-white border border-[#e2e4dd] hover:border-[#d3d6cd] text-[#82877c] hover:text-[#171a16] text-[12.5px] font-semibold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <X className="w-3.5 h-3.5" />
            Decline
          </button>

          <span
            className={cn(
              'text-[12px] ml-auto transition-colors',
              isLocked ? 'text-[#2c7350] font-bold' : 'text-[#82877c]'
            )}
          >
            {negoStatus}
          </span>
        </div>
      </div>

      {/* ── BOTTOM DOCK: VEHICLE TYPE FILTER ── */}
      <nav aria-label="Vehicle type filter" className="flex justify-center gap-2.5 mt-4">
        {[
          { id: 'car', icon: Car, label: 'Cars' },
          { id: 'truck', icon: Truck, label: 'Trucks' },
          { id: 'bus', icon: Bus, label: 'Buses' },
          { id: 'list', icon: List, label: 'List view' },
        ].map((btn) => {
          const Icon = btn.icon;
          const isActive = activeVehicleFilter === btn.id;
          return (
            <button
              key={btn.id}
              type="button"
              onClick={() => setActiveVehicleFilter(btn.id)}
              aria-label={btn.label}
              className={cn(
                'w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-150 active:scale-95',
                isActive
                  ? 'bg-[#2c7350] border-[#2c7350] text-white shadow-sm'
                  : 'bg-[#fbfbf9] border-[#e2e4dd] text-[#82877c] hover:border-[#d3d6cd] hover:text-[#171a16]'
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
