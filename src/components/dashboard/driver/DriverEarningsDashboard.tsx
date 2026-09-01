'use client';

import React from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Download,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EarningsData } from './types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface DriverEarningsDashboardProps {
  earnings: EarningsData;
}

export function DriverEarningsDashboard({ earnings }: DriverEarningsDashboardProps) {
  return (
    <div className="flex flex-col gap-4 pb-28 pt-2 px-3 sm:px-4 max-w-lg mx-auto w-full text-slate-100 font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B00]">
            Financial Settlement
          </span>
          <h1 className="text-xl font-black text-white">Earnings</h1>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl bg-[#141722] hover:bg-[#1C2132] border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Statement
        </Button>
      </div>

      {/* ── TODAY'S EARNINGS HERO CARD ── */}
      <div className="rounded-3xl bg-gradient-to-b from-[#1C2030] to-[#121520] border border-white/[0.1] p-5 shadow-[0_20px_45px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Today's Net Earnings
          </span>
          <Badge className="bg-emerald-500/15 border-emerald-500/30 text-emerald-400 text-xs font-mono">
            +18.4% vs Avg
          </Badge>
        </div>

        {/* Large Amount Display */}
        <div className="flex items-baseline gap-1 my-1">
          <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
            ${earnings.todayAmount.toFixed(2)}
          </span>
          <span className="text-xs text-slate-400 font-mono">USD</span>
        </div>
        <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
          <Sparkles className="w-3 h-3" /> Auto-deposited daily to Primary Fuel/Direct Card
        </p>

        {/* Supporting Metrics Breakdown */}
        <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Base Trip Earnings</span>
            <span className="font-mono font-semibold text-white">
              ${earnings.breakdown.tripEarnings.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Distance Pay (372 mi @ $0.12/mi)</span>
            <span className="font-mono font-semibold text-white">
              +${earnings.breakdown.distancePay.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>On-Time Dock Performance Bonus</span>
            <span className="font-mono font-semibold text-emerald-400">
              +${earnings.breakdown.onTimeBonus.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Fuel Surcharge Reimbursement</span>
            <span className="font-mono font-semibold text-emerald-400">
              +${earnings.breakdown.fuelSurcharge.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* ── MINIMAL WEEKLY EARNINGS GRAPH ── */}
      <div className="rounded-3xl bg-[#141722] border border-white/[0.08] p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Performance
            </span>
            <h3 className="text-sm font-bold text-white">Weekly Payout Overview</h3>
          </div>
          <span className="text-xs font-mono font-bold text-slate-300">$3,785.50 Total</span>
        </div>

        {/* Recharts Bar Graph */}
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={earnings.weeklyChart} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <XAxis
                dataKey="day"
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0E1015',
                  borderColor: '#242A3D',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#FFF',
                }}
                formatter={(value: any) => [`$${value}`, 'Earned']}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {earnings.weeklyChart.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.day === 'Sat' ? '#FF6B00' : '#2A3147'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── RECENT SETTLEMENTS LIST ── */}
      <div className="rounded-3xl bg-[#141722] border border-white/[0.08] p-4 shadow-md space-y-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Recent Load Settlements
        </span>

        <div className="space-y-2">
          {earnings.recentSettlements.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#0E1015] border border-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white font-mono">{item.loadNumber}</p>
                  <p className="text-[10px] text-slate-400">{item.date}</p>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs font-bold text-emerald-400">+${item.amount.toFixed(2)}</span>
                <span className="block text-[9px] text-slate-500 uppercase font-semibold">Direct Deposit</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
