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
    <div className="flex flex-col gap-4 pb-28 pt-2 px-3 sm:px-4 max-w-lg mx-auto w-full text-[#1C1E21] font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#34785D]">
            Telematics & Fleet Health
          </span>
          <h1 className="text-xl font-black text-[#1C1E21]">Vehicle Status</h1>
        </div>
        <Badge className="bg-[#E8F4EE] border-[#34785D]/20 text-[#34785D] text-xs font-semibold">
          ELD Synchronized
        </Badge>
      </div>

      {/* ── REALISTIC SEMI-TRUCK SILHOUETTE CARD ── */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E1E6E2] p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-base font-extrabold text-[#1C1E21]">{vehicle.truckNumber}</h2>
            <p className="text-xs text-[#6E737B] font-mono">{vehicle.model}</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#1C1E21]">
            {vehicle.odometerMiles.toLocaleString()} mi
          </span>
        </div>

        {/* Semi Truck Illustration SVG */}
        <div className="relative py-4 flex items-center justify-center">
          <svg viewBox="0 0 320 120" className="w-full max-w-[280px] h-28" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="truckGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34785D" />
                <stop offset="100%" stopColor="#2C644E" />
              </linearGradient>
            </defs>
            {/* Trailer Body */}
            <rect x="20" y="25" width="170" height="60" rx="8" fill="#F7F8F6" stroke="#E1E6E2" strokeWidth="2" />
            <text x="105" y="60" fill="#6E737B" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="2">
              53 FT REEFER
            </text>

            {/* Cab Section */}
            <path d="M190 35 L240 35 L265 65 L275 65 L280 85 L190 85 Z" fill="#E8F4EE" stroke="#34785D" strokeWidth="2" />
            {/* Windshield */}
            <path d="M236 40 L260 63 L236 63 Z" fill="#34785D" opacity="0.3" />

            {/* Wheels & Tires */}
            <circle cx="50" cy="88" r="14" fill="#FFFFFF" stroke="#34785D" strokeWidth="3" />
            <circle cx="80" cy="88" r="14" fill="#FFFFFF" stroke="#34785D" strokeWidth="3" />
            <circle cx="215" cy="88" r="14" fill="#FFFFFF" stroke="#34785D" strokeWidth="3" />
            <circle cx="260" cy="88" r="14" fill="#FFFFFF" stroke="#34785D" strokeWidth="3" />

            {/* Wheel Hubs */}
            <circle cx="50" cy="88" r="5" fill="#34785D" />
            <circle cx="80" cy="88" r="5" fill="#34785D" />
            <circle cx="215" cy="88" r="5" fill="#34785D" />
            <circle cx="260" cy="88" r="5" fill="#34785D" />
          </svg>
        </div>

        {/* Quick Range & Service */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E1E6E2] text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#6E737B]">Diesel Range</span>
            <p className="text-sm font-bold text-[#1C1E21] font-mono">{vehicle.rangeMiles} Miles Remaining</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-[#6E737B]">Next Service</span>
            <p className="text-xs font-bold text-[#34785D] font-mono">{vehicle.nextServiceDue}</p>
          </div>
        </div>
      </div>

      {/* ── TELEMATICS METRICS GRID ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {/* Fuel Level */}
        <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#6E737B]">
            <Fuel className="w-4 h-4 text-[#34785D]" />
            <span className="text-[10px] font-bold text-[#34785D]">Good</span>
          </div>
          <p className="text-xs text-[#6E737B]">Fuel Level</p>
          <p className="text-lg font-black text-[#1C1E21] font-mono">{vehicle.fuelPercent}%</p>
        </div>

        {/* Engine Diagnostics */}
        <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#6E737B]">
            <Activity className="w-4 h-4 text-[#34785D]" />
            <span className="text-[10px] font-bold text-[#34785D]">100% OK</span>
          </div>
          <p className="text-xs text-[#6E737B]">Engine Health</p>
          <p className="text-lg font-black text-[#1C1E21] font-mono">Good</p>
        </div>

        {/* Tire Pressure PSI */}
        <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#6E737B]">
            <Disc className="w-4 h-4 text-[#34785D]" />
            <span className="text-[10px] font-bold text-[#34785D]">All 18 OK</span>
          </div>
          <p className="text-xs text-[#6E737B]">Tire Pressure</p>
          <p className="text-lg font-black text-[#1C1E21] font-mono">{vehicle.tirePressurePsi.steerLeft} PSI</p>
        </div>

        {/* Battery Voltage */}
        <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#6E737B]">
            <BatteryCharging className="w-4 h-4 text-[#34785D]" />
            <span className="text-[10px] font-bold text-[#34785D]">Optimal</span>
          </div>
          <p className="text-xs text-[#6E737B]">Alternator/Battery</p>
          <p className="text-lg font-black text-[#1C1E21] font-mono">{vehicle.batteryVoltage} V</p>
        </div>

        {/* Oil Life */}
        <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#6E737B]">
            <Gauge className="w-4 h-4 text-[#34785D]" />
            <span className="text-[10px] font-bold text-[#34785D]">Good</span>
          </div>
          <p className="text-xs text-[#6E737B]">Oil Life</p>
          <p className="text-lg font-black text-[#1C1E21] font-mono">{vehicle.oilLifePercent}%</p>
        </div>

        {/* Reefer Temperature */}
        <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#6E737B]">
            <Thermometer className="w-4 h-4 text-[#34785D]" />
            <span className="text-[10px] font-bold text-[#34785D]">Frozen</span>
          </div>
          <p className="text-xs text-[#6E737B]">Reefer Unit</p>
          <p className="text-lg font-black text-[#34785D] font-mono">{vehicle.reeferTempF}°F</p>
        </div>
      </div>

      {/* ── PRE-TRIP INSPECTION STATUS ── */}
      <div className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#E8F4EE] text-[#34785D] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1C1E21]">Daily DVIR Inspection</h4>
            <p className="text-[11px] text-[#6E737B]">Completed today at 06:15 AM · Passed</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl bg-[#F7F8F6] hover:bg-[#E8F4EE] hover:text-[#34785D] border border-[#E1E6E2] text-xs font-semibold text-[#1C1E21]"
        >
          View DVIR
        </Button>
      </div>

      {/* Report Vehicle Issue Button */}
      <Button
        type="button"
        onClick={onReportIssue}
        className="w-full h-12 rounded-2xl bg-[#F7F8F6] hover:bg-[#E8F4EE] border border-[#E1E6E2] text-[#1C1E21] hover:text-[#34785D] font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <Wrench className="w-4 h-4 text-[#34785D]" />
        REPORT VEHICLE OR TRAILER ISSUE
      </Button>
    </div>
  );
}
