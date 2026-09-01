'use client';

import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  Calendar,
  ArrowRight,
  Truck,
  DollarSign,
  CheckCircle2,
  Clock,
  Sparkles,
  Navigation,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DriverTrip } from './types';
import { cn } from '@/lib/utils';

interface DriverMyLoadsProps {
  activeTrip: DriverTrip;
  upcomingLoads: DriverTrip[];
  completedLoads: DriverTrip[];
  onSelectActiveTrip: () => void;
  onStartUpcomingTrip?: (trip: DriverTrip) => void;
}

type LoadSegmentTab = 'active' | 'upcoming' | 'completed';

export function DriverMyLoads({
  activeTrip,
  upcomingLoads,
  completedLoads,
  onSelectActiveTrip,
  onStartUpcomingTrip,
}: DriverMyLoadsProps) {
  const [activeTab, setActiveTab] = useState<LoadSegmentTab>('active');

  return (
    <div className="flex flex-col gap-4 pb-28 pt-2 px-3 sm:px-4 max-w-lg mx-auto w-full text-slate-100 font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B00]">
            Freight Management
          </span>
          <h1 className="text-xl font-black text-white">My Loads</h1>
        </div>
        <Badge variant="outline" className="bg-[#181B26] border-white/10 text-slate-300 font-mono">
          {1 + upcomingLoads.length + completedLoads.length} Assigned
        </Badge>
      </div>

      {/* Segmented Tabs */}
      <div className="p-1 rounded-2xl bg-[#141722] border border-white/[0.08] flex items-center shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={cn(
            'flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5',
            activeTab === 'active'
              ? 'bg-[#FF6B00] text-white shadow-[0_4px_16px_rgba(255,107,0,0.4)]'
              : 'text-slate-400 hover:text-white'
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Active (1)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={cn(
            'flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5',
            activeTab === 'upcoming'
              ? 'bg-[#1F2435] text-white border border-white/10 shadow-sm'
              : 'text-slate-400 hover:text-white'
          )}
        >
          Upcoming ({upcomingLoads.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={cn(
            'flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5',
            activeTab === 'completed'
              ? 'bg-emerald-600/90 text-white shadow-[0_4px_16px_rgba(16,185,129,0.3)]'
              : 'text-slate-400 hover:text-white'
          )}
        >
          Completed ({completedLoads.length})
        </button>
      </div>

      {/* ── ACTIVE LOAD TAB ── */}
      {activeTab === 'active' && (
        <div className="space-y-3">
          <div className="rounded-3xl bg-gradient-to-b from-[#1E2333] to-[#121520] border border-[#FF6B00]/40 p-4 sm:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.7)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-[#FF6B00]">
                  IN TRANSIT · ACTIVE
                </span>
              </div>
              <Badge className="bg-[#0E1015] border-[#FF6B00]/30 text-white font-mono text-xs">
                {activeTrip.loadNumber}
              </Badge>
            </div>

            <h3 className="text-base font-bold text-white">{activeTrip.cargoType}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeTrip.equipment} · <span className="font-mono text-slate-300">{activeTrip.weight}</span>
            </p>

            {/* Route */}
            <div className="relative pl-5 my-4 border-l border-dashed border-[#FF6B00]/40 space-y-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Pickup</p>
                <p className="text-xs font-bold text-white">{activeTrip.origin.facility}</p>
                <p className="text-[11px] text-slate-400">{activeTrip.origin.address}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Delivery</p>
                <p className="text-xs font-bold text-white">{activeTrip.destination.consignee}</p>
                <p className="text-[11px] text-slate-400">{activeTrip.destination.address}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#0C0E14] border border-white/[0.06] text-center my-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Distance</span>
                <p className="text-xs font-bold text-white font-mono">{activeTrip.metrics.totalDistanceMi} mi</p>
              </div>
              <div className="border-x border-white/10">
                <span className="text-[10px] text-slate-500 uppercase">ETA</span>
                <p className="text-xs font-bold text-[#FF6B00] font-mono">{activeTrip.metrics.eta}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Est. Payout</span>
                <p className="text-xs font-bold text-emerald-400 font-mono">${activeTrip.metrics.payout.toFixed(2)}</p>
              </div>
            </div>

            <Button
              type="button"
              onClick={onSelectActiveTrip}
              className="w-full h-12 rounded-2xl bg-[#FF6B00] hover:bg-[#FF7700] text-white font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4 fill-white" />
              OPEN LIVE TRIP CONTROLS
            </Button>
          </div>
        </div>
      )}

      {/* ── UPCOMING LOADS TAB ── */}
      {activeTab === 'upcoming' && (
        <div className="space-y-3">
          {upcomingLoads.map((load) => (
            <div
              key={load.id}
              className="rounded-3xl bg-[#141722] border border-white/[0.08] p-4 shadow-md space-y-3 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-[#1C202F] text-slate-300 font-mono text-xs border-white/10">
                  {load.loadNumber}
                </Badge>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  +${load.metrics.payout.toFixed(2)}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{load.cargoType}</h3>
                <p className="text-xs text-slate-400">{load.equipment} · {load.weight}</p>
              </div>

              <div className="p-3 rounded-2xl bg-[#0E1015] border border-white/[0.06] text-xs space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Origin</span>
                    <p className="text-white font-semibold">{load.origin.facility}</p>
                  </div>
                  <span className="text-[11px] font-mono text-[#FF6B00]">{load.origin.appointmentTime}</span>
                </div>
                <div className="flex items-start justify-between pt-1 border-t border-white/[0.06]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Destination</span>
                    <p className="text-white font-semibold">{load.destination.consignee}</p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{load.metrics.totalDistanceMi} mi</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Dock: {load.origin.dock}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl bg-[#1A1F2D] hover:bg-[#242A3D] text-white border-white/10 text-xs"
                >
                  View Route Prep
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── COMPLETED LOADS TAB ── */}
      {activeTab === 'completed' && (
        <div className="space-y-3">
          {completedLoads.map((load) => (
            <div
              key={load.id}
              className="rounded-3xl bg-[#12151E] border border-white/[0.06] p-4 shadow-sm space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-white">{load.loadNumber}</span>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[11px]">
                  Delivered
                </Badge>
              </div>

              <p className="text-xs font-bold text-slate-200">{load.cargoType}</p>
              <p className="text-[11px] text-slate-400">
                {load.origin.facility} → {load.destination.consignee}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs font-mono">
                <span className="text-slate-400">{load.metrics.totalDistanceMi} mi traveled</span>
                <span className="text-emerald-400 font-bold">+${load.metrics.payout.toFixed(2)} Paid</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
