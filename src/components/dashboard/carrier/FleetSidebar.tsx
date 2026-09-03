'use client';

import React, { useState } from 'react';
import {
  Truck,
  Zap,
  Gauge,
  Thermometer,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  Radio,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface FleetTruckItem {
  id: string;
  name: string;
  plate: string;
  model: string;
  driver: {
    name: string;
    avatar: string;
    phone: string;
    complianceScore: number;
  };
  status: 'In Transit' | 'Loading' | 'Available' | 'Maintenance';
  batteryOrFuel: number; // 0 - 100
  payloadPercent: number; // 0 - 100
  totalCapacityLbs: number;
  currentPayloadLbs: number;
  speedMph: number;
  temp?: string;
  location: string;
  destination: string;
  compatibilityTags: string[];
}

export const DEFAULT_FLEET_TRUCKS: FleetTruckItem[] = [
  {
    id: 'TRK-101',
    name: 'Actros Edition 2',
    plate: 'ADL4681',
    model: 'Mercedes-Benz Actros 1851',
    driver: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 892-4411',
      complianceScore: 98,
    },
    status: 'In Transit',
    batteryOrFuel: 84,
    payloadPercent: 68,
    totalCapacityLbs: 45000,
    currentPayloadLbs: 30600,
    speedMph: 64,
    temp: '-4.0°C',
    location: 'Barstow, CA',
    destination: 'Phoenix, AZ',
    compatibilityTags: ['Reefer', 'HazMat Class 3', 'High-Cube'],
  },
  {
    id: 'TRK-102',
    name: 'Scania R Series',
    plate: 'SCN9022',
    model: 'Scania R 580 V8',
    driver: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 341-9988',
      complianceScore: 99,
    },
    status: 'In Transit',
    batteryOrFuel: 92,
    payloadPercent: 82,
    totalCapacityLbs: 48000,
    currentPayloadLbs: 39360,
    speedMph: 68,
    temp: '2.0°C',
    location: 'Las Vegas, NV',
    destination: 'Salt Lake City, UT',
    compatibilityTags: ['Dry Van', 'Pallet-Tier 1'],
  },
  {
    id: 'TRK-103',
    name: 'Volvo FH16 Aero',
    plate: 'VLV1044',
    model: 'Volvo FH16 750 Globetrotter',
    driver: {
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 772-1049',
      complianceScore: 96,
    },
    status: 'Loading',
    batteryOrFuel: 68,
    payloadPercent: 42,
    totalCapacityLbs: 44000,
    currentPayloadLbs: 18480,
    speedMph: 0,
    temp: '-18.0°C',
    location: 'Phoenix Gateway Hub',
    destination: 'Denver Logistics Center',
    compatibilityTags: ['Deep Freeze', 'Pharma Validated'],
  },
  {
    id: 'TRK-104',
    name: 'MAN TGX Prime',
    plate: 'MAN8819',
    model: 'MAN TGX 18.640',
    driver: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 209-6612',
      complianceScore: 100,
    },
    status: 'Available',
    batteryOrFuel: 100,
    payloadPercent: 0,
    totalCapacityLbs: 46000,
    currentPayloadLbs: 0,
    speedMph: 0,
    location: 'Ontario Yard, CA',
    destination: 'Awaiting Dispatch',
    compatibilityTags: ['Standard 53ft', 'Multi-Drop'],
  },
];

interface FleetSidebarProps {
  trucks?: FleetTruckItem[];
  selectedTruckId?: string;
  onSelectTruck?: (truck: FleetTruckItem) => void;
}

