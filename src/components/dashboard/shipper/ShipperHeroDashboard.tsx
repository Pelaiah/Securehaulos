'use client';

import React, { useState } from 'react';
import { ShipperEnergyCard } from './ShipperEnergyCard';
import { ShipperDeliveryProgressCard } from './ShipperDeliveryProgressCard';
import { ShipperCargoCapacityCard } from './ShipperCargoCapacityCard';
import { ShipperBottomDock } from './ShipperBottomDock';
import { ZoomIn, ZoomOut, Maximize2, Navigation, MapPin, Sparkles, Layers } from 'lucide-react';
import { MapCN } from '@/components/ui/MapCN';

const PAYLOAD_BUBBLES = [
  { label: 'Laptops', pct: 32, x: '28%', y: '30%', size: 64, color: '#D97757' },
  { label: 'Supplies', pct: 18, x: '52%', y: '22%', size: 52, color: '#10B981' },
  { label: 'Tablets', pct: 14, x: '38%', y: '56%', size: 46, color: '#64748B' },
  { label: 'Phones', pct: 12, x: '65%', y: '42%', size: 44, color: '#0B0B0B' },
  { label: 'Chargers', pct: 10, x: '18%', y: '58%', size: 40, color: '#D97757' },
  { label: 'Wearables', pct: 8, x: '72%', y: '62%', size: 36, color: '#10B981' },
  { label: 'Sneakers', pct: 6, x: '46%', y: '70%', size: 34, color: '#64748B' },
];

interface ShipperHeroDashboardProps {
  activeTrip?: any;
  loadsCount?: number;
}

