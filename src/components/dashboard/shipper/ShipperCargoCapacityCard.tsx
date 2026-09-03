'use client';

import React from 'react';
import { FileText, Heart, Utensils, Cpu } from 'lucide-react';

interface CargoCategory {
  id: string;
  label: string;
  weightKg: number;
  color: string;
  icon: React.ElementType;
}

interface ShipperCargoCapacityCardProps {
  totalCapacityKg?: number;
  categories?: CargoCategory[];
}

export function ShipperCargoCapacityCard({
  totalCapacityKg = 34500,
  categories = [
    { id: 'docs', label: 'Documents', weightKg: 2100, color: '#D97757', icon: FileText },
    { id: 'med', label: 'Medical', weightKg: 8400, color: '#10B981', icon: Heart },
    { id: 'food', label: 'Food', weightKg: 11500, color: '#64748B', icon: Utensils },
    { id: 'elec', label: 'Electronics', weightKg: 12500, color: '#0B0B0B', icon: Cpu },
  ],
}: ShipperCargoCapacityCardProps) {
  const totalUsed = categories.reduce((s, c) => s + c.weightKg, 0);
  const fillPercent = Math.min(100, Math.round((totalUsed / totalCapacityKg) * 100));

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
            Cargo Load & Capacity
          </p>
          <p className="text-[13px] font-bold text-[#0B0B0B] mt-0.5">
            {(totalUsed / 1000).toFixed(1)}t / {(totalCapacityKg / 1000).toFixed(1)}t
          </p>
        </div>
        <div className="text-right">
          <span className="text-[22px] font-black text-[#0B0B0B]">{fillPercent}%</span>
          <p className="text-[10px] text-[#64748B]">loaded</p>
        </div>
      </div>

      {/* Stacked Capacity Bar */}
      <div className="h-3 w-full rounded-full overflow-hidden flex bg-[#F4F4F6]">
        {categories.map((cat) => {
          const pct = (cat.weightKg / totalCapacityKg) * 100;
          return (
            <div
              key={cat.id}
              style={{ width: `${pct}%`, backgroundColor: cat.color }}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
            />
          );
        })}
      </div>

      {/* Category Breakdown */}
      <div className="space-y-1.5 pt-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const pct = Math.round((cat.weightKg / totalCapacityKg) * 100);
          return (
            <div key={cat.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${cat.color}18` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                </div>
                <span className="text-[12px] text-[#64748B]">{cat.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-[#F4F4F6] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: cat.color }}
                  />
                </div>
                <span className="text-[11px] font-bold text-[#0B0B0B] w-10 text-right font-mono">
                  {(cat.weightKg / 1000).toFixed(1)}t
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
