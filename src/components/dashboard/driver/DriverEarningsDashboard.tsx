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
    <div className="flex flex-col gap-4 pb-28 pt-2 px-3 sm:px-4 max-w-lg mx-auto w-full text-[#1C1E21] font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#34785D]">
            Financial Settlement
          </span>
          <h1 className="text-xl font-black text-[#1C1E21]">Earnings</h1>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl bg-[#FFFFFF] hover:bg-[#E8F4EE] hover:text-[#34785D] border border-[#E1E6E2] text-xs font-semibold text-[#1C1E21] flex items-center gap-1.5 shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          Statement
        </Button>
      </div>

      {/* ── TODAY'S EARNINGS HERO CARD ── */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E1E6E2] p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#6E737B] uppercase tracking-wider">
            Today's Net Earnings
          </span>
          <Badge className="bg-[#E8F4EE] border-[#34785D]/20 text-[#34785D] text-xs font-mono">
            +18.4% vs Avg
          </Badge>
        </div>

        {/* Large Amount Display */}
        <div className="flex items-baseline gap-1 my-1">
          <span className="text-3xl sm:text-4xl font-black text-[#1C1E21] font-mono tracking-tight">
            ${earnings.todayAmount.toFixed(2)}
          </span>
          <span className="text-xs text-[#6E737B] font-mono">USD</span>
        </div>
        <p className="text-[11px] text-[#34785D] font-semibold flex items-center gap-1 mt-0.5">
          <Sparkles className="w-3 h-3" /> Auto-deposited daily to Primary Fuel/Direct Card
        </p>

        {/* Supporting Metrics Breakdown */}
        <div className="mt-4 pt-3 border-t border-[#E1E6E2] space-y-2 text-xs">
          <div className="flex justify-between text-[#6E737B]">
            <span>Base Trip Earnings</span>
            <span className="font-mono font-semibold text-[#1C1E21]">
              ${earnings.breakdown.tripEarnings.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-[#6E737B]">
            <span>Distance Pay (372 mi @ $0.12/mi)</span>
            <span className="font-mono font-semibold text-[#1C1E21]">
              +${earnings.breakdown.distancePay.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-[#6E737B]">
            <span>On-Time Dock Performance Bonus</span>
            <span className="font-mono font-semibold text-[#34785D]">
              +${earnings.breakdown.onTimeBonus.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-[#6E737B]">
            <span>Fuel Surcharge Reimbursement</span>
            <span className="font-mono font-semibold text-[#34785D]">
              +${earnings.breakdown.fuelSurcharge.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* ── MINIMAL WEEKLY EARNINGS GRAPH ── */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E1E6E2] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#6E737B] uppercase tracking-wider">
              Performance
            </span>
            <h3 className="text-sm font-bold text-[#1C1E21]">Weekly Payout Overview</h3>
          </div>
          <span className="text-xs font-mono font-bold text-[#1C1E21]">$3,785.50 Total</span>
        </div>

        {/* Recharts Bar Graph */}
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={earnings.weeklyChart} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <XAxis
                dataKey="day"
                stroke="#6E737B"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6E737B"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E1E6E2',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#1C1E21',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
                formatter={(value: any) => [`$${value}`, 'Earned']}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {earnings.weeklyChart.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.day === 'Sat' ? '#34785D' : '#E8F4EE'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── RECENT SETTLEMENTS LIST ── */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E1E6E2] p-4 shadow-sm space-y-3">
        <span className="text-[10px] font-bold text-[#6E737B] uppercase tracking-wider block">
          Recent Load Settlements
        </span>

        <div className="space-y-2">
          {earnings.recentSettlements.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F8F6] border border-[#E1E6E2]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#E8F4EE] text-[#34785D] flex items-center justify-center font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1C1E21] font-mono">{item.loadNumber}</p>
                  <p className="text-[10px] text-[#6E737B]">{item.date}</p>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs font-bold text-[#34785D]">+${item.amount.toFixed(2)}</span>
                <span className="block text-[9px] text-[#6E737B] uppercase font-semibold">Direct Deposit</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
