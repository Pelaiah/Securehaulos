'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Phone,
  AlertOctagon,
  MessageSquare,
  Navigation,
  Compass,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Layers,
  Fuel,
  Coffee,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Thermometer,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DriverTrip } from './types';
import { cn } from '@/lib/utils';
import { Map, MapRoute, MapMarker, MarkerContent } from '@/components/ui/map';

// Active trip route: mid-point between LA and Phoenix (driver is on I-10)
const ACTIVE_ROUTE_COORDS: [number, number][] = [
  [-115.5514, 32.7254], // current position (Blythe area)
  [-114.6277, 32.7157],
  [-113.5528, 33.0745],
  [-112.4737, 33.4484],
  [-112.0740, 33.4484], // Phoenix
];
const DRIVER_POSITION: [number, number] = [-115.5514, 32.7254];

interface DriverActiveTripModeProps {
  trip: DriverTrip;
  onExitNav: () => void;
  onProceedToPickup: () => void;
  onProceedToDelivery: () => void;
  onOpenDispatcherChat: () => void;
  onTriggerEmergency: () => void;
}

export function DriverActiveTripMode({
  trip,
  onExitNav,
  onProceedToPickup,
  onProceedToDelivery,
  onOpenDispatcherChat,
  onTriggerEmergency,
}: DriverActiveTripModeProps) {
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [speed, setSpeed] = useState(trip.metrics.speedMph);
  const [isSosConfirmOpen, setIsSosConfirmOpen] = useState(false);

  // Speedometer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(58, Math.min(65, prev + delta));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isHeadingToPickup = trip.status === 'NAVIGATING_TO_PICKUP';
  const targetLocation = isHeadingToPickup ? trip.origin : trip.destination;

  return (
    <div className="relative w-full h-[calc(100vh-4.5rem)] max-w-lg mx-auto bg-[#F7F8F6] text-[#1C1E21] font-sans overflow-hidden flex flex-col select-none rounded-3xl border border-[#E1E6E2] shadow-xl">
      {/* ── TOP HUD GLASS OVERLAY ── */}
      <div className="absolute top-3 inset-x-3 z-30 flex flex-col gap-2 pointer-events-none">
        {/* Top Controls Bar */}
        <div className="pointer-events-auto flex items-center justify-between px-3 py-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#E1E6E2] shadow-sm">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExitNav}
              className="p-1.5 rounded-xl bg-[#F7F8F6] hover:bg-[#E8F4EE] text-[#1C1E21] active:scale-95 transition-colors border border-[#E1E6E2]"
              aria-label="Back to Cockpit"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34785D] animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-[#34785D] uppercase tracking-wider">
                  {trip.loadNumber}
                </span>
              </div>
              <p className="text-xs font-bold text-[#1C1E21] leading-none mt-0.5">
                {isHeadingToPickup ? 'To Pickup Facility' : 'In Transit · Delivery'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {trip.temperature && (
              <Badge
                variant="outline"
                className="bg-[#E8F4EE] border-[#34785D]/20 text-[#34785D] font-mono text-[10px] py-0.5 px-2 flex items-center gap-1"
              >
                <Thermometer className="w-3 h-3 text-[#34785D]" />
                -4°F
              </Badge>
            )}

            <button
              type="button"
              onClick={() => setIsVoiceMuted(!isVoiceMuted)}
              className="p-2 rounded-xl bg-[#F7F8F6] hover:bg-[#E8F4EE] text-[#1C1E21] active:scale-95 transition-colors border border-[#E1E6E2]"
              aria-label="Toggle Voice Guidance"
            >
              {isVoiceMuted ? (
                <VolumeX className="w-4 h-4 text-[#6E737B]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#34785D]" />
              )}
            </button>
          </div>
        </div>

        {/* Turn-by-Turn Instruction Banner */}
        <div className="pointer-events-auto p-3.5 rounded-2xl bg-white/95 backdrop-blur-2xl border border-[#E1E6E2] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#34785D] text-white flex items-center justify-center shadow-sm flex-shrink-0">
              <Navigation className="w-6 h-6 rotate-45 fill-white" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#1C1E21] leading-tight">
                {trip.metrics.nextManeuver.instruction}
              </p>
              <p className="text-xs font-mono font-bold text-[#34785D] mt-0.5">
                In {trip.metrics.nextManeuver.distance} · Next: Stay in 2 Right Lanes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── REAL FULLSCREEN MAP ── */}
      <div className="relative flex-1 w-full overflow-hidden">
        <Map
          theme="light"
          center={[-113.8, 33.1]}
          zoom={7}
          interactive={false}
          className="h-full w-full"
        >
          {/* Remaining route to Phoenix */}
          <MapRoute
            coordinates={ACTIVE_ROUTE_COORDS}
            color="#34785D"
            width={5}
            opacity={0.95}
          />

          {/* Current driver position marker */}
          <MapMarker longitude={DRIVER_POSITION[0]} latitude={DRIVER_POSITION[1]}>
            <MarkerContent>
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#34785D] animate-ping opacity-40 scale-150" />
                <div className="relative w-8 h-8 bg-[#34785D] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <Navigation className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
            </MarkerContent>
          </MapMarker>

          {/* Phoenix destination */}
          <MapMarker longitude={-112.074} latitude={33.4484}>
            <MarkerContent>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-[#34785D] rounded-full border-2 border-white shadow-md" />
                <span className="mt-1 text-[9px] font-bold text-[#1C1E21] bg-white/90 border border-[#E1E6E2] px-1.5 py-0.5 rounded-md whitespace-nowrap">Phoenix</span>
              </div>
            </MarkerContent>
          </MapMarker>
        </Map>

        {/* Speedometer Widget HUD (Floating Bottom Left, over map) */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 pointer-events-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#E1E6E2] shadow-sm flex items-center justify-center">
            <div className="text-center">
              <span className="text-2xl font-black font-mono text-[#1C1E21] leading-none">
                {speed}
              </span>
              <span className="text-[10px] font-mono text-[#6E737B] block">MPH</span>
            </div>
          </div>

          {/* Speed Limit Sign */}
          <div className="w-10 h-12 rounded-lg bg-white text-slate-900 border-2 border-slate-900 shadow-sm flex flex-col items-center justify-center leading-none">
            <span className="text-[7px] font-black tracking-tighter uppercase">SPEED</span>
            <span className="text-[7px] font-black tracking-tighter uppercase">LIMIT</span>
            <span className="text-xs font-black font-mono mt-0.5">{trip.metrics.speedLimitMph}</span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM FLOATING GLASS PANEL & OPERATIONAL ACTIONS ── */}
      <div className="relative z-30 p-3 bg-white/95 backdrop-blur-2xl border-t border-[#E1E6E2] shadow-[0_-10px_25px_rgba(28,30,33,0.06)] flex flex-col gap-2.5">
        {/* ETA & Distance Summary */}
        <div className="grid grid-cols-3 gap-2 px-2 py-1 text-center">
          <div>
            <span className="text-[10px] font-semibold text-[#6E737B] uppercase">Remaining</span>
            <p className="text-sm font-bold text-[#1C1E21] font-mono">
              {trip.metrics.remainingDistanceMi} mi
            </p>
          </div>
          <div className="border-x border-[#E1E6E2]">
            <span className="text-[10px] font-semibold text-[#6E737B] uppercase">ETA</span>
            <p className="text-sm font-extrabold text-[#34785D] font-mono">{trip.metrics.eta}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-[#6E737B] uppercase">Destination</span>
            <p className="text-xs font-bold text-[#1C1E21] truncate px-1">
              {'facility' in targetLocation ? targetLocation.facility : targetLocation.consignee}
            </p>
          </div>
        </div>

        {/* Primary Action Button (Large Touch Target) */}
        {isHeadingToPickup ? (
          <Button
            type="button"
            onClick={onProceedToPickup}
            className="w-full h-12 rounded-2xl bg-[#34785D] hover:bg-[#2C644E] text-white font-extrabold text-sm tracking-wider shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-5 h-5 fill-white" />
            ARRIVED AT PICKUP FACILITY (CHECK IN)
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onProceedToDelivery}
            className="w-full h-12 rounded-2xl bg-[#34785D] hover:bg-[#2C644E] text-white font-extrabold text-sm tracking-wider shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            ARRIVED AT DELIVERY CONSIGNEE
          </Button>
        )}

        {/* Secondary Quick Actions (Dispatch, Issue, Emergency) */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onOpenDispatcherChat}
            className="h-10 rounded-xl bg-[#F7F8F6] hover:bg-[#E8F4EE] hover:text-[#34785D] border border-[#E1E6E2] text-xs font-bold text-[#1C1E21] flex items-center justify-center gap-1.5 active:scale-95 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#34785D]" />
            Dispatcher
          </button>

          <button
            type="button"
            onClick={onOpenDispatcherChat}
            className="h-10 rounded-xl bg-[#F7F8F6] hover:bg-[#E8F4EE] border border-[#E1E6E2] text-xs font-bold text-[#1C1E21] flex items-center justify-center gap-1.5 active:scale-95 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#34785D]" />
            Report Delay
          </button>

          <button
            type="button"
            onClick={() => setIsSosConfirmOpen(true)}
            className="h-10 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-red-600 flex items-center justify-center gap-1.5 active:scale-95 transition-colors"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
            SOS / 911
          </button>
        </div>
      </div>

      {/* SOS Emergency Modal Confirmation */}
      {isSosConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#FFFFFF] border border-red-200 p-5 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1C1E21]">Trigger Emergency SOS?</h3>
              <p className="text-xs text-[#6E737B] mt-1">
                This will immediately transmit your exact GPS coordinates to Fleet Dispatch, Law Enforcement, and Roadside Rescue.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsSosConfirmOpen(false)}
                className="flex-1 rounded-xl bg-transparent border-[#E1E6E2] text-[#1C1E21]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsSosConfirmOpen(false);
                  onTriggerEmergency();
                }}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                CONFIRM SOS
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
