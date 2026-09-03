'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BidQueueItem {
  id: string;
  origin: string;
  destination: string;
  cargo: string;
  weight: string;
  price: number;
  driver?: string;
  driverInitials?: string;
  driverRating?: string;
  plate?: string;
  statusText?: string;
  distanceKm?: number;
  vehicleType?: 'truck' | 'car' | 'bus' | 'van';
  suggestedFairFare?: number;
}

export const DEFAULT_BIDS: BidQueueItem[] = [
  {
    id: 'bid-1',
    origin: 'Harare',
    destination: 'Bulawayo',
    cargo: 'Electronics',
    weight: '1.2t',
    price: 340,
    driver: 'Tendai M.',
    driverInitials: 'TM',
    driverRating: '4.9',
    plate: 'AZT 4521',
    statusText: 'En route · 42 min ETA',
    distanceKm: 439,
    vehicleType: 'truck',
    suggestedFairFare: 365,
  },
  {
    id: 'bid-2',
    origin: 'Harare',
    destination: 'Mutare',
    cargo: 'Documents',
    weight: '40kg',
    price: 210,
    driver: 'Ruvimbo K.',
    driverInitials: 'RK',
    driverRating: '4.8',
    plate: 'ABJ 9027',
    statusText: 'Awaiting pickup · 12 min ETA',
    distanceKm: 263,
    vehicleType: 'car',
    suggestedFairFare: 245,
  },
  {
    id: 'bid-3',
    origin: 'Gweru',
    destination: 'Masvingo',
    cargo: 'Passengers',
    weight: '24 seats',
    price: 150,
    driver: 'Farai C.',
    driverInitials: 'FC',
    driverRating: '4.7',
    plate: 'AGM 3310',
    statusText: 'Boarding · departs 15:40',
    distanceKm: 178,
    vehicleType: 'bus',
    suggestedFairFare: 175,
  },
];

interface ShipperBidQueueCardProps {
  bids?: BidQueueItem[];
  selectedIndex?: number;
  onSelectBid?: (index: number) => void;
}

export function ShipperBidQueueCard({
  bids = DEFAULT_BIDS,
  selectedIndex = 0,
  onSelectBid,
}: ShipperBidQueueCardProps) {
  return (
    <section className="bg-white border border-[#e2e4dd] rounded-[20px] p-4 sm:p-4.5 shadow-sm text-[#171a16] select-none">
      {/* Head */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[13.5px] font-semibold text-[#171a16]">
          Bid queue
        </span>
        <span className="text-[11px] font-semibold text-[#2c7350] bg-[#e7f4ee] px-2 py-0.5 rounded-full">
          {bids.length} new
        </span>
      </div>

      {/* List of bids */}
      <div className="flex flex-col gap-2">
        {bids.map((bid, index) => {
          const isSelected = selectedIndex === index;
          return (
            <div
              key={bid.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectBid?.(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectBid?.(index);
                }
              }}
              className={cn(
                'border rounded-[10px] p-2.5 sm:px-3 sm:py-2.5 cursor-pointer transition-all duration-150',
                isSelected
                  ? 'border-[#2c7350] bg-[#e7f4ee] shadow-sm'
                  : 'border-[#e2e4dd] bg-white hover:border-[#d3d6cd]'
              )}
            >
              {/* Route */}
              <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#171a16] mb-1">
                <span>{bid.origin}</span>
                <ArrowRight className="w-3 h-3 text-[#b4b8ac] shrink-0" />
                <span>{bid.destination}</span>
              </div>

              {/* Sub info */}
              <div className="flex justify-between items-center text-[11.5px]">
                <span className="text-[#82877c]">
                  {bid.cargo} · {bid.weight}
                </span>
                <span className="text-[13px] font-bold text-[#2c7350] font-mono">
                  ${bid.price}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
