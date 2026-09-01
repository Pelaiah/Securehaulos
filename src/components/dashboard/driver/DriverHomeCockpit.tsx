'use client';

import React from 'react';
import {
  Bell,
  Radio,
  Wifi,
  Navigation,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Truck as TruckIcon,
  Flame,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DriverTrip, DriverProfile, DriverOperationalStatus } from './types';
import { cn } from '@/lib/utils';

interface DriverHomeCockpitProps {
  trip: DriverTrip;
  profile: DriverProfile;
  driverStatus: DriverOperationalStatus;
  onToggleStatus: () => void;
  onStartTrip: () => void;
  onOpenPickupFlow: () => void;
  onOpenDeliveryFlow: () => void;
  onOpenVehicleHealth: () => void;
  onOpenDispatcherChat: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
}

export function DriverHomeCockpit({
  trip,
  profile,
  driverStatus,
  onToggleStatus,
  onStartTrip,
  onOpenPickupFlow,
  onOpenDeliveryFlow,
  onOpenVehicleHealth,
  onOpenDispatcherChat,
  onOpenNotifications,
  unreadNotificationsCount = 2,
}: DriverHomeCockpitProps) {
  const isOnline = driverStatus === 'online';

  // Determine what the current high-priority action is based on trip status
  const isApproachingPickup = trip.status === 'NAVIGATING_TO_PICKUP' || trip.status === 'AT_PICKUP' || trip.status === 'CHECKING_IN_PICKUP' || trip.status === 'LOADING';
  const isApproachingDelivery = trip.status === 'IN_TRANSIT' || trip.status === 'AT_DELIVERY' || trip.status === 'UNLOADING' || trip.status === 'DELIVERED_POD_PENDING';
  const isCompleted = trip.status === 'COMPLETED';

  return (
    <div className="flex flex-col gap-4 pb-28 pt-2 px-3 sm:px-4 max-w-lg mx-auto w-full text-slate-100 font-sans select-none">
      {/* ── TOP HEADER / DRIVER STATUS HUD ── */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white/10 ring-2 ring-[#FF6B00]/40 shadow-lg">
              <AvatarImage src={profile.photoUrl} alt={profile.name} className="object-cover" />
              <AvatarFallback className="bg-[#181B26] text-[#FF6B00] font-bold">SV</AvatarFallback>
            </Avatar>
            <span
              className={cn(
                'absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#0E1015]',
                isOnline ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]' : 'bg-amber-500'
              )}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Driver Cockpit
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <Wifi className="w-3 h-3 animate-pulse" /> Live ELD
              </span>
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-snug">
              Good morning, {profile.name.split(' ')[0]}
            </h1>
          </div>
        </div>

        {/* Right Actions: Status Toggle & Notifications */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleStatus}
            className={cn(
              'px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all duration-200 active:scale-95 backdrop-blur-md',
              isOnline
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
            )}
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                isOnline ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
              )}
            />
            {isOnline ? 'Online' : 'On Break'}
          </button>

          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full bg-[#181B26] hover:bg-[#202433] border border-white/10 text-slate-300 transition-colors active:scale-95"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#FF6B00] text-white text-[9px] font-extrabold flex items-center justify-center rounded-full ring-2 ring-[#0E1015]">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── TRUCK CONNECTIVITY BAR ── */}
      <button
        type="button"
        onClick={onOpenVehicleHealth}
        className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#141722]/80 hover:bg-[#191D2B] border border-white/[0.06] text-xs text-slate-300 transition-all active:scale-[0.99] group shadow-inner"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#FF6B00]/15 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00]">
            <TruckIcon className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="font-semibold text-white group-hover:text-[#FF6B00] transition-colors">
              {profile.assignedTruck}
            </span>
            <span className="text-[11px] text-slate-400 ml-2 font-mono">
              Fuel: 78% · Reefer: -4°F Normal
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
          <span>Good</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </button>

      {/* ── MAIN HERO CARD: "YOUR NEXT TRIP" ── */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#1C202F] to-[#12151E] border border-white/[0.1] p-4 sm:p-5 shadow-[0_20px_45px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#FF6B00]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Status & Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse shadow-[0_0_8px_#FF6B00]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              {isCompleted ? 'Trip Completed' : 'Action Required · Active Trip'}
            </span>
          </div>
          <Badge
            variant="outline"
            className="bg-[#0E1015]/80 text-slate-300 border-white/10 font-mono text-[11px] px-2 py-0.5"
          >
            {trip.loadNumber}
          </Badge>
        </div>

        {/* Cargo & Equipment Spec */}
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {trip.cargoType}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
            <span>{trip.equipment}</span>
            <span>•</span>
            <span className="font-mono text-slate-300">{trip.weight}</span>
          </p>
        </div>

        {/* Route Visualizer Timeline */}
        <div className="relative pl-6 py-1 my-3 border-l-2 border-dashed border-[#FF6B00]/40 space-y-4">
          {/* Pickup Point */}
          <div className="relative">
            <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#0E1015] border-2 border-[#FF6B00] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
            </span>
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Pickup Facility
              </p>
              <span className="text-[11px] font-mono text-[#FF6B00] font-semibold">
                {trip.origin.appointmentTime}
              </span>
            </div>
            <p className="text-xs font-semibold text-white">{trip.origin.facility}</p>
            <p className="text-[11px] text-slate-400 truncate">{trip.origin.address}</p>
          </div>

          {/* Delivery Point */}
          <div className="relative">
            <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#0E1015] border-2 border-emerald-400 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </span>
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Destination
              </p>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                {trip.destination.appointmentTime}
              </span>
            </div>
            <p className="text-xs font-semibold text-white">{trip.destination.consignee}</p>
            <p className="text-[11px] text-slate-400 truncate">{trip.destination.address}</p>
          </div>
        </div>

        {/* Trip Distance & ETA Grid */}
        <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-2xl bg-[#0F121C]/80 border border-white/[0.06] text-center">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500">Distance</span>
            <p className="text-sm font-bold text-white font-mono mt-0.5">
              {trip.metrics.totalDistanceMi} mi
            </p>
          </div>
          <div className="border-x border-white/[0.08]">
            <span className="text-[10px] uppercase font-semibold text-slate-500">Est. Time</span>
            <p className="text-sm font-bold text-white font-mono mt-0.5">
              {trip.metrics.estimatedHours}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500">Live ETA</span>
            <p className="text-sm font-bold text-[#FF6B00] font-mono mt-0.5">
              {trip.metrics.eta}
            </p>
          </div>
        </div>

        {/* Primary Action Button based on state */}
        <div className="mt-4 flex flex-col gap-2">
          {trip.status === 'NAVIGATING_TO_PICKUP' && (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={onStartTrip}
                className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#FF7700] hover:from-[#FF6600] hover:to-[#FF8800] text-white font-bold text-sm tracking-wide shadow-[0_8px_25px_rgba(255,107,0,0.45)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4 fill-white" />
                NAVIGATE TRIP
              </Button>
              <Button
                type="button"
                onClick={onOpenPickupFlow}
                variant="outline"
                className="h-12 px-4 rounded-2xl bg-[#1A1E2B] hover:bg-[#232838] border-white/10 text-[#FF6B00] font-bold text-xs active:scale-95"
              >
                At Dock
              </Button>
            </div>
          )}

          {trip.status === 'AT_PICKUP' || trip.status === 'CHECKING_IN_PICKUP' || trip.status === 'LOADING' ? (
            <Button
              type="button"
              onClick={onOpenPickupFlow}
              className="w-full h-12 rounded-2xl bg-[#FF6B00] hover:bg-[#FF7700] text-white font-bold text-sm shadow-[0_8px_25px_rgba(255,107,0,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              CONTINUE PICKUP WORKFLOW
            </Button>
          ) : null}

          {trip.status === 'IN_TRANSIT' && (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={onStartTrip}
                className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#FF7700] text-white font-bold text-sm shadow-[0_8px_25px_rgba(255,107,0,0.45)] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4 fill-white" />
                LIVE NAVIGATION (IN TRANSIT)
              </Button>
              <Button
                type="button"
                onClick={onOpenDeliveryFlow}
                variant="outline"
                className="h-12 px-4 rounded-2xl bg-[#1A1E2B] hover:bg-[#232838] border-emerald-500/40 text-emerald-400 font-bold text-xs active:scale-95"
              >
                Arrive Dest
              </Button>
            </div>
          )}

          {trip.status === 'AT_DELIVERY' || trip.status === 'UNLOADING' || trip.status === 'DELIVERED_POD_PENDING' ? (
            <Button
              type="button"
              onClick={onOpenDeliveryFlow}
              className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-[0_8px_25px_rgba(16,185,129,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              COMPLETE DELIVERY & POD
            </Button>
          ) : null}
        </div>
      </div>

      {/* ── TODAY'S OPERATIONAL SUMMARY ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-2xl bg-[#141722]/90 border border-white/[0.06] shadow-sm">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Deliveries
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-extrabold text-white font-mono">1</span>
            <span className="text-xs text-slate-400 font-mono">/ 3 total</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
            2 Remaining
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#141722]/90 border border-white/[0.06] shadow-sm">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Distance
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-extrabold text-white font-mono">480</span>
            <span className="text-xs text-slate-400 font-mono">mi</span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
            368 mi to go
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#141722]/90 border border-white/[0.06] shadow-sm">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Est. Earnings
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-extrabold text-[#FF6B00] font-mono">$1,420</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
            +$35 on-time bonus
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#141722]/90 border border-white/[0.06] shadow-sm">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Safety Score
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-extrabold text-white font-mono">
              {profile.safetyScore}%
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
            Tier 1 Driver
          </span>
        </div>
      </div>

      {/* ── LIVE INTERACTIVE MAP CARD ── */}
      <div className="rounded-3xl bg-[#131620] border border-white/[0.08] p-3.5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Live Route Radar
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            GPS: 34.015° N, 118.170° W
          </span>
        </div>

        {/* Photorealistic Dark Road Map Canvas Simulation */}
        <div
          role="button"
          tabIndex={0}
          onClick={onStartTrip}
          onKeyDown={(e) => e.key === 'Enter' && onStartTrip()}
          className="relative h-44 w-full rounded-2xl bg-[#090B0F] overflow-hidden border border-white/10 cursor-pointer group shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
        >
          {/* Map Vector Texture */}
          <svg
            viewBox="0 0 400 180"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF8800" />
                <stop offset="100%" stopColor="#FF4400" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* Dark background grid */}
            <rect width="400" height="180" fill="#0C0E14" />
            {/* Terrain blocks */}
            <path
              d="M30 10 L150 15 L140 70 L20 60 Z"
              fill="#12151E"
              opacity="0.9"
            />
            <path
              d="M220 20 L380 40 L370 110 L200 80 Z"
              fill="#12151E"
              opacity="0.9"
            />
            <path
              d="M50 110 L180 120 L160 170 L30 160 Z"
              fill="#12151E"
              opacity="0.9"
            />

            {/* Secondary roads */}
            <path
              d="M0 45 Q120 40 220 50 T400 35"
              stroke="#1C2130"
              strokeWidth="6"
              fill="none"
            />
            <path
              d="M80 0 Q90 90 70 180"
              stroke="#1C2130"
              strokeWidth="5"
              fill="none"
            />
            <path
              d="M280 0 Q300 80 320 180"
              stroke="#1C2130"
              strokeWidth="5"
              fill="none"
            />

            {/* Main Interstate I-10 Highway */}
            <path
              d="M20 140 Q120 110 200 90 T380 40"
              stroke="#2A3045"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
            />

            {/* Active Orange Glowing Route */}
            <path
              d="M60 128 Q130 106 200 90 T340 48"
              stroke="url(#routeGrad)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              filter="url(#glow)"
            />

            {/* Pickup Marker (Origin) */}
            <circle cx="60" cy="128" r="6" fill="#FF6B00" />
            <circle cx="60" cy="128" r="12" fill="#FF6B00" opacity="0.3" />
            <text x="60" y="152" fill="#94A3B8" fontSize="9" fontWeight="bold" textAnchor="middle">
              Apex Bio Dock 14
            </text>

            {/* Truck Marker (Current Position) */}
            <circle cx="150" cy="102" r="8" fill="#FFFFFF" filter="url(#glow)" />
            <circle cx="150" cy="102" r="4" fill="#FF6B00" />
            <circle cx="150" cy="102" r="16" fill="#FF6B00" opacity="0.2" className="animate-ping" />

            {/* Delivery Destination */}
            <circle cx="340" cy="48" r="6" fill="#10B981" />
            <circle cx="340" cy="48" r="12" fill="#10B981" opacity="0.3" />
            <text x="340" y="32" fill="#10B981" fontSize="9" fontWeight="bold" textAnchor="middle">
              Phoenix Consignee
            </text>
          </svg>

          {/* Floating Map Overlay Badge */}
          <div className="absolute top-2.5 right-2.5 bg-[#0E1015]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[11px] font-semibold text-slate-200 flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Traffic Normal (I-10 E)</span>
          </div>

          <div className="absolute bottom-2.5 left-2.5 bg-[#0E1015]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-white flex items-center gap-2 group-hover:border-[#FF6B00] transition-colors shadow-lg">
            <Navigation className="w-3.5 h-3.5 text-[#FF6B00] fill-[#FF6B00]" />
            <span>Tap to Expand Full Navigation</span>
          </div>
        </div>
      </div>

      {/* ── RAPID DISPATCHER QUICK-CONTACT BAR ── */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#171B27] to-[#12141E] border border-white/[0.08] shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FF6B00]/15 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00] font-bold text-xs">
            MV
          </div>
          <div>
            <p className="text-xs font-bold text-white">Dispatcher Marcus Vance</p>
            <p className="text-[11px] text-slate-400">Fleet Control · Standby</p>
          </div>
        </div>
        <Button
          type="button"
          onClick={onOpenDispatcherChat}
          size="sm"
          className="rounded-xl bg-[#1F2435] hover:bg-[#282E44] border border-white/10 text-xs font-bold text-slate-200 active:scale-95"
        >
          Quick Chat
        </Button>
      </div>
    </div>
  );
}
