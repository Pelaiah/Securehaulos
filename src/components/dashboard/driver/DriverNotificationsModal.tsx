'use client';

import React from 'react';
import {
  Bell,
  X,
  PackageCheck,
  AlertTriangle,
  Clock,
  MessageSquare,
  Wrench,
  FileWarning,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface OperationalNotification {
  id: string;
  type: 'load' | 'reminder' | 'route' | 'vehicle' | 'compliance' | 'dispatcher';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  priority: 'high' | 'normal' | 'urgent';
}

interface DriverNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationAction?: (notification: OperationalNotification) => void;
}

export function DriverNotificationsModal({
  isOpen,
  onClose,
  onNotificationAction,
}: DriverNotificationsModalProps) {
  if (!isOpen) return null;

  const notifications: OperationalNotification[] = [
    {
      id: 'notif-1',
      type: 'load',
      title: 'New High-Value Load Assigned',
      description: 'Load #NX8L-90KLA1 (Phoenix → Albuquerque) assigned for tomorrow 07:00 AM. Payout: $1,680.',
      time: '10m ago',
      isRead: false,
      priority: 'high',
    },
    {
      id: 'notif-2',
      type: 'reminder',
      title: 'Pickup Window Approaching',
      description: 'Apex BioLogistics Dock #14 appointment is in 25 minutes. Pre-cooling to -20°C verified.',
      time: '25m ago',
      isRead: false,
      priority: 'high',
    },
    {
      id: 'notif-3',
      type: 'compliance',
      title: 'DOT Medical Card Expiry Notice',
      description: 'Your DOT Medical Examiner Certificate expires in 80 days. Schedule renewal examination.',
      time: '2h ago',
      isRead: true,
      priority: 'normal',
    },
    {
      id: 'notif-4',
      type: 'route',
      title: 'Traffic Advisory: I-10 East',
      description: 'Slight congestion cleared near Milepost 184. Current route remains fastest.',
      time: '3h ago',
      isRead: true,
      priority: 'normal',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#12151F] border border-white/10 p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FF6B00]/15 text-[#FF6B00] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Operational Alerts</h2>
              <p className="text-[11px] text-slate-400">Driver & Fleet Dispatch Center</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#181B26] hover:bg-[#202534] text-slate-300 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {notifications.map((n) => {
            return (
              <div
                key={n.id}
                onClick={() => onNotificationAction?.(n)}
                className={cn(
                  'p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5',
                  !n.isRead
                    ? 'bg-[#181D2C] border-[#FF6B00]/30 shadow-md'
                    : 'bg-[#141722] border-white/[0.06] opacity-80'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
                    )}
                    <span className="text-xs font-bold text-white">{n.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.description}</p>
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          onClick={onClose}
          className="w-full h-11 rounded-2xl bg-[#1F2435] hover:bg-[#2A3147] text-slate-200 text-xs font-bold"
        >
          Dismiss & Back to Cockpit
        </Button>
      </div>
    </div>
  );
}