export function FleetSidebar({
  trucks = DEFAULT_FLEET_TRUCKS,
  selectedTruckId,
  onSelectTruck,
}: FleetSidebarProps) {
  const [filterTab, setFilterTab] = useState<'All' | 'Transit' | 'Loading' | 'Available'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrucks = trucks.filter((t) => {
    const matchesFilter =
      filterTab === 'All'
        ? true
        : filterTab === 'Transit'
        ? t.status === 'In Transit'
        : filterTab === 'Loading'
        ? t.status === 'Loading'
        : t.status === 'Available';

    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.driver.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <aside className="w-full md:w-[320px] shrink-0 bg-[#FFFFFF] border-r border-[#E1E6E2] flex flex-col h-full overflow-hidden text-[#1C1E21] select-none">
      {/* ── HEADER ── */}
      <div className="p-4 border-b border-[#E1E6E2] space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E737B]">
              Active Fleet Assets
            </span>
            <h2 className="text-[16px] font-black text-[#1C1E21]">Truck Manifest ({trucks.length})</h2>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#34785D] animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-[#34785D]">GPS Active</span>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#6E737B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by plate, model, driver..."
            className="w-full bg-[#F7F8F6] border border-[#E1E6E2] rounded-xl pl-9 pr-3 py-1.5 text-[12px] text-[#1C1E21] placeholder:text-[#6E737B] focus:outline-none focus:border-[#34785D]"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#F7F8F6] border border-[#E1E6E2]">
          {(['All', 'Transit', 'Loading', 'Available'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterTab(tab)}
              className={cn(
                'flex-1 py-1 rounded-md text-[10px] font-bold transition-all',
                filterTab === tab
                  ? 'bg-[#34785D] text-white shadow-sm'
                  : 'text-[#6E737B] hover:text-[#1C1E21]'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── FLEET TRUCK CARDS (SCROLLABLE) ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#F7F8F6]/40">
        {filteredTrucks.map((truck) => {
          const isSelected = selectedTruckId ? selectedTruckId === truck.id : truck.id === trucks[0]?.id;

          return (
            <div
              key={truck.id}
              onClick={() => onSelectTruck?.(truck)}
              className={cn(
                'p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left relative group',
                isSelected
                  ? 'bg-[#E8F4EE] border-[#34785D] shadow-[0_4px_16px_rgba(52,120,93,0.08)]'
                  : 'bg-[#FFFFFF] border-[#E1E6E2] hover:border-[#34785D]/40 hover:bg-[#F7F8F6]/80 shadow-sm'
              )}
            >
              {/* Active Indicator Strip */}
              {isSelected && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#34785D] rounded-r-full" />
              )}

              {/* Truck Header Row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[13px] font-black text-[#1C1E21] group-hover:text-[#34785D] transition-colors">
                      {truck.name}
                    </h3>
                    <span className="px-1.5 py-0.5 rounded bg-[#FFFFFF] border border-[#E1E6E2] text-[9px] font-mono text-[#34785D] font-bold">
                      {truck.plate}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#6E737B] line-clamp-1">{truck.model}</p>
                </div>

                <span
                  className={cn(
                    'px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider',
                    truck.status === 'In Transit'
                      ? 'bg-[#E8F4EE] text-[#34785D] border border-[#34785D]/20'
                      : truck.status === 'Loading'
                      ? 'bg-[#F7F8F6] text-[#6E737B] border border-[#E1E6E2]'
                      : 'bg-[#E8F4EE] text-[#34785D]'
                  )}
                >
                  {truck.status}
                </span>
              </div>

              {/* Driver and Location */}
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#E1E6E2] text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Avatar className="w-5 h-5 border border-[#E1E6E2]">
                    <AvatarImage src={truck.driver.avatar} alt={truck.driver.name} />
                    <AvatarFallback className="text-[8px] bg-[#E8F4EE] text-[#34785D]">{truck.driver.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-[#1C1E21] text-[11px] font-medium">{truck.driver.name}</span>
                </div>
                <span className="text-[10px] text-[#6E737B] flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5 text-[#34785D]" />
                  {truck.location}
                </span>
              </div>

              {/* Telemetry Metrics Bar */}
              <div className="grid grid-cols-3 gap-1.5 mt-2.5 bg-[#F7F8F6] p-2 rounded-xl border border-[#E1E6E2]">
                {/* Energy */}
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#6E737B] uppercase font-bold flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-[#34785D]" /> Energy
                  </span>
                  <span className="text-[12px] font-black text-[#1C1E21] font-mono">
                    {truck.batteryOrFuel}%
                  </span>
                </div>

                {/* Capacity Fill */}
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#6E737B] uppercase font-bold flex items-center gap-1">
                    <Truck className="w-2.5 h-2.5 text-[#34785D]" /> Load
                  </span>
                  <span className="text-[12px] font-black text-[#34785D] font-mono">
                    {truck.payloadPercent}%
                  </span>
                </div>

                {/* Speed / Temp */}
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#6E737B] uppercase font-bold flex items-center gap-1">
                    <Gauge className="w-2.5 h-2.5 text-[#6E737B]" /> Speed
                  </span>
                  <span className="text-[12px] font-black text-[#1C1E21] font-mono">
                    {truck.speedMph} <span className="text-[9px] font-normal text-[#6E737B]">mph</span>
                  </span>
                </div>
              </div>

              {/* Compatibility Tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                {truck.compatibilityTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded bg-[#FFFFFF] border border-[#E1E6E2] text-[9px] text-[#6E737B] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
