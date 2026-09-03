'use client';

import React from 'react';
import { Home, Layers, Navigation, DollarSign, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DriverTabType = 'home' | 'loads' | 'navigate' | 'earnings' | 'profile';

interface DriverBottomNavigationProps {
  activeTab: DriverTabType;
  onSelectTab: (tab: DriverTabType) => void;
  isTripActive?: boolean;
}

export function DriverBottomNavigation({
  activeTab,
  onSelectTab,
  isTripActive = true,
}: DriverBottomNavigationProps) {
  const tabs = [
    { id: 'home' as DriverTabType, label: 'Home', icon: Home },
    { id: 'loads' as DriverTabType, label: 'Loads', icon: Layers },
    { id: 'navigate' as DriverTabType, label: 'Navigate', icon: Navigation, isCenter: true },
    { id: 'earnings' as DriverTabType, label: 'Earnings', icon: DollarSign },
    { id: 'profile' as DriverTabType, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-3 inset-x-0 z-50 flex justify-center px-3 pointer-events-none">
      <nav
        aria-label="Driver Operational Navigation"
        className="pointer-events-auto w-full max-w-[420px] bg-white/95 backdrop-blur-2xl border border-[#E1E6E2] shadow-[0_12px_36px_rgba(28,30,33,0.08)] rounded-full px-3 py-2 flex items-center justify-between"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab('navigate')}
                className={cn(
                  'relative -top-3 flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 active:scale-95 group',
                  isActive
                    ? 'bg-[#34785D] text-white shadow-[0_8px_25px_rgba(52,120,93,0.35)] ring-4 ring-[#F7F8F6]'
                    : 'bg-[#E8F4EE] text-[#34785D] border border-[#34785D]/20 shadow-sm hover:bg-[#34785D] hover:text-white'
                )}
                aria-label="Active Navigation Mode"
              >
                {/* Glow ring pulse when trip is active */}
                {isTripActive && (
                  <span className="absolute -inset-1 rounded-full bg-[#34785D]/25 animate-ping opacity-60 pointer-events-none" />
                )}
                <Icon
                  className={cn(
                    'w-6 h-6 transition-transform duration-300 group-hover:rotate-12',
                    isActive ? 'fill-current' : 'stroke-[2.2]'
                  )}
                />
                <span className="sr-only">Live Navigation</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={cn(
                'relative flex flex-col items-center justify-center w-12 h-11 rounded-2xl transition-all duration-200 active:scale-90',
                isActive
                  ? 'text-[#34785D] font-semibold'
                  : 'text-[#6E737B] hover:text-[#1C1E21]'
              )}
            >
              {isActive && (
                <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#34785D]" />
              )}
              <Icon
                className={cn(
                  'w-5 h-5 transition-transform duration-200',
                  isActive ? 'stroke-[2.4] scale-105' : 'stroke-[1.8]'
                )}
              />
              <span className="text-[10px] mt-0.5 font-medium tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
