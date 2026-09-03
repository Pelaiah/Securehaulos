'use client';

import React from 'react';
import {
  Search,
  Download,
  SlidersHorizontal,
  Wifi,
  Zap,
  Clock,
  Gauge,
} from 'lucide-react';

interface ShipperKPIHeaderProps {
  activeVehicles?: { current: number; total: number };
  onTimeRate?: number;
  avgDelayMin?: number;
  fuelEfficiency?: number;
}

export function ShipperKPIHeader({
  activeVehicles = { current: 128, total: 156 },
  onTimeRate = 94,
  avgDelayMin = 6.2,
  fuelEfficiency = 2.8,
}: ShipperKPIHeaderProps) {
  const kpis = [
    {
      id: 'vehicles',
      icon: Wifi,
      label: 'Now Active',
      value: `${activeVehicles.current}`,
      sub: `/ ${activeVehicles.total} fleet`,
      color: 'text-[#10B981]',
    },
    {
      id: 'ontime',
      icon: Gauge,
      label: 'On-Time Delivery',
      value: `${onTimeRate}%`,
      sub: 'last 30 days',
      color: 'text-[#10B981]',
    },
    {
      id: 'delay',
      icon: Clock,
      label: 'Avg Route Delay',
      value: `${avgDelayMin}`,
      sub: 'minutes avg',
      color: 'text-[#D97757]',
    },
    {
      id: 'fuel',
      icon: Zap,
      label: 'Fuel / Energy',
      value: `${fuelEfficiency}`,
      sub: 'kWh/km avg',
      color: 'text-[#64748B]',
    },
  ];

  return (
    <header className="w-full flex items-center justify-between px-6 py-3 bg-white border-b border-[#E5E7EB] shrink-0">
      {/* Brand mark */}
      <div className="flex items-center gap-2.5 min-w-[140px]">
        <div className="w-7 h-7 rounded-lg bg-[#0B0B0B] flex items-center justify-center">
          <span className="text-white text-[11px] font-black tracking-tight">FT</span>
        </div>
        <span className="text-[15px] font-bold text-[#0B0B0B] tracking-tight">Fleetory</span>
        <span className="ml-1 px-1.5 py-0.5 rounded-md bg-[#F4F4F6] text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
          Shipper
        </span>
      </div>

      {/* Live KPI telemetry bar */}
      <div className="flex items-center gap-1 flex-1 justify-center max-w-2xl">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <React.Fragment key={kpi.id}>
              {i > 0 && (
                <div className="w-px h-8 bg-[#E5E7EB] mx-1" />
              )}
              <div className="flex flex-col items-center px-4 py-1 min-w-[110px]">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon className={`w-3 h-3 ${kpi.color}`} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                    {kpi.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-[22px] font-bold leading-none tracking-tight ${kpi.color}`}>
                    {kpi.value}
                  </span>
                  <span className="text-[11px] text-[#64748B]">{kpi.sub}</span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Utility actions */}
      <div className="flex items-center gap-1 min-w-[140px] justify-end">
        {[
          { icon: Search, label: 'Search', id: 'search' },
          { icon: Download, label: 'Export', id: 'export' },
          { icon: SlidersHorizontal, label: 'Filters', id: 'filters' },
        ].map(({ icon: Icon, label, id }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#64748B] hover:bg-[#F4F4F6] hover:text-[#0B0B0B] transition-colors active:scale-95"
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
    </header>
  );
}