export function ShipperHeroDashboard({ activeTrip, loadsCount = 132 }: ShipperHeroDashboardProps) {
  const [dockMode, setDockMode] = useState('overview');
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null);

  return (
    <div className="relative flex flex-col h-full bg-[#F4F4F6] overflow-hidden select-none">
      {/* ── ASYMMETRIC 3-COLUMN MAIN GRID ── */}
      <div className="flex flex-1 min-h-0 gap-0">
        {/* ── LEFT DATA COLUMN (1/4) ── */}
        <aside className="w-[280px] shrink-0 flex flex-col gap-3 p-4 overflow-y-auto border-r border-[#E5E7EB] bg-[#F4F4F6]">
          <ShipperEnergyCard />
          <ShipperDeliveryProgressCard />
          <ShipperCargoCapacityCard />
        </aside>

        {/* ── CENTRAL HERO STAGE (1/2) ── */}
        <main className="flex-1 flex flex-col items-center justify-center relative p-6 overflow-hidden bg-[#F4F4F6]">
          {/* Vehicle ID Badge */}
          <div className="absolute top-5 left-6 flex items-center gap-2 z-10">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981] animate-pulse" />
            <span className="text-[12px] font-black uppercase tracking-widest text-[#0B0B0B]">
              ADL4681 — In Transit
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#D97757]/10 text-[#D97757] text-[10px] font-bold">
              High-Cube Trailer
            </span>
          </div>

          {/* Stats strip top-right */}
          <div className="absolute top-5 right-6 flex items-center gap-4 z-10 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-[#E5E7EB] shadow-sm">
            <div className="text-right">
              <span className="text-[9px] uppercase font-bold text-[#64748B]">Speed</span>
              <p className="text-[15px] font-black text-[#0B0B0B] leading-none">68 km/h</p>
            </div>
            <div className="w-px h-6 bg-[#E5E7EB]" />
            <div className="text-right">
              <span className="text-[9px] uppercase font-bold text-[#64748B]">Reefer</span>
              <p className="text-[15px] font-black text-[#0B0B0B] leading-none font-mono">−4°C</p>
            </div>
          </div>

          {/* ── PHOTOREALISTIC TRUCK SVG ── */}
          <div className="relative w-full max-w-2xl mx-auto">
            <svg
              viewBox="0 0 720 260"
              className="w-full drop-shadow-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* ── TRAILER BODY ── */}
              <rect x="20" y="60" width="560" height="140" rx="10" fill="white" stroke="#E5E7EB" strokeWidth="2" />
              {/* Trailer roof highlight */}
              <rect x="20" y="60" width="560" height="14" rx="10" fill="#F4F4F6" />
              {/* Trailer ribs */}
              {[120, 220, 320, 420, 500].map((x) => (
                <line key={x} x1={x} y1="74" x2={x} y2="200" stroke="#E5E7EB" strokeWidth="1.5" />
              ))}
              {/* Trailer door outline */}
              <rect x="540" y="75" width="35" height="120" rx="3" fill="#F4F4F6" stroke="#E5E7EB" strokeWidth="1.5" />
              <line x1="557" y1="75" x2="557" y2="195" stroke="#E5E7EB" strokeWidth="1" />
              {/* Company name on trailer */}
              <text x="280" y="145" fill="#E5E7EB" fontSize="22" fontWeight="800" textAnchor="middle" letterSpacing="4" className="select-none">
                FLEETORY
              </text>

              {/* ── CAB ── */}
              <path d="M580 90 L620 90 L660 115 L680 130 L680 200 L580 200 Z" fill="white" stroke="#E5E7EB" strokeWidth="2" />
              {/* Windshield */}
              <path d="M620 95 L655 118 L655 155 L620 155 Z" fill="#DBEAFE" opacity="0.7" />
              {/* Cab door */}
              <rect x="582" y="130" width="34" height="60" rx="3" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1" />
              {/* Cab exhaust stacks */}
              <rect x="610" y="65" width="6" height="28" rx="2" fill="#64748B" />
              <rect x="620" y="68" width="6" height="25" rx="2" fill="#64748B" />
              {/* Cab grill */}
              <rect x="660" y="140" width="18" height="35" rx="3" fill="#0B0B0B" />
              {[145, 153, 161].map((y) => (
                <line key={y} x1="660" y1={y} x2="678" y2={y} stroke="#64748B" strokeWidth="1" />
              ))}
              {/* Headlights */}
              <rect x="661" y="132" width="15" height="6" rx="2" fill="#FEF3C7" />

              {/* ── WHEELS ── */}
              {[80, 140, 210, 550, 630, 665].map((cx) => (
                <g key={cx}>
                  <circle cx={cx} cy="210" r="22" fill="#0B0B0B" />
                  <circle cx={cx} cy="210" r="13" fill="#64748B" />
                  <circle cx={cx} cy="210" r="5" fill="#0B0B0B" />
                </g>
              ))}

              {/* ── FIFTH WHEEL / COUPLING ── */}
              <rect x="570" y="190" width="18" height="8" rx="2" fill="#64748B" />

              {/* Ground shadow */}
              <ellipse cx="350" cy="235" rx="300" ry="8" fill="black" opacity="0.07" />
            </svg>

            {/* ── PAYLOAD BUBBLES (interactive over trailer interior) ── */}
            {PAYLOAD_BUBBLES.map((b) => {
              const isSelected = selectedBubble === b.label;
              return (
                <div
                  key={b.label}
                  onClick={() => setSelectedBubble(isSelected ? null : b.label)}
                  className="absolute flex flex-col items-center justify-center rounded-full select-none cursor-pointer transition-all duration-300 backdrop-blur-sm"
                  style={{
                    left: b.x,
                    top: b.y,
                    width: b.size,
                    height: b.size,
                    backgroundColor: isSelected ? `${b.color}35` : `${b.color}18`,
                    border: `2px solid ${isSelected ? b.color : `${b.color}50`}`,
                    transform: isSelected ? 'translate(-50%, -50%) scale(1.15)' : 'translate(-50%, -50%)',
                    boxShadow: isSelected ? `0 0 20px ${b.color}40` : 'none',
                  }}
                >
                  <span className="font-black leading-none" style={{ fontSize: b.size > 50 ? 13 : 10, color: b.color }}>
                    {b.pct}%
                  </span>
                  <span className="font-semibold text-center leading-tight px-1" style={{ fontSize: b.size > 50 ? 9 : 8, color: b.color }}>
                    {b.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active payload callout */}
          {selectedBubble && (
            <div className="mt-4 px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] shadow-md flex items-center gap-2 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D97757]" />
              <span className="font-bold text-[#0B0B0B]">{selectedBubble} Category</span>
              <span className="text-[#64748B]">· Secured in Bay Tier-1 with real-time temperature telemetry</span>
            </div>
          )}
        </main>

        {/* ── RIGHT MAP PANEL (1/4) — mapcn POWERED ── */}
        <aside className="w-[300px] shrink-0 p-4 bg-[#F4F4F6] border-l border-[#E5E7EB] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Fleet Logistics
              </p>
              <h3 className="text-[13px] font-black text-[#0B0B0B]">Real-Time Vector Route</h3>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-[#10B981]">Online</span>
            </div>
          </div>

          {/* MapCN Vector Map */}
          <div className="flex-1 relative rounded-2xl overflow-hidden min-h-[340px] shadow-sm border border-[#E5E7EB]">
            <MapCN
              theme="light"
              showRadar={true}
              showTelemetryHUD={true}
              height="100%"
            />
          </div>

          {/* Bottom active vehicles pill */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {['#D97757', '#10B981', '#64748B'].map((c) => (
                  <div key={c} className="w-5 h-5 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span className="text-[12px] font-semibold text-[#0B0B0B]">
                <span className="text-[#10B981] font-black">128 Active</span> Fleet Units
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#64748B]">0 delays</span>
          </div>
        </aside>
      </div>

      {/* ── FLOATING BOTTOM DOCK ── */}
      <ShipperBottomDock activeMode={dockMode} onModeChange={setDockMode} />
    </div>
  );
}
