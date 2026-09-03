'use client';

import React, { useState } from 'react';
import {
  Package,
  Plus,
  Check,
  DollarSign,
  Layers,
  Scale,
  Thermometer,
  ShieldAlert,
  Search,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PermittedBoxItem {
  id: string;
  code: string;
  category: 'Electronics' | 'Medical' | 'Hazardous' | 'Industrial' | 'ColdChain';
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightLbs: number;
  priceUsd: number;
  origin: string;
  destination: string;
  isAllocated: boolean;
  color: string;
  specialHandling?: string;
}

export const DEFAULT_PERMITTED_BOXES: PermittedBoxItem[] = [
  {
    id: 'box-01',
    code: 'BOX-#1123-01-25',
    category: 'Electronics',
    lengthCm: 240,
    widthCm: 120,
    heightCm: 100,
    weightLbs: 1760,
    priceUsd: 840,
    origin: 'Long Beach, CA',
    destination: 'Phoenix, AZ',
    isAllocated: true,
    color: '#D97757',
    specialHandling: 'Do Not Stack > 2',
  },
  {
    id: 'box-02',
    code: 'BOX-#1123-04-15',
    category: 'ColdChain',
    lengthCm: 180,
    widthCm: 90,
    heightCm: 80,
    weightLbs: 1320,
    priceUsd: 620,
    origin: 'Riverside Depot',
    destination: 'Phoenix Distribution',
    isAllocated: true,
    color: '#3B82F6',
    specialHandling: 'Maintain −4°C',
  },
  {
    id: 'box-03',
    code: 'BOX-#1123-07-30',
    category: 'Medical',
    lengthCm: 120,
    widthCm: 80,
    heightCm: 60,
    weightLbs: 660,
    priceUsd: 950,
    origin: 'Irvine BioTech Hub',
    destination: 'Scottsdale Clinic',
    isAllocated: true,
    color: '#10B981',
    specialHandling: 'Pharma Validated',
  },
  {
    id: 'box-04',
    code: 'BOX-#1123-10-88',
    category: 'Hazardous',
    lengthCm: 200,
    widthCm: 110,
    heightCm: 90,
    weightLbs: 2400,
    priceUsd: 1250,
    origin: 'Barstow Depot',
    destination: 'Tucson Aerospace',
    isAllocated: false,
    color: '#F59E0B',
    specialHandling: 'HazMat Class 3 Flammable',
  },
  {
    id: 'box-05',
    code: 'BOX-#1123-12-04',
    category: 'Industrial',
    lengthCm: 220,
    widthCm: 100,
    heightCm: 110,
    weightLbs: 3100,
    priceUsd: 780,
    origin: 'Ontario Logistics Center',
    destination: 'El Paso Industrial',
    isAllocated: false,
    color: '#64748B',
    specialHandling: 'Heavy Steel Castings',
  },
  {
    id: 'box-06',
    code: 'BOX-#1123-15-77',
    category: 'Electronics',
    lengthCm: 160,
    widthCm: 80,
    heightCm: 70,
    weightLbs: 890,
    priceUsd: 590,
    origin: 'San Diego Hub',
    destination: 'Phoenix Metro',
    isAllocated: false,
    color: '#D97757',
    specialHandling: 'Fragile Glassware',
  },
];

interface PermittedBoxesSidebarProps {
  boxes?: PermittedBoxItem[];
  onToggleBox?: (box: PermittedBoxItem) => void;
  onSelectBox?: (box: PermittedBoxItem) => void;
}

export function PermittedBoxesSidebar({
  boxes = DEFAULT_PERMITTED_BOXES,
  onToggleBox,
  onSelectBox,
}: PermittedBoxesSidebarProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filteredBoxes = boxes.filter((b) => {
    const matchesCat = activeCategory === 'All' || b.category === activeCategory;
    const matchesSearch =
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.origin.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const allocatedBoxes = boxes.filter((b) => b.isAllocated);
  const totalRevenue = allocatedBoxes.reduce((sum, b) => sum + b.priceUsd, 0);

  return (
    <aside className="w-full md:w-[320px] shrink-0 bg-[#FFFFFF] border-l border-[#E1E6E2] flex flex-col h-full overflow-hidden text-[#1C1E21] select-none">
      {/* ── HEADER ── */}
      <div className="p-4 border-b border-[#E1E6E2] space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E737B]">
              Manifest Catalog
            </span>
            <h2 className="text-[16px] font-black text-[#1C1E21]">Permitted Boxes</h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#34785D] flex items-center gap-0.5 justify-end">
              <DollarSign className="w-3 h-3" /> Payout
            </span>
            <span className="text-[15px] font-black text-[#1C1E21] font-mono leading-none">
              ${totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#6E737B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search container ID, route..."
            className="w-full bg-[#F7F8F6] border border-[#E1E6E2] rounded-xl pl-9 pr-3 py-1.5 text-[12px] text-[#1C1E21] placeholder:text-[#6E737B] focus:outline-none focus:border-[#34785D]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px] font-bold">
          {['All', 'Electronics', 'ColdChain', 'Medical', 'Hazardous'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-2.5 py-1 rounded-lg shrink-0 transition-all border',
                activeCategory === cat
                  ? 'bg-[#34785D] text-white border-[#34785D] shadow-sm'
                  : 'bg-[#F7F8F6] text-[#6E737B] border-[#E1E6E2] hover:text-[#1C1E21]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── SCROLLABLE LIST OF PERMITTED BOXES ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#F7F8F6]/40">
        {filteredBoxes.map((box) => (
          <div
            key={box.id}
            onClick={() => onSelectBox?.(box)}
            className={cn(
              'p-3 rounded-2xl border transition-all duration-200 cursor-pointer text-left relative group',
              box.isAllocated
                ? 'bg-[#E8F4EE] border-[#34785D] shadow-sm'
                : 'bg-[#FFFFFF] border-[#E1E6E2] hover:border-[#34785D]/40 hover:bg-[#F7F8F6] shadow-sm'
            )}
          >
            {/* Top row: Box Code + Toggle Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: box.color || '#34785D' }} />
                <h4 className="text-[12px] font-black text-[#1C1E21]">{box.code}</h4>
              </div>

              {/* Add / Remove Allocation Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBox?.(box);
                }}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all active:scale-95 border',
                  box.isAllocated
                    ? 'bg-[#34785D] text-white border-[#34785D] hover:bg-[#2C644E]'
                    : 'bg-[#F7F8F6] text-[#1C1E21] border-[#E1E6E2] hover:bg-[#E8F4EE] hover:text-[#34785D]'
                )}
              >
                {box.isAllocated ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Loaded</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3" />
                    <span>Add to Load</span>
                  </>
                )}
              </button>
            </div>

            {/* Dimensions & Weight */}
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#E1E6E2] text-[11px]">
              <div>
                <span className="text-[9px] text-[#6E737B] uppercase font-bold flex items-center gap-1">
                  <Layers className="w-2.5 h-2.5 text-[#34785D]" /> Dimensions
                </span>
                <span className="text-[11px] font-mono text-[#1C1E21]">
                  {box.lengthCm}×{box.widthCm}×{box.heightCm} cm
                </span>
              </div>
              <div>
                <span className="text-[9px] text-[#6E737B] uppercase font-bold flex items-center gap-1">
                  <Scale className="w-2.5 h-2.5 text-[#34785D]" /> Weight
                </span>
                <span className="text-[11px] font-mono text-[#1C1E21] font-bold">
                  {box.weightLbs.toLocaleString()} lbs
                </span>
              </div>
            </div>

            {/* Price & Special handling */}
            <div className="flex items-center justify-between mt-2 text-[11px]">
              <span className="text-[#34785D] font-black font-mono text-[13px]">
                +${box.priceUsd}
              </span>
              {box.specialHandling && (
                <span className="text-[9px] text-[#34785D] font-semibold bg-[#E8F4EE] border border-[#34785D]/20 px-1.5 py-0.5 rounded">
                  {box.specialHandling}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
