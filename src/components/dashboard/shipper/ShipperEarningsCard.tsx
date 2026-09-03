'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ShipperEarningsCardProps {
  todayAmount?: number;
  weekAmount?: number;
  platformFeePercent?: number;
  nextPayoutDate?: string;
  sparkData?: number[];
}

export function ShipperEarningsCard({
  todayAmount = 1240,
  weekAmount = 6180,
  platformFeePercent = 12,
  nextPayoutDate = 'Fri, Sep 4',
  sparkData = [34, 49, 30, 58, 43, 55, 100],
}: ShipperEarningsCardProps) {
  return (
    <section className="bg-white border border-[#e2e4dd] rounded-[20px] p-4 sm:p-4.5 shadow-sm text-[#171a16] select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[13.5px] font-semibold text-[#171a16]">
          Earnings &amp; payouts
        </span>
        <button
          type="button"
          aria-label="View payouts history"
          className="text-[#b4b8ac] hover:text-[#171a16] transition-colors"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Figures */}
      <div className="flex gap-5 mb-3">
        <div>
          <div className="text-[11.5px] text-[#82877c] mb-0.5">Today</div>
          <div className="text-[17px] font-bold tracking-tight text-[#171a16]">
            ${todayAmount.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-[11.5px] text-[#82877c] mb-0.5">This week</div>
          <div className="text-[17px] font-bold tracking-tight text-[#171a16]">
            ${weekAmount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Meta details */}
      <div className="flex justify-between text-[12px] text-[#82877c] mb-3.5 border-t border-[#f2f3ef] pt-2.5">
        <span>
          Platform fee <b className="text-[#171a16] font-semibold">{platformFeePercent}%</b>
        </span>
        <span>
          Next payout <b className="text-[#171a16] font-semibold">{nextPayoutDate}</b>
        </span>
      </div>

      {/* Sparkline chart */}
      <div className="flex items-end gap-1.5 h-11 pt-1">
        {sparkData.map((val, i) => (
          <div
            key={i}
            style={{ height: `${val}%` }}
            className={`flex-1 rounded-[3px] transition-all duration-300 ${
              i === sparkData.length - 1 ? 'bg-[#4fb583]' : 'bg-[#e7f4ee] hover:bg-[#a9e6c8]'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
