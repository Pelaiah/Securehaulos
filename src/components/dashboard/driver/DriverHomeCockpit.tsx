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
import { Map, MapRoute, MapMarker, MarkerContent } from '@/components/ui/map';

const FULL_ROUTE_COORDS: [number, number][] = [
  [-118.2437, 34.0522], // Los Angeles
  [-117.8311, 33.8353],
  [-116.5453, 33.8298],
  [-115.5514, 32.7254], // current (Blythe)
  [-114.6277, 32.7157],
  [-113.5528, 33.0745],
  [-112.4737, 33.4484],
  [-112.074, 33.4484],  // Phoenix
];

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
    <div className="flex flex-col gap-4 pb-28 pt-2 px-3 sm:px-4 max-w-lg mx-auto w-full text-[#1C1E21] font-sans select-none">
      {/* ── TOP HEADER / DRIVER STATUS HUD ── */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white ring-2 ring-[#34785D]/30 shadow-md">
              <AvatarImage src={profile.photoUrl} alt={profile.name} className="object-cover" />
              <AvatarFallback className="bg-[#E8F4EE] text-[#34785D] font-bold">SV</AvatarFallback>
            </Avatar>
            <span
              className={cn(
                'absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#FFFFFF]',
                isOnline ? 'bg-[#34785D] shadow-[0_0_8px_#34785D]' : 'bg-amber-500'
              )}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6E737B]">
                Driver Cockpit
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-[#E1E6E2]" />
              <span className="text-[11px] text-[#34785D] font-mono flex items-center gap-1 font-semibold">
                <Wifi className="w-3 h-3 animate-pulse" /> Live ELD
              </span>
            </div>
            <h1 className="text-lg font-bold text-[#1C1E21] tracking-tight leading-snug">
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
              'px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all duration-200 active:scale-95 shadow-sm',
              isOnline
                ? 'bg-[#E8F4EE] border-[#34785D]/30 text-[#34785D]'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            )}
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                isOnline ? 'bg-[#34785D] animate-ping' : 'bg-amber-500'
              )}
            />
            {isOnline ? 'Online' : 'On Break'}
          </button>

          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full bg-[#FFFFFF] hover:bg-[#F7F8F6] border border-[#E1E6E2] text-[#6E737B] transition-colors active:scale-95 shadow-sm"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#34785D] text-white text-[9px] font-extrabold flex items-center justify-center rounded-full ring-2 ring-[#FFFFFF]">
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
        className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#FFFFFF] hover:bg-[#F7F8F6] border border-[#E1E6E2] text-xs text-[#1C1E21] transition-all active:scale-[0.99] group shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#E8F4EE] border border-[#34785D]/20 flex items-center justify-center text-[#34785D]">
            <TruckIcon className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="font-semibold text-[#1C1E21] group-hover:text-[#34785D] transition-colors">
              {profile.assignedTruck}
            </span>
            <span className="text-[11px] text-[#6E737B] ml-2 font-mono">
              Fuel: 78% · Reefer: -4°F Normal
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#34785D] font-semibold">
          <span>Good</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#6E737B] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </button>

      {/* ── MAIN HERO CARD: "YOUR NEXT TRIP" ── */}
      <div className="relative rounded-3xl bg-[#FFFFFF] border border-[#E1E6E2] p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Top Status & Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34785D] animate-pulse shadow-[0_0_8px_#34785D]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#34785D]">
              {isCompleted ? 'Trip Completed' : 'Action Required · Active Trip'}
            </span>
          </div>
          <Badge
            variant="outline"
            className="bg-[#E8F4EE] text-[#34785D] border-[#34785D]/20 font-mono text-[11px] px-2 py-0.5"
          >
            {trip.loadNumber}
          </Badge>
        </div>

        {/* Cargo & Equipment Spec */}
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-bold text-[#1C1E21] tracking-tight">
            {trip.cargoType}
          </h2>
          <p className="text-xs text-[#6E737B] mt-0.5 flex items-center gap-2">
            <span>{trip.equipment}</span>
            <span>•</span>
            <span className="font-mono text-[#1C1E21]">{trip.weight}</span>
          </p>
        </div>

        {/* Route Visualizer Timeline */}
        <div className="relative pl-6 py-1 my-3 border-l-2 border-dashed border-[#34785D]/30 space-y-4">
          {/* Pickup Point */}
          <div className="relative">
            <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#FFFFFF] border-2 border-[#34785D] flex items-center justify-center shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34785D]" />
            </span>
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] font-semibold text-[#6E737B] uppercase tracking-wider">
                Pickup Facility
              </p>
              <span className="text-[11px] font-mono text-[#34785D] font-semibold">
                {trip.origin.appointmentTime}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#1C1E21]">{trip.origin.facility}</p>
            <p className="text-[11px] text-[#6E737B] truncate">{trip.origin.address}</p>
          </div>

          {/* Delivery Point */}
          <div className="relative">
            <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#FFFFFF] border-2 border-[#6E737B] flex items-center justify-center shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6E737B]" />
            </span>
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] font-semibold text-[#6E737B] uppercase tracking-wider">
                Destination
              </p>
              <span className="text-[11px] font-mono text-[#34785D] font-semibold">
                {trip.destination.appointmentTime}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#1C1E21]">{trip.destination.consignee}</p>
            <p className="text-[11px] text-[#6E737B] truncate">{trip.destination.address}</p>
          </div>
        </div>

        {/* Trip Distance & ETA Grid */}
        <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-2xl bg-[#F7F8F6] border border-[#E1E6E2] text-center">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#6E737B]">Distance</span>
            <p className="text-sm font-bold text-[#1C1E21] font-mono mt-0.5">
              {trip.metrics.totalDistanceMi} mi
            </p>
          </div>
          <div className="border-x border-[#E1E6E2]">
            <span className="text-[10px] uppercase font-semibold text-[#6E737B]">Est. Time</span>
            <p className="text-sm font-bold text-[#1C1E21] font-mono mt-0.5">
              {trip.metrics.estimatedHours}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#6E737B]">Live ETA</span>
            <p className="text-sm font-bold text-[#34785D] font-mono mt-0.5">
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
                className="flex-1 h-12 rounded-2xl bg-[#34785D] hover:bg-[#2C644E] text-white font-bold text-sm tracking-wide shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4 fill-white" />
                NAVIGATE TRIP
              </Button>
              <Button
                type="button"
                onClick={onOpenPickupFlow}
                variant="outline"
                className="h-12 px-4 rounded-2xl bg-[#FFFFFF] hover:bg-[#E8F4EE] border-[#E1E6E2] text-[#34785D] font-bold text-xs active:scale-95"
              >
                At Dock
              </Button>
            </div>
          )}

          {trip.status === 'AT_PICKUP' || trip.status === 'CHECKING_IN_PICKUP' || trip.status === 'LOADING' ? (
            <Button
              type="button"
              onClick={onOpenPickupFlow}
              className="w-full h-12 rounded-2xl bg-[#34785D] hover:bg-[#2C644E] text-white font-bold text-sm shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
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
                className="flex-1 h-12 rounded-2xl bg-[#34785D] hover:bg-[#2C644E] text-white font-bold text-sm shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4 fill-white" />
                LIVE NAVIGATION (IN TRANSIT)
              </Button>
              <Button
                type="button"
                onClick={onOpenDeliveryFlow}
                variant="outline"
                className="h-12 px-4 rounded-2xl bg-[#FFFFFF] hover:bg-[#E8F4EE] border-[#E1E6E2] text-[#34785D] font-bold text-xs active:scale-95"
              >
                Arrive Dest
              </Button>
            </div>
          )}

          {trip.status === 'AT_DELIVERY' || trip.status === 'UNLOADING' || trip.status === 'DELIVERED_POD_PENDING' ? (
            <Button
              type="button"
              onClick={onOpenDeliveryFlow}
              className="w-full h-12 rounded-2xl bg-[#34785D] hover:bg-[#2C644E] text-white font-bold text-sm shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              COMPLETE DELIVERY & POD
            </Button>
          ) : null}
        </div>
      </div>

      {/* ── TODAY'S OPERATIONAL SUMMARY ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <span className="text-[10px] font-semibold text-[#6E737B] uppercase tracking-wider">
            Deliveries
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-extrabold text-[#1C1E21] font-mono">1</span>
            <span className="text-xs text-[#6E737B] font-mono">/ 3 total</span>
          </div>
          <span className="text-[10px] text-[#34785D] font-semibold block mt-0.5">
            2 Remaining
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <span className="text-[10px] font-semibold text-[#6E737B] uppercase tracking-wider">
            Total Distance
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-extrabold text-[#1C1E21] font-mono">480</span>
            <span className="text-xs text-[#6E737B] font-mono">mi</span>
          </div>
          <span className="text-[10px] text-[#6E737B] font-semibold block mt-0.5">
            368 mi to go
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <span className="text-[10px] font-semibold text-[#6E737B] uppercase tracking-wider">
            Est. Earnings
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-extrabold text-[#34785D] font-mono">$1,420</span>
          </div>
          <span className="text-[10px] text-[#34785D] font-semibold block mt-0.5">
            +$35 on-time bonus
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <span className="text-[10px] font-semibold text-[#6E737B] uppercase tracking-wider">
            Safety Score
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-extrabold text-[#1C1E21] font-mono">
              {profile.safetyScore}%
            </span>
          </div>
          <span className="text-[10px] text-[#34785D] font-semibold block mt-0.5">
            Tier 1 Driver
          </span>
        </div>
      </div>

      {/* ── LIVE INTERACTIVE MAP CARD (MINT CANVAS) ── */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E1E6E2] p-3.5 shadow-[0_4px_20px_-2px_rgba(28,30,33,0.04)] relative overflow-hidden">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#34785D] animate-ping" />
            <span className="text-xs font-bold text-[#1C1E21] uppercase tracking-wider">
              Live Route Radar
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#6E737B]">
            GPS: 34.015° N, 118.170° W
          </span>
        </div>

          {/* Real Mini MapLibre Map */}
          <div
            role="button"
            tabIndex={0}
            onClick={onStartTrip}
            onKeyDown={(e) => e.key === 'Enter' && onStartTrip()}
            className="relative h-44 w-full rounded-2xl overflow-hidden border border-[#E1E6E2] cursor-pointer group shadow-sm focus:outline-none focus:ring-2 focus:ring-[#34785D]"
          >
            <Map
              theme="light"
              center={[-115.2, 33.5]}
              zoom={5}
              interactive={false}
              className="h-full w-full"
            >
              <MapRoute
                coordinates={FULL_ROUTE_COORDS}
                color="#34785D"
                width={3}
                opacity={0.9}
              />
              {/* Origin: LA */}
              <MapMarker longitude={-118.2437} latitude={34.0522}>
                <MarkerContent>
                  <div className="w-3 h-3 bg-[#34785D] rounded-full border-2 border-white shadow-sm" />
                </MarkerContent>
              </MapMarker>
              {/* Current position */}
              <MapMarker longitude={-115.5514} latitude={32.7254}>
                <MarkerContent>
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[#34785D] animate-ping opacity-40 scale-150" />
                    <div className="relative w-5 h-5 bg-[#34785D] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <Navigation className="w-2.5 h-2.5 text-white fill-white" />
                    </div>
                  </div>
                </MarkerContent>
              </MapMarker>
              {/* Destination: Phoenix */}
              <MapMarker longitude={-112.074} latitude={33.4484}>
                <MarkerContent>
                  <div className="w-3 h-3 bg-[#6E737B] rounded-full border-2 border-white shadow-sm" />
                </MarkerContent>
              </MapMarker>
            </Map>

            {/* Overlay badges */}
            <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E1E6E2] text-[11px] font-semibold text-[#1C1E21] flex items-center gap-1.5 shadow-sm pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34785D] animate-pulse" />
              <span>Traffic Normal (I-10 E)</span>
            </div>

            <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E1E6E2] text-xs font-semibold text-[#1C1E21] flex items-center gap-2 group-hover:border-[#34785D] transition-colors shadow-sm pointer-events-none">
              <Navigation className="w-3.5 h-3.5 text-[#34785D] fill-[#34785D]" />
              <span>Tap to Expand Full Navigation</span>
            </div>
          </div>
      </div>

      {/* ── RAPID DISPATCHER QUICK-CONTACT BAR ── */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#E8F4EE] border border-[#34785D]/20 flex items-center justify-center text-[#34785D] font-bold text-xs">
            MV
          </div>
          <div>
            <p className="text-xs font-bold text-[#1C1E21]">Dispatcher Marcus Vance</p>
            <p className="text-[11px] text-[#6E737B]">Fleet Control · Standby</p>
          </div>
        </div>
        <Button
          type="button"
          onClick={onOpenDispatcherChat}
          size="sm"
          className="rounded-xl bg-[#F7F8F6] hover:bg-[#E8F4EE] hover:text-[#34785D] border border-[#E1E6E2] text-xs font-bold text-[#1C1E21] active:scale-95 transition-colors"
        >
          Quick Chat
        </Button>
      </div>
    </div>
  );
}
