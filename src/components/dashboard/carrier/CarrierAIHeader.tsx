'use client';

import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  Bell,
  Download,
  ShieldCheck,
  Radio,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarrierAIHeaderProps {
  onSearchQuery?: (query: string) => void;
  activeTruckCount?: number;
  totalTruckCount?: number;
}

export function CarrierAIHeader({
  onSearchQuery,
  activeTruckCount = 14,
  totalTruckCount = 18,
}: CarrierAIHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiFocused, setIsAiFocused] = useState(false);

  const quickPrompts = [
    'Reefer loads > 18t near Chicago',
    'High margin routes to Dallas',
    'Hazardous certified drivers available',
  ];

  const handlePromptClick = (prompt: string) => {
    setSearchQuery(prompt);
    onSearchQuery?.(prompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchQuery?.(searchQuery);
  };

  return (
    <header className="w-full bg-[#FFFFFF] text-[#1C1E21] border-b border-[#E1E6E2] px-6 py-3 shrink-0 flex flex-col md:flex-row items-center justify-between gap-3 select-none">
      {/* ── BRAND IDENTIFIER ── */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#34785D] to-[#2C644E] flex items-center justify-center shadow-sm">
          <span className="text-white text-[12px] font-black tracking-tighter">XPO</span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-[15px] font-black tracking-tight text-[#1C1E21]">XPO Logistics</h1>
            <span className="px-1.5 py-0.5 rounded-md bg-[#E8F4EE] text-[9px] font-bold text-[#34785D] uppercase tracking-wider border border-[#34785D]/20">
              Fleet OS
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#6E737B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34785D] animate-pulse" />
            <span>
              {activeTruckCount}/{totalTruckCount} Fleets En Route
            </span>
          </div>
        </div>
      </div>

      {/* ── CENTRAL AI NATURAL LANGUAGE SEARCH BAR ── */}
      <div className="flex-1 max-w-2xl w-full">
        <form onSubmit={handleSubmit} className="relative group">
          <div
            className={cn(
              'relative flex items-center bg-[#F7F8F6] border rounded-2xl px-3.5 py-2 transition-all duration-300 shadow-sm',
              isAiFocused
                ? 'border-[#34785D] ring-2 ring-[#34785D]/20 bg-[#FFFFFF]'
                : 'border-[#E1E6E2] hover:border-[#34785D]/40'
            )}
          >
            <div className="flex items-center gap-2 text-[#34785D] mr-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsAiFocused(true)}
              onBlur={() => setIsAiFocused(false)}
              placeholder="Search Freight by AI: e.g. 'Optimize loads for Volvo FH16 near Phoenix'..."
              className="w-full bg-transparent text-[13px] text-[#1C1E21] placeholder:text-[#6E737B] focus:outline-none"
            />

            {searchQuery ? (
              <button
                type="submit"
                className="w-6 h-6 rounded-lg bg-[#34785D] text-white flex items-center justify-center text-xs hover:bg-[#2C644E] transition-all"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-white text-[#6E737B] rounded border border-[#E1E6E2]">
                  Ctrl K
                </kbd>
              </div>
            )}
          </div>

          {/* Quick AI Suggestions */}
          {isAiFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-[#FFFFFF] border border-[#E1E6E2] rounded-xl shadow-xl z-50 flex flex-wrap gap-1.5">
              <span className="text-[10px] uppercase font-bold text-[#6E737B] w-full px-2 py-1">
                Suggested AI Freight Queries:
              </span>
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onMouseDown={() => handlePromptClick(p)}
                  className="px-2.5 py-1 rounded-lg bg-[#F7F8F6] hover:bg-[#E8F4EE] hover:text-[#34785D] text-[11px] text-[#1C1E21] transition-colors flex items-center gap-1.5 border border-[#E1E6E2]"
                >
                  <Sparkles className="w-3 h-3 text-[#34785D]" />
                  {p}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* ── SYSTEM CONTROL ACTIONS ── */}
      <div className="flex items-center gap-2 min-w-[200px] justify-end">
        {/* Real-time telemetry health indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#E8F4EE] border border-[#34785D]/20 text-[11px]">
          <Radio className="w-3.5 h-3.5 text-[#34785D] animate-pulse" />
          <span className="text-[#6E737B] font-semibold">Telematics:</span>
          <span className="text-[#34785D] font-bold">Live</span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-xl bg-[#F7F8F6] border border-[#E1E6E2] flex items-center justify-center text-[#6E737B] hover:text-[#1C1E21] hover:bg-[#E8F4EE] transition-all active:scale-95"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#34785D]" />
        </button>

        {/* Export / Dispatch CTA */}
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#34785D] hover:bg-[#2C644E] text-white text-[12px] font-bold transition-all shadow-sm active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Manifest</span>
        </button>
      </div>
    </header>
  );
}
