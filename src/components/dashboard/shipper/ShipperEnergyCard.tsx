'use client';

import React from 'react';
import { Zap, DollarSign, BatteryCharging } from 'lucide-react';

interface ShipperEnergyCardProps {
  batteryHealthPercent?: number;
  kwhPerKm?: number;
  costToday?: number;
  chargeStatus?: 'Charging' | 'On-Route' | 'Idle';
}

export function ShipperEnergyCard({
  batteryHealthPercent = 78,
  kwhPerKm = 2.8,
  costToday = 142.5,
  chargeStatus = 'On-Route',
}: ShipperEnergyCardProps) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (batteryHealthPercent / 100) * circumference;

  const statusColor =
    chargeStatus === 'Charging'
      ? '#10B981'
      : chargeStatus === 'On-Route'
      ? '#D97757'
      : '#64748B';

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
            Energy Usage & Cost
          </p>
          <h3 className="text-[13px] font-bold text-[#0B0B0B] mt-0.5">ADL4681 — Today</h3>
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg"
          style={{ backgroundColor: `${statusColor}18`, color: statusColor }}
        >
          {chargeStatus}
        </span>
      </div>

      {/* Ring Gauge + Metrics */}
      <div className="flex items-center gap-4">
        {/* SVG Arc Battery Health */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="#F4F4F6"
              strokeWidth="7"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke={statusColor}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[15px] font-black text-[#0B0B0B] leading-none">
              {batteryHealthPercent}%
            </span>
            <span className="text-[9px] text-[#64748B] font-semibold">Health</span>
          </div>
        </div>

        {/* Right stats */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#F4F4F6]">
            <div className="flex items-center gap-1.5 text-[#64748B]">
              <Zap className="w-3.5 h-3.5 text-[#D97757]" />
              <span className="text-[11px] font-semibold">kWh / km</span>
            </div>
            <span className="text-[13px] font-black text-[#0B0B0B]">{kwhPerKm}</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#F4F4F6]">
            <div className="flex items-center gap-1.5 text-[#64748B]">
              <DollarSign className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-[11px] font-semibold">Cost Today</span>
            </div>
            <span className="text-[13px] font-black text-[#0B0B0B]">${costToday}</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#F4F4F6]">
            <div className="flex items-center gap-1.5 text-[#64748B]">
              <BatteryCharging className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="text-[11px] font-semibold">Range Left</span>
            </div>
            <span className="text-[13px] font-black text-[#0B0B0B]">312 km</span>
          </div>
        </div>
      </div>
    </div>
  );
}
