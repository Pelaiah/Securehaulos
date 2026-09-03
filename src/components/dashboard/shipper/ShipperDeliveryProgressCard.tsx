'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Package, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeliveryStop {
  id: string;
  label: string;
  completed: boolean;
  isCurrent?: boolean;
}

interface ShipperDeliveryProgressCardProps {
  status?: 'In Transit' | 'At Stop' | 'Delivered' | 'Pending';
  stops?: DeliveryStop[];
  itemCount?: number;
  etaMinutes?: number;
}

export function ShipperDeliveryProgressCard({
  status = 'In Transit',
  stops = [
    { id: '1', label: 'Warehouse A — LA', completed: true },
    { id: '2', label: 'Depot B — Riverside', completed: true },
    { id: '3', label: 'Hub C — Barstow', completed: false, isCurrent: true },
    { id: '4', label: 'Final — Phoenix AZ', completed: false },
  ],
  itemCount = 847,
  etaMinutes = 142,
}: ShipperDeliveryProgressCardProps) {
  const [countdown, setCountdown] = useState(etaMinutes);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const statusColor =
    status === 'In Transit'
      ? '#D97757'
      : status === 'Delivered'
      ? '#10B981'
      : '#64748B';

  const completedCount = stops.filter((s) => s.completed).length;

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
            Delivery Progress
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg"
              style={{ backgroundColor: `${statusColor}18`, color: statusColor }}
            >
              {status}
            </span>
            <span className="text-[12px] font-semibold text-[#0B0B0B]">
              {completedCount}/{stops.length} stops
            </span>
          </div>
        </div>

        {/* ETA Countdown */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-[#64748B]">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">ETA</span>
          </div>
          <span className="text-[20px] font-black text-[#0B0B0B] leading-none">
            {Math.floor(countdown / 60)}h {countdown % 60}m
          </span>
        </div>
      </div>

      {/* Stop Progress Line */}
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-[9px] top-3 bottom-3 w-px bg-[#E5E7EB]" />

        <div className="space-y-2 pl-0">
          {stops.map((stop) => (
            <div key={stop.id} className="flex items-center gap-3 relative">
              <div
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 z-10',
                  stop.completed
                    ? 'bg-[#10B981]'
                    : stop.isCurrent
                    ? 'bg-[#D97757] ring-4 ring-[#D97757]/20'
                    : 'bg-white border-2 border-[#E5E7EB]'
                )}
              >
                {stop.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                {stop.isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span
                className={cn(
                  'text-[12px] truncate',
                  stop.completed
                    ? 'text-[#64748B] line-through'
                    : stop.isCurrent
                    ? 'font-bold text-[#0B0B0B]'
                    : 'text-[#64748B]'
                )}
              >
                {stop.label}
              </span>
              {stop.isCurrent && (
                <span className="ml-auto text-[10px] font-bold text-[#D97757] flex items-center gap-0.5">
                  <MapPin className="w-3 h-3" />
                  Now
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Item Count */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#F4F4F6]">
        <Package className="w-3.5 h-3.5 text-[#64748B]" />
        <span className="text-[12px] text-[#64748B]">
          <span className="font-black text-[#0B0B0B]">{itemCount.toLocaleString()}</span> items tracked
        </span>
      </div>
    </div>
  );
}
