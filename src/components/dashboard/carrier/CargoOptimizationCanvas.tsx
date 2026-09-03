'use client';

import React, { useState } from 'react';
import {
  Boxes,
  Maximize2,
  Minimize2,
  Layers,
  Sparkles,
  ShieldAlert,
  Scale,
  RotateCcw,
  CheckCircle2,
  Info,
  Sliders,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PermittedBoxItem } from './PermittedBoxesSidebar';

export interface CargoSlot {
  slotId: string;
  row: number; // 0 (bottom/front) to 3 (top/rear)
  col: number; // 0 to 7
  isLoaded: boolean;
  box?: PermittedBoxItem | null;
}

interface CargoOptimizationCanvasProps {
  truckName?: string;
  truckPlate?: string;
  maxWeightLbs?: number;
  allocatedBoxes?: PermittedBoxItem[];
  onToggleBox?: (box: PermittedBoxItem) => void;
  onClearManifest?: () => void;
}

export function CargoOptimizationCanvas({
  truckName = 'Actros Edition 2',
  truckPlate = 'ADL4681',
  maxWeightLbs = 45000,
  allocatedBoxes = [],
  onToggleBox,
  onClearManifest,
}: CargoOptimizationCanvasProps) {
  const [viewMode, setViewMode] = useState<'cutaway' | 'topdown' | 'weight'>('cutaway');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Calculate payload calculations
  const totalAllocatedWeight = allocatedBoxes.reduce((sum, b) => sum + b.weightLbs, 0);
  const totalVolumeCuFt = allocatedBoxes.reduce((sum, b) => sum + (b.lengthCm * b.widthCm * b.heightCm) / 28316.8, 0);
  const maxVolumeCuFt = 3900; // standard 53ft trailer ~3,900 cu ft
  const spaceUsedPercent = Math.min(100, Math.round((totalVolumeCuFt / maxVolumeCuFt) * 100));
  const availableSpacePercent = 100 - spaceUsedPercent;
  const weightUsedPercent = Math.min(100, Math.round((totalAllocatedWeight / maxWeightLbs) * 100));

  // 24 grid slots (3 tiers vertical x 8 bays longitudinal)
  const totalSlots = 24;
  const filledSlots = Math.min(totalSlots, allocatedBoxes.length);

  return (
    <div className="flex-1 flex flex-col bg-[#F7F8F6] text-[#1C1E21] p-5 overflow-y-auto select-none relative">
      {/* ── TOP BANNER: FREIGHT SPACE OPTIMIZER METRICS ── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-[0_4px_20px_-2px_rgba(28,30,33,0.04)]">
        {/* Left: Trailer & Driver Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#34785D] to-[#2C644E] flex items-center justify-center text-white shadow-sm">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-black text-[#1C1E21]">{truckName}</h2>
              <span className="px-2 py-0.5 rounded bg-[#F7F8F6] border border-[#E1E6E2] text-[10px] font-mono text-[#34785D] font-bold">
                {truckPlate}
              </span>
            </div>
            <p className="text-[11px] text-[#6E737B]">
              AI Volumetric Packing Engine · 53ft High-Cube Reefer
            </p>
          </div>
        </div>

        {/* Center: Available Space Gauge Bar */}
        <div className="flex-1 max-w-md w-full space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#6E737B] font-semibold uppercase tracking-wider text-[10px]">
              Available Freight Space
            </span>
            <span className="font-mono font-black text-[14px] text-[#34785D]">
              {availableSpacePercent}% Free{' '}
              <span className="text-[10px] text-[#6E737B]">({spaceUsedPercent}% Loaded)</span>
            </span>
          </div>

          <div className="h-2.5 w-full bg-[#E8F4EE] rounded-full overflow-hidden flex border border-[#E1E6E2]">
            <div
              className="h-full bg-[#34785D] transition-all duration-500 rounded-full"
              style={{ width: `${spaceUsedPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] text-[#6E737B] font-mono">
            <span>{totalVolumeCuFt.toFixed(0)} / {maxVolumeCuFt} cu.ft</span>
            <span>{totalAllocatedWeight.toLocaleString()} / {maxWeightLbs.toLocaleString()} lbs ({weightUsedPercent}%)</span>
          </div>
        </div>

        {/* Right: View Toggle Controls */}
        <div className="flex items-center gap-1.5 self-end lg:self-auto">
          <div className="flex items-center p-1 rounded-xl bg-[#F7F8F6] border border-[#E1E6E2]">
            <button
              type="button"
              onClick={() => setViewMode('cutaway')}
              className={cn(
                'px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1',
                viewMode === 'cutaway' ? 'bg-[#34785D] text-white shadow-sm' : 'text-[#6E737B] hover:text-[#1C1E21]'
              )}
            >
              <Eye className="w-3 h-3" /> Cutaway
            </button>
            <button
              type="button"
              onClick={() => setViewMode('topdown')}
              className={cn(
                'px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1',
                viewMode === 'topdown' ? 'bg-[#34785D] text-white shadow-sm' : 'text-[#6E737B] hover:text-[#1C1E21]'
              )}
            >
              <Layers className="w-3 h-3" /> Top-Down
            </button>
            <button
              type="button"
              onClick={() => setViewMode('weight')}
              className={cn(
                'px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1',
                viewMode === 'weight' ? 'bg-[#34785D] text-white shadow-sm' : 'text-[#6E737B] hover:text-[#1C1E21]'
              )}
            >
              <Scale className="w-3 h-3" /> Axle Load
            </button>
          </div>
        </div>
      </div>

      {/* ── CENTRAL INTERACTIVE TRAILER CUTAWAY CANVAS ── */}
      <div className="my-5 flex-1 min-h-[360px] rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] p-6 flex flex-col items-center justify-center relative shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Ambient Grid Backdrop */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(221,236,228,0.5) 0%, transparent 70%), linear-gradient(to right, rgba(225,230,226,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(225,230,226,0.6) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 30px 30px, 30px 30px',
          }}
        />

        {/* Algorithm Advisory Badge */}
        <div className="absolute top-4 left-5 flex items-center gap-2 z-10">
          <div className="px-2.5 py-1 rounded-lg bg-[#E8F4EE] border border-[#34785D]/20 text-[#34785D] text-[10px] font-bold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Optimal Stacking: Heavy Floor Density Applied</span>
          </div>
        </div>

        {/* Center of Gravity Crosshair */}
        <div className="absolute top-4 right-5 flex items-center gap-2 text-[10px] font-mono text-[#6E737B] z-10">
          <Scale className="w-3.5 h-3.5 text-[#34785D]" />
          <span>COG: +2.1% Rear Bias (Safe Range)</span>
        </div>

        {/* ── HIGH-FIDELITY SEMI-TRAILER CUTAWAY SVG & SLOTS ── */}
        <div className="relative w-full max-w-4xl py-4">
          <svg viewBox="0 0 900 320" className="w-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="trailerMetal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#F7F8F6" />
                <stop offset="100%" stopColor="#E8F4EE" />
              </linearGradient>

              <pattern id="cargoGridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="none" stroke="rgba(52,120,93,0.06)" strokeWidth="1" />
              </pattern>
            </defs>

            {/* ── TRAILER EXTERIOR SHELL ── */}
            <rect x="40" y="40" width="700" height="200" rx="12" fill="url(#trailerMetal)" stroke="#E1E6E2" strokeWidth="2.5" />
            <rect x="42" y="42" width="696" height="196" rx="10" fill="url(#cargoGridPattern)" />

            {/* Reefer Unit on Front (Left) */}
            <rect x="18" y="60" width="24" height="100" rx="4" fill="#E8F4EE" stroke="#E1E6E2" strokeWidth="2" />
            <line x1="24" y1="80" x2="36" y2="80" stroke="#34785D" strokeWidth="2" />
            <line x1="24" y1="95" x2="36" y2="95" stroke="#34785D" strokeWidth="2" />
            <line x1="24" y1="110" x2="36" y2="110" stroke="#34785D" strokeWidth="2" />

            {/* Interior Zone Dividers (Bays 1-8) */}
            {[125, 210, 295, 380, 465, 550, 635].map((x) => (
              <line key={x} x1={x} y1="42" x2={x} y2="238" stroke="#E1E6E2" strokeDasharray="4 4" />
            ))}

            {/* Interior Tier Shelves (Tiers 1-3) */}
            <line x1="42" y1="106" x2="738" y2="106" stroke="#E1E6E2" strokeDasharray="4 4" />
            <line x1="42" y1="172" x2="738" y2="172" stroke="#E1E6E2" strokeDasharray="4 4" />

            {/* Rear Cargo Door Area (Right) */}
            <rect x="735" y="46" width="8" height="188" fill="#34785D" opacity="0.8" rx="2" />

            {/* ── CAB OUTLINE (Right side pulling) ── */}
            <path
              d="M 750,110 L 800,110 L 840,150 L 860,170 L 860,240 L 750,240 Z"
              fill="#F7F8F6"
              stroke="#E1E6E2"
              strokeWidth="2"
            />
            <path d="M 800,115 L 835,150 L 835,185 L 800,185 Z" fill="#DDECE4" opacity="0.8" />

            {/* ── WHEELSETS / AXLES ── */}
            {/* Front Landing Gear */}
            <rect x="180" y="240" width="12" height="30" fill="#CBD5E1" rx="2" />
            <rect x="175" y="270" width="22" height="6" fill="#94A3B8" rx="2" />

            {/* Rear Tandem Axles (Left side trailer) */}
            {[100, 150].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy="255" r="24" fill="#FFFFFF" stroke="#E1E6E2" strokeWidth="4" />
                <circle cx={cx} cy="255" r="14" fill="#E8F4EE" />
                <circle cx={cx} cy="255" r="5" fill="#34785D" />
              </g>
            ))}

            {/* Cab Axles */}
            {[780, 835].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy="255" r="24" fill="#FFFFFF" stroke="#E1E6E2" strokeWidth="4" />
                <circle cx={cx} cy="255" r="14" fill="#E8F4EE" />
                <circle cx={cx} cy="255" r="5" fill="#34785D" />
              </g>
            ))}

            {/* Under-chassis glow */}
            <ellipse cx="400" cy="275" rx="350" ry="8" fill="#34785D" opacity="0.06" />
          </svg>

          {/* ── INTERACTIVE CARGO SLOT MATRIX OVERLAY ── */}
          <div
            className="absolute top-[38px] left-[42px] w-[696px] h-[196px] grid grid-rows-3 grid-cols-8 gap-1.5 p-2"
            style={{ width: 'calc(100% * 696 / 900)', left: 'calc(100% * 42 / 900)', height: 'calc(100% * 196 / 320)', top: 'calc(100% * 40 / 320)' }}
          >
            {Array.from({ length: 24 }).map((_, idx) => {
              const row = Math.floor(idx / 8);
              const col = idx % 8;
              const box = allocatedBoxes[idx];
              const isFilled = !!box;
              const isSelected = selectedSlot === `slot-${idx}`;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedSlot(`slot-${idx}`)}
                  className={cn(
                    'relative rounded-lg border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center p-1',
                    isFilled
                      ? 'bg-[#E8F4EE] border-[#34785D]/60 shadow-sm hover:border-[#34785D]'
                      : 'bg-[#F7F8F6]/80 border-[#E1E6E2] hover:bg-[#E8F4EE]/40 hover:border-[#34785D]/30',
                    isSelected && 'ring-2 ring-[#34785D] scale-105 z-20'
                  )}
                >
                  {isFilled ? (
                    <>
                      <div className="flex items-center gap-1">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: box.color || '#34785D' }}
                        />
                        <span className="text-[9px] font-black text-[#1C1E21] truncate max-w-[55px]">
                          {box.id.slice(-6)}
                        </span>
                      </div>
                      <span className="text-[8px] font-mono text-[#6E737B] leading-none mt-0.5">
                        {box.weightLbs} lb
                      </span>
                    </>
                  ) : (
                    <span className="text-[8px] font-mono text-[#6E737B]/40">
                      B{col + 1}-T{3 - row}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info strip */}
        <div className="w-full flex items-center justify-between text-[11px] text-[#6E737B] pt-2 border-t border-[#E1E6E2]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#34785D]" /> Allocated / General
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#10B981]" /> Validated Cold Chain
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#3B82F6]" /> Temperature Controlled
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClearManifest}
              className="text-[11px] font-bold text-[#6E737B] hover:text-[#34785D] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
