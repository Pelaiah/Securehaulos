'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  TrendingDown,
  Navigation,
  MapPin,
  Clock,
  Gauge,
  AlertTriangle,
  Activity,
  Maximize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Map, MapMarker, MarkerContent } from '@/components/ui/map';

export function CarrierBottomAnalyticsDock() {
  const [activeTab, setActiveTab] = useState<'overview' | 'safety' | 'fuel' | 'map'>('overview');
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  // 7-day energy efficiency trend data
  const fuelTrend = [
    { day: 'Mon', kwh: 2.9, score: 96 },
    { day: 'Tue', kwh: 2.7, score: 98 },
    { day: 'Wed', kwh: 3.1, score: 94 },
    { day: 'Thu', kwh: 2.8, score: 97 },
    { day: 'Fri', kwh: 2.6, score: 99 },
    { day: 'Sat', kwh: 2.8, score: 98 },
    { day: 'Sun', kwh: 2.7, score: 98 },
  ];

  return (
    <div className="w-full bg-[#FFFFFF] border-t border-[#E1E6E2] p-4 shrink-0 text-[#1C1E21] select-none">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ── CARD 1: SAFETY & DRIVER COMPLIANCE ── */}
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-[0_4px_20px_-2px_rgba(28,30,33,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E8F4EE] flex items-center justify-center text-[#34785D]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6E737B]">Compliance Score</span>
                <h4 className="text-[13px] font-black text-[#1C1E21]">Safety & HOS Telematics</h4>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-[#E8F4EE] text-[#34785D] font-mono font-black text-[12px] border border-[#34785D]/20">
              98.4 / 100
            </span>
          </div>

          {/* Safety Sub-metrics */}
          <div className="grid grid-cols-3 gap-2 my-3">
            <div className="p-2 rounded-xl bg-[#F7F8F6] border border-[#E1E6E2] flex flex-col">
              <span className="text-[9px] text-[#6E737B] uppercase font-bold">Hard Brake</span>
              <span className="text-[14px] font-black text-[#34785D] font-mono">0 / 24h</span>
            </div>
            <div className="p-2 rounded-xl bg-[#F7F8F6] border border-[#E1E6E2] flex flex-col">
              <span className="text-[9px] text-[#6E737B] uppercase font-bold">Seatbelt Tele</span>
              <span className="text-[14px] font-black text-[#1C1E21] font-mono">100%</span>
            </div>
            <div className="p-2 rounded-xl bg-[#F7F8F6] border border-[#E1E6E2] flex flex-col">
              <span className="text-[9px] text-[#6E737B] uppercase font-bold">HOS Left</span>
              <span className="text-[14px] font-black text-[#34785D] font-mono">6h 42m</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#6E737B] pt-2 border-t border-[#E1E6E2]">
            <span className="flex items-center gap-1 text-[#34785D]">
              <ShieldCheck className="w-3 h-3" /> FMCSA Tier-1 Certified
            </span>
            <span>0 Violations (30d)</span>
          </div>
        </div>

        {/* ── CARD 2: FUEL & ENERGY EFFICIENCY ── */}
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-[0_4px_20px_-2px_rgba(28,30,33,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E8F4EE] flex items-center justify-center text-[#34785D]">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6E737B]">Fleet Efficiency</span>
                <h4 className="text-[13px] font-black text-[#1C1E21]">Fuel & Energy Trend</h4>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[14px] font-black text-[#34785D] font-mono leading-none">
                2.78 <span className="text-[10px] font-normal text-[#6E737B]">kWh/km</span>
              </span>
            </div>
          </div>

          {/* SVG Mini Bar / Sparkline */}
          <div className="my-2 h-14 flex items-end justify-between gap-1 px-1">
            {fuelTrend.map((item) => {
              const heightPct = ((item.kwh - 2.0) / 1.5) * 100;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-[#34785D] transition-all hover:bg-[#2C644E]"
                    style={{ height: `${Math.max(15, heightPct)}%` }}
                  />
                  <span className="text-[9px] text-[#6E737B] font-mono">{item.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#6E737B] pt-2 border-t border-[#E1E6E2]">
            <span className="flex items-center gap-1 text-[#34785D]">
              <TrendingDown className="w-3 h-3" /> −6.4% vs last week
            </span>
            <span>$4,120 Regenerative Saved</span>
          </div>
        </div>

        {/* ── CARD 3: LIVE ROUTE VECTOR MAP TILE ── */}
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-[0_4px_20px_-2px_rgba(28,30,33,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E8F4EE] flex items-center justify-center text-[#34785D]">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6E737B]">Live Dispatch Radar</span>
                <h4 className="text-[13px] font-black text-[#1C1E21]">Corridor Tracking</h4>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-[#E8F4EE] text-[#34785D] text-[10px] font-bold border border-[#34785D]/20">
              I-10 East Bound
            </span>
          </div>

          {/* Map Preview */}
          <div className="relative h-20 rounded-xl overflow-hidden border border-[#E1E6E2]">
            <Map
              theme="light"
              center={[-116.5, 34.5]}
              zoom={4}
              interactive={false}
              className="w-full h-full"
            >
              <MapMarker longitude={-118.2437} latitude={34.0522}>
                <MarkerContent>
                  <div className="w-2.5 h-2.5 bg-[#34785D] rounded-full border-2 border-white shadow-sm" />
                </MarkerContent>
              </MapMarker>
              <MapMarker longitude={-112.0740} latitude={33.4484}>
                <MarkerContent>
                  <div className="w-2.5 h-2.5 bg-[#6E737B] rounded-full border-2 border-white shadow-sm" />
                </MarkerContent>
              </MapMarker>
              {/* Active truck position */}
              <MapMarker longitude={-115.5514} latitude={32.7254}>
                <MarkerContent>
                  <div className="w-3 h-3 bg-[#34785D] rounded-full border-2 border-white shadow-md animate-pulse" />
                </MarkerContent>
              </MapMarker>
            </Map>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#6E737B] pt-2 border-t border-[#E1E6E2] mt-2">
            <span className="flex items-center gap-1 text-[#1C1E21]">
              <MapPin className="w-3 h-3 text-[#34785D]" /> Barstow → Phoenix (ETA 2h 18m)
            </span>
            <span className="text-[#34785D] font-bold">Normal Flow</span>
          </div>
        </div>
      </div>
    </div>
  );
}
