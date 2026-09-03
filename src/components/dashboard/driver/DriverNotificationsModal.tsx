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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#FFFFFF] border border-[#E1E6E2] p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E1E6E2]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E8F4EE] text-[#34785D] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1C1E21]">Operational Alerts</h2>
              <p className="text-[11px] text-[#6E737B]">Driver & Fleet Dispatch Center</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#F7F8F6] hover:bg-[#E8F4EE] text-[#1C1E21] active:scale-95 border border-[#E1E6E2] transition-colors"
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
                    ? 'bg-[#E8F4EE] border-[#34785D]/30 shadow-sm'
                    : 'bg-[#F7F8F6] border-[#E1E6E2]'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#34785D] animate-pulse" />
                    )}
                    <span className="text-xs font-bold text-[#1C1E21]">{n.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6E737B]">{n.time}</span>
                </div>
                <p className="text-xs text-[#1C1E21] leading-relaxed">{n.description}</p>
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          onClick={onClose}
          className="w-full h-11 rounded-2xl bg-[#F7F8F6] hover:bg-[#E8F4EE] hover:text-[#34785D] text-[#1C1E21] border border-[#E1E6E2] text-xs font-bold transition-colors"
        >
          Dismiss & Back to Cockpit
        </Button>
      </div>
    </div>
  );
}
