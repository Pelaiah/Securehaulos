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
    <div className="relative w-full h-[calc(100vh-4.5rem)] max-w-lg mx-auto bg-[#07080C] text-slate-100 font-sans overflow-hidden flex flex-col select-none rounded-3xl border border-white/[0.08] shadow-2xl">
      {/* ── TOP HUD GLASS OVERLAY ── */}
      <div className="absolute top-3 inset-x-3 z-30 flex flex-col gap-2 pointer-events-none">
        {/* Top Controls Bar */}
        <div className="pointer-events-auto flex items-center justify-between px-3 py-2 rounded-2xl bg-[#0E1015]/90 backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExitNav}
              className="p-1.5 rounded-xl bg-[#1C1F2B] hover:bg-[#252A3B] text-slate-300 active:scale-95 transition-colors"
              aria-label="Back to Cockpit"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-[#FF6B00] uppercase tracking-wider">
                  {trip.loadNumber}
                </span>
              </div>
              <p className="text-xs font-bold text-white leading-none mt-0.5">
                {isHeadingToPickup ? 'To Pickup Facility' : 'In Transit · Delivery'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {trip.temperature && (
              <Badge
                variant="outline"
                className="bg-[#121622] border-sky-500/30 text-sky-400 font-mono text-[10px] py-0.5 px-2 flex items-center gap-1"
              >
                <Thermometer className="w-3 h-3 text-sky-400" />
                -4°F
              </Badge>
            )}

            <button
              type="button"
              onClick={() => setIsVoiceMuted(!isVoiceMuted)}
              className="p-2 rounded-xl bg-[#1C1F2B] hover:bg-[#252A3B] text-slate-300 active:scale-95 transition-colors"
              aria-label="Toggle Voice Guidance"
            >
              {isVoiceMuted ? (
                <VolumeX className="w-4 h-4 text-slate-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#FF6B00]" />
              )}
            </button>
          </div>
        </div>

        {/* Turn-by-Turn Instruction Banner */}
        <div className="pointer-events-auto p-3.5 rounded-2xl bg-gradient-to-r from-[#171B27]/95 via-[#1E2333]/95 to-[#171B27]/95 backdrop-blur-2xl border border-[#FF6B00]/30 shadow-[0_10px_30px_rgba(0,0,0,0.7)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6B00] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(255,107,0,0.5)] flex-shrink-0">
              <Navigation className="w-6 h-6 rotate-45 fill-white" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-white leading-tight">
                {trip.metrics.nextManeuver.instruction}
              </p>
              <p className="text-xs font-mono font-bold text-[#FF6B00] mt-0.5">
                In {trip.metrics.nextManeuver.distance} · Next: Stay in 2 Right Lanes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── REALISTIC FULLSCREEN MAP SURFACE ── */}
      <div className="relative flex-1 w-full h-full bg-[#090B0F] overflow-hidden">
        {/* Vector Dark Road Navigation Scene */}
        <svg
          viewBox="0 0 500 800"
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="navRouteGlow" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FF4400" />
              <stop offset="50%" stopColor="#FF7700" />
              <stop offset="100%" stopColor="#FFAA00" />
            </linearGradient>
            <filter id="roadGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Realistic Dark Asphalt Background */}
          <rect width="500" height="800" fill="#0A0D14" />

          {/* District Landmasses & Blocks */}
          <path d="M40 50 L200 40 L180 220 L30 200 Z" fill="#10141F" />
          <path d="M300 80 L480 60 L470 300 L280 260 Z" fill="#10141F" />
          <path d="M20 320 L160 300 L140 540 L10 500 Z" fill="#10141F" />
          <path d="M320 380 L490 350 L480 650 L310 620 Z" fill="#10141F" />

          {/* Minor Grids & Streets */}
          <path d="M0 150 L500 120" stroke="#161B29" strokeWidth="4" />
          <path d="M0 290 L500 270" stroke="#161B29" strokeWidth="4" />
          <path d="M0 450 L500 430" stroke="#161B29" strokeWidth="4" />
          <path d="M0 600 L500 580" stroke="#161B29" strokeWidth="4" />
          <path d="M120 0 L100 800" stroke="#161B29" strokeWidth="4" />
          <path d="M380 0 L360 800" stroke="#161B29" strokeWidth="4" />

          {/* Major Interstate Highway (I-10 East) */}
          <path
            d="M250 800 C240 600 270 420 230 280 C190 140 310 80 340 0"
            stroke="#1C2333"
            strokeWidth="32"
            fill="none"
            strokeLinecap="round"
          />
          {/* Lane Divider Dashes */}
          <path
            d="M250 800 C240 600 270 420 230 280 C190 140 310 80 340 0"
            stroke="#343E56"
            strokeWidth="2"
            strokeDasharray="12 12"
            fill="none"
          />

          {/* Active Navigation Route (Vibrant Glowing Orange Ribbon) */}
          <path
            d="M250 800 C240 600 270 420 230 280 C190 140 310 80 340 0"
            stroke="url(#navRouteGlow)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            filter="url(#roadGlow)"
          />

          {/* Destination Marker at Top */}
          <g transform="translate(340, 60)">
            <circle cx="0" cy="0" r="16" fill="#10B981" opacity="0.3" className="animate-ping" />
            <circle cx="0" cy="0" r="10" fill="#10B981" />
            <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
            <rect x="-60" y="-32" width="120" height="22" rx="6" fill="#0E1015" stroke="#10B981" strokeWidth="1" />
            <text x="0" y="-18" fill="#10B981" fontSize="9" fontWeight="bold" textAnchor="middle">
              {isHeadingToPickup ? 'DOCK 14 (APEX)' : 'PHOENIX RECV'}
            </text>
          </g>

          {/* Live Semi-Truck GPS Marker with Field of View / Heading */}
          <g transform="translate(252, 540)">
            {/* Radar Field of View Cone */}
            <path
              d="M0 0 L-45 -120 L45 -120 Z"
              fill="url(#navRouteGlow)"
              opacity="0.15"
            />
            {/* Outer Pulse */}
            <circle cx="0" cy="0" r="28" fill="#FF6B00" opacity="0.25" className="animate-ping" />
            {/* Glowing Truck Base */}
            <circle cx="0" cy="0" r="14" fill="#0E1015" stroke="#FF6B00" strokeWidth="3" />
            <polygon points="0,-9 7,7 -7,7" fill="#FF6B00" />
          </g>
        </svg>

        {/* Floating Quick Waypoints (Fuel, Rest Stop, Scales) */}
        <div className="absolute right-3 top-48 flex flex-col gap-2 z-20">
          <button
            type="button"
            className="w-10 h-10 rounded-2xl bg-[#0E1015]/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-amber-400 active:scale-95 shadow-lg"
            title="Nearest Diesel Fuel"
          >
            <Fuel className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-10 h-10 rounded-2xl bg-[#0E1015]/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-sky-400 active:scale-95 shadow-lg"
            title="Truck Stop / Rest Area"
          >
            <Coffee className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-10 h-10 rounded-2xl bg-[#0E1015]/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-emerald-400 active:scale-95 shadow-lg"
            title="Weigh Station Open"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* Speedometer & Speed Limit HUD (Bottom-Left) */}
        <div className="absolute left-4 bottom-56 z-20 flex items-end gap-2">
          {/* Speedometer */}
          <div className="px-3.5 py-2 rounded-2xl bg-[#0E1015]/95 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Speed
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-black font-mono text-white leading-none">
                {speed}
              </span>
              <span className="text-[10px] font-mono text-slate-400">MPH</span>
            </div>
          </div>

          {/* Speed Limit Sign */}
          <div className="w-10 h-12 rounded-lg bg-white text-slate-900 border-2 border-slate-900 shadow-xl flex flex-col items-center justify-center leading-none">
            <span className="text-[7px] font-black tracking-tighter uppercase">SPEED</span>
            <span className="text-[7px] font-black tracking-tighter uppercase">LIMIT</span>
            <span className="text-xs font-black font-mono mt-0.5">{trip.metrics.speedLimitMph}</span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM FLOATING GLASS PANEL & OPERATIONAL ACTIONS ── */}
      <div className="relative z-30 p-3 bg-gradient-to-t from-[#090B0F] via-[#0E1015]/95 to-[#0E1015]/80 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-15px_35px_rgba(0,0,0,0.8)] flex flex-col gap-2.5">
        {/* ETA & Distance Summary */}
        <div className="grid grid-cols-3 gap-2 px-2 py-1 text-center">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Remaining</span>
            <p className="text-sm font-bold text-white font-mono">
              {trip.metrics.remainingDistanceMi} mi
            </p>
          </div>
          <div className="border-x border-white/[0.08]">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">ETA</span>
            <p className="text-sm font-extrabold text-[#FF6B00] font-mono">{trip.metrics.eta}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Destination</span>
            <p className="text-xs font-bold text-white truncate px-1">
              {'facility' in targetLocation ? targetLocation.facility : targetLocation.consignee}
            </p>
          </div>
        </div>

        {/* Primary Action Button (Large Touch Target) */}
        {isHeadingToPickup ? (
          <Button
            type="button"
            onClick={onProceedToPickup}
            className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#FF7700] hover:from-[#FF6600] hover:to-[#FF8800] text-white font-extrabold text-sm tracking-wider shadow-[0_8px_25px_rgba(255,107,0,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-5 h-5 fill-white" />
            ARRIVED AT PICKUP FACILITY (CHECK IN)
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onProceedToDelivery}
            className="w-full h-13 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-sm tracking-wider shadow-[0_8px_25px_rgba(16,185,129,0.45)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
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
            className="h-10 rounded-xl bg-[#181B26] hover:bg-[#202534] border border-white/10 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 active:scale-95 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#FF6B00]" />
            Dispatcher
          </button>

          <button
            type="button"
            onClick={onOpenDispatcherChat}
            className="h-10 rounded-xl bg-[#181B26] hover:bg-[#202534] border border-white/10 text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5 active:scale-95 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            Report Delay
          </button>

          <button
            type="button"
            onClick={() => setIsSosConfirmOpen(true)}
            className="h-10 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-xs font-bold text-red-400 flex items-center justify-center gap-1.5 active:scale-95 transition-colors"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
            SOS / 911
          </button>
        </div>
      </div>

      {/* SOS Emergency Modal Confirmation */}
      {isSosConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#151722] border border-red-500/50 p-5 shadow-[0_0_50px_rgba(239,68,68,0.4)] text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500 text-red-500 flex items-center justify-center mx-auto animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Trigger Emergency SOS?</h3>
              <p className="text-xs text-slate-300 mt-1">
                This will immediately transmit your exact GPS coordinates to Fleet Dispatch, Law Enforcement, and Roadside Rescue.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsSosConfirmOpen(false)}
                className="flex-1 rounded-xl bg-transparent border-white/10 text-slate-300"
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
