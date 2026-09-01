'use client';

import React, { useState } from 'react';
import {
  Truck,
  Fuel,
  Activity,
  Gauge,
  Disc,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Thermometer,
  ShieldCheck,
  ChevronRight,
  BatteryCharging,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VehicleHealth } from './types';
import { cn } from '@/lib/utils';

interface DriverVehicleStatusProps {
  vehicle: VehicleHealth;
  onReportIssue: () => void;
}

export function DriverVehicleStatus({ vehicle, onReportIssue }: DriverVehicleStatusProps) {
  const [isPreTripDone, setIsPreTripDone] = useState(true);

  return (
    <div className="flex flex-col gap-4 pb-28 pt-2 px-3 sm:px-4 max-w-lg mx-auto w-full text-slate-100 font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B00]">
            Telematics & Fleet Health
          </span>
          <h1 className="text-xl font-black text-white">Vehicle Status</h1>
        </div>
        <Badge className="bg-emerald-500/15 border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          ELD Synchronized
        </Badge>
      </div>

      {/* ── REALISTIC SEMI-TRUCK SILHOUETTE CARD ── */}
      <div className="rounded-3xl bg-gradient-to-b from-[#1C2133] to-[#111420] border border-white/[0.1] p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-base font-extrabold text-white">{vehicle.truckNumber}</h2>
            <p className="text-xs text-slate-400 font-mono">{vehicle.model}</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-300">
            {vehicle.odometerMiles.toLocaleString()} mi
          </span>
        </div>

        {/* Semi Truck Illustration SVG */}
        <div className="relative py-4 flex items-center justify-center">
          <svg viewBox="0 0 320 120" className="w-full max-w-[280px] h-28" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="truckGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6B00" />
                <stop offset="100%" stopColor="#FFAA00" />
              </linearGradient>
            </defs>
            {/* Trailer Body */}
            <rect x="20" y="25" width="170" height="60" rx="8" fill="#181D2C" stroke="#2D364F" strokeWidth="2" />
            <text x="105" y="60" fill="#4B556D" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="2">
              53 FT REEFER
            </text>

            {/* Cab Section */}
            <path d="M190 35 L240 35 L265 65 L275 65 L280 85 L190 85 Z" fill="#1E2538" stroke="#394463" strokeWidth="2" />
            {/* Windshield */}
            <path d="M236 40 L260 63 L236 63 Z" fill="#FF6B00" opacity="0.3" />

            {/* Wheels & Tires */}
            <circle cx="50" cy="88" r="14" fill="#0C0E14" stroke="#FF6B00" strokeWidth="2" />
            <circle cx="80" cy="88" r="14" fill="#0C0E14" stroke="#FF6B00" strokeWidth="2" />
            <circle cx="215" cy="88" r="14" fill="#0C0E14" stroke="#10B981" strokeWidth="2" />
            <circle cx="260" cy="88" r="14" fill="#0C0E14" stroke="#10B981" strokeWidth="2" />

            {/* Wheel Hubs */}
            <circle cx="50" cy="88" r="5" fill="#475569" />
            <circle cx="80" cy="88" r="5" fill="#475569" />
            <circle cx="215" cy="88" r="5" fill="#475569" />
            <circle cx="260" cy="88" r="5" fill="#475569" />
          </svg>
        </div>

        {/* Quick Range & Service */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Diesel Range</span>
            <p className="text-sm font-bold text-white font-mono">{vehicle.rangeMiles} Miles Remaining</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-400">Next Service</span>
            <p className="text-xs font-bold text-emerald-400 font-mono">{vehicle.nextServiceDue}</p>
          </div>
        </div>
      </div>

      {/* ── TELEMATICS METRICS GRID ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {/* Fuel Level */}
        <div className="p-3.5 rounded-2xl bg-[#141722] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <Fuel className="w-4 h-4 text-[#FF6B00]" />
            <span className="text-[10px] font-bold text-emerald-400">Good</span>
          </div>
          <p className="text-xs text-slate-400">Fuel Level</p>
          <p className="text-lg font-black text-white font-mono">{vehicle.fuelPercent}%</p>
        </div>

        {/* Engine Diagnostics */}
        <div className="p-3.5 rounded-2xl bg-[#141722] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400">100% OK</span>
          </div>
          <p className="text-xs text-slate-400">Engine Health</p>
          <p className="text-lg font-black text-white font-mono">Good</p>
        </div>

        {/* Tire Pressure PSI */}
        <div className="p-3.5 rounded-2xl bg-[#141722] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <Disc className="w-4 h-4 text-sky-400" />
            <span className="text-[10px] font-bold text-emerald-400">All 18 OK</span>
          </div>
          <p className="text-xs text-slate-400">Tire Pressure</p>
          <p className="text-lg font-black text-white font-mono">{vehicle.tirePressurePsi.steerLeft} PSI</p>
        </div>

        {/* Battery Voltage */}
        <div className="p-3.5 rounded-2xl bg-[#141722] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <BatteryCharging className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-bold text-emerald-400">Optimal</span>
          </div>
          <p className="text-xs text-slate-400">Alternator/Battery</p>
          <p className="text-lg font-black text-white font-mono">{vehicle.batteryVoltage} V</p>
        </div>

        {/* Oil Life */}
        <div className="p-3.5 rounded-2xl bg-[#141722] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400">Good</span>
          </div>
          <p className="text-xs text-slate-400">Oil Life</p>
          <p className="text-lg font-black text-white font-mono">{vehicle.oilLifePercent}%</p>
        </div>

        {/* Reefer Temperature */}
        <div className="p-3.5 rounded-2xl bg-[#141722] border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <Thermometer className="w-4 h-4 text-sky-400" />
            <span className="text-[10px] font-bold text-sky-400">Frozen</span>
          </div>
          <p className="text-xs text-slate-400">Reefer Unit</p>
          <p className="text-lg font-black text-sky-300 font-mono">{vehicle.reeferTempF}°F</p>
        </div>
      </div>

      {/* ── PRE-TRIP INSPECTION STATUS ── */}
      <div className="p-4 rounded-3xl bg-[#141722] border border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Daily DVIR Inspection</h4>
            <p className="text-[11px] text-slate-400">Completed today at 06:15 AM · Passed</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl bg-[#1C2132] hover:bg-[#252C42] border-white/10 text-xs font-semibold text-slate-200"
        >
          View DVIR
        </Button>
      </div>

      {/* Report Vehicle Issue Button */}
      <Button
        type="button"
        onClick={onReportIssue}
        className="w-full h-13 rounded-2xl bg-[#1F2435] hover:bg-[#2A3147] border border-white/10 text-amber-300 font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <Wrench className="w-4 h-4 text-amber-400" />
        REPORT VEHICLE OR TRAILER ISSUE
      </Button>
    </div>
  );
}
