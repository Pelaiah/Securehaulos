'use client';

import React from 'react';
import { LayoutDashboard, Map, Route, Settings2, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShipperBottomDockProps {
  activeMode?: string;
  onModeChange?: (mode: string) => void;
}

const DOCK_ITEMS = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
  { id: 'map', icon: Map, label: 'Fleet Map' },
  { id: 'routes', icon: Route, label: 'Routes' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'settings', icon: Settings2, label: 'Settings' },
];

export function ShipperBottomDock({
  activeMode = 'overview',
  onModeChange,
}: ShipperBottomDockProps) {
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <nav
        aria-label="Shipper View Mode Dock"
        className="pointer-events-auto flex items-center gap-1 px-3 py-2 rounded-full bg-[#0B0B0B]/95 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
      >
        {DOCK_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeMode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onModeChange?.(item.id)}
              aria-label={item.label}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95',
                isActive
                  ? 'bg-[#D97757] text-white shadow-md'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon className="w-4 h-4" />
              {isActive && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
