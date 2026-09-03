'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Navigation,
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Radio,
  MapPin,
  Shield,
  Clock,
  Gauge,
  Thermometer,
  Zap,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MapVehicle {
  id: string;
  name: string;
  plate: string;
  driver: string;
  avatar?: string;
  lat: number;
  lng: number;
  xPercent: number; // 0 - 100 on canvas
  yPercent: number; // 0 - 100 on canvas
  speed: number;
  heading: number; // degrees
  status: 'In Transit' | 'At Dock' | 'Delayed' | 'Maintenance';
  batteryOrFuel: number;
  temp?: string;
  routeProgress: number; // 0 - 100
  currentCity: string;
  destinationCity: string;
  eta: string;
}

export interface MapWaypoint {
  id: string;
  name: string;
  city: string;
  xPercent: number;
  yPercent: number;
  type: 'hub' | 'pickup' | 'dropoff' | 'service';
  completed?: boolean;
}

interface MapCNProps {
  vehicles?: MapVehicle[];
  selectedVehicleId?: string | null;
  onSelectVehicle?: (vehicle: MapVehicle) => void;
  waypoints?: MapWaypoint[];
  showRadar?: boolean;
  showTelemetryHUD?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
  height?: string | number;
}

const DEFAULT_VEHICLES: MapVehicle[] = [
  {
    id: 'TR-401',
    name: 'Actros Edition 2',
    plate: 'ADL4681',
    driver: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    lat: 34.0522,
    lng: -118.2437,
    xPercent: 28,
    yPercent: 44,
    speed: 68,
    heading: 45,
    status: 'In Transit',
    batteryOrFuel: 84,
    temp: '-4.2°C',
    routeProgress: 64,
    currentCity: 'Barstow, CA',
    destinationCity: 'Phoenix, AZ',
    eta: '2h 18m',
  },
  {
    id: 'TR-402',
    name: 'Scania R Series',
    plate: 'SCN9022',
    driver: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    lat: 36.1699,
    lng: -115.1398,
    xPercent: 62,
    yPercent: 32,
    speed: 72,
    heading: 90,
    status: 'In Transit',
    batteryOrFuel: 91,
    temp: '2.0°C',
    routeProgress: 42,
    currentCity: 'Las Vegas, NV',
    destinationCity: 'Salt Lake City, UT',
    eta: '4h 05m',
  },
  {
    id: 'TR-403',
    name: 'Volvo FH16 Aero',
    plate: 'VLV1044',
    driver: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lat: 33.4484,
    lng: -112.074,
    xPercent: 78,
    yPercent: 72,
    speed: 0,
    heading: 180,
    status: 'At Dock',
    batteryOrFuel: 68,
    temp: '-18.0°C',
    routeProgress: 98,
    currentCity: 'Phoenix Gateway',
    destinationCity: 'Distribution Hub 4',
    eta: 'Arrived',
  },
  {
    id: 'TR-404',
    name: 'MAN TGX Prime',
    plate: 'MAN8819',
    driver: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    lat: 37.7749,
    lng: -122.4194,
    xPercent: 18,
    yPercent: 22,
    speed: 61,
    heading: 120,
    status: 'In Transit',
    batteryOrFuel: 76,
    temp: '4.5°C',
    routeProgress: 31,
    currentCity: 'San Jose, CA',
    destinationCity: 'Bakersfield, CA',
    eta: '3h 40m',
  },
];

const DEFAULT_WAYPOINTS: MapWaypoint[] = [
  { id: 'w1', name: 'Port of Los Angeles', city: 'Los Angeles', xPercent: 18, yPercent: 62, type: 'pickup', completed: true },
  { id: 'w2', name: 'Inland Hub 09', city: 'Riverside', xPercent: 26, yPercent: 54, type: 'hub', completed: true },
  { id: 'w3', name: 'Mojave Gateway', city: 'Barstow', xPercent: 36, yPercent: 42, type: 'service', completed: false },
  { id: 'w4', name: 'Apex Central', city: 'Needles', xPercent: 54, yPercent: 48, type: 'hub', completed: false },
  { id: 'w5', name: 'Valley Logistics Metro', city: 'Phoenix', xPercent: 82, yPercent: 74, type: 'dropoff', completed: false },
];

export function MapCN({
  vehicles = DEFAULT_VEHICLES,
  selectedVehicleId,
  onSelectVehicle,
  waypoints = DEFAULT_WAYPOINTS,
  showRadar = true,
  showTelemetryHUD = true,
  theme = 'dark',
  className,
  height = '100%',
}: MapCNProps) {
  const [activeVehicle, setActiveVehicle] = useState<MapVehicle | null>(null);
  const [zoom, setZoom] = useState(1);
  const [activeLayer, setActiveLayer] = useState<'logistics' | 'satellite' | 'heatmap'>('logistics');
  const [radarAngle, setRadarAngle] = useState(0);
  const [liveTicks, setLiveTicks] = useState(0);

  // Sync selectedVehicleId
  useEffect(() => {
    if (selectedVehicleId) {
      const found = vehicles.find((v) => v.id === selectedVehicleId);
      if (found) setActiveVehicle(found);
    } else if (!activeVehicle && vehicles.length > 0) {
      setActiveVehicle(vehicles[0]);
    }
  }, [selectedVehicleId, vehicles]);

  // Real-time animation loop for radar and slight vehicle jitter for live feel
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle((prev) => (prev + 3) % 360);
      setLiveTicks((prev) => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (v: MapVehicle) => {
    setActiveVehicle(v);
    onSelectVehicle?.(v);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'relative w-full rounded-2xl overflow-hidden select-none border transition-colors',
        isDark
          ? 'bg-[#090A0F] border-white/10 text-white shadow-2xl'
          : 'bg-[#EBF2FA] border-[#E5E7EB] text-[#0B0B0B] shadow-sm',
        className
      )}
      style={{ height }}
    >
      {/* ── VECTOR MAP CANVAS / BACKGROUND ── */}
      <div
        className="absolute inset-0 transition-transform duration-500 origin-center"
        style={{ transform: `scale(${zoom})` }}
      >
        <svg viewBox="0 0 1000 600" className="w-full h-full object-cover" preserveAspectRatio="none">
          <defs>
            {/* Grid pattern */}
            <pattern id="mapcn-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'}
                strokeWidth="1"
              />
            </pattern>

            {/* Glowing polyline filter */}
            <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#D97757" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            <radialGradient id="radarGrad">
              <stop offset="0%" stopColor="rgba(217, 119, 87, 0.25)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Base fill */}
          <rect width="1000" height="600" fill={isDark ? '#07080D' : '#EAF1F8'} />
          <rect width="1000" height="600" fill="url(#mapcn-grid)" />

          {/* Topographic / Regional land shapes */}
          <path
            d="M50,40 Q240,20 420,90 T780,110 T950,40 L980,560 Q700,580 400,520 Q120,540 20,490 Z"
            fill={isDark ? '#0D0F18' : '#DFE9F4'}
            opacity="0.8"
          />
          <path
            d="M120,180 Q320,140 540,220 T860,260 L920,480 Q640,510 320,440 Z"
            fill={isDark ? '#121522' : '#D4E2F0'}
            opacity="0.5"
          />

          {/* Secondary Interstate Highways (Grey Mesh) */}
          <path
            d="M 60,120 Q 300,160 550,110 T 940,160"
            fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'}
            strokeWidth="3"
          />
          <path
            d="M 120,540 Q 400,320 600,360 T 920,240"
            fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'}
            strokeWidth="3"
          />
          <path
            d="M 280,40 Q 340,300 240,560"
            fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'}
            strokeWidth="2.5"
          />
          <path
            d="M 720,40 Q 680,280 820,560"
            fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'}
            strokeWidth="2.5"
          />

          {/* Main Logistics Corridor (Glowing Active Route) */}
          <path
            d="M 180,372 Q 260,324 360,252 T 540,288 T 820,444"
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="4"
            strokeDasharray="8 4"
            filter="url(#glow-orange)"
            strokeLinecap="round"
          />

          {/* Radar scan cone centered on active vehicle */}
          {showRadar && activeVehicle && (
            <g transform={`translate(${(activeVehicle.xPercent / 100) * 1000}, ${(activeVehicle.yPercent / 100) * 600})`}>
              <circle r="70" fill="url(#radarGrad)" />
              <circle
                r="70"
                fill="none"
                stroke="#D97757"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.3"
              />
              {/* Radar sweep beam */}
              <line
                x1="0"
                y1="0"
                x2={70 * Math.cos((radarAngle * Math.PI) / 180)}
                y2={70 * Math.sin((radarAngle * Math.PI) / 180)}
                stroke="#D97757"
                strokeWidth="1.5"
                opacity="0.7"
              />
            </g>
          )}

          {/* Waypoint nodes */}
          {waypoints.map((wp) => {
            const cx = (wp.xPercent / 100) * 1000;
            const cy = (wp.yPercent / 100) * 600;
            return (
              <g key={wp.id} className="cursor-pointer">
                <circle
                  cx={cx}
                  cy={cy}
                  r="8"
                  fill={wp.completed ? '#10B981' : isDark ? '#1F2437' : '#FFFFFF'}
                  stroke={wp.completed ? '#10B981' : '#D97757'}
                  strokeWidth="2"
                />
                <circle cx={cx} cy={cy} r="3" fill={wp.completed ? '#FFFFFF' : '#D97757'} />
                <text
                  x={cx + 12}
                  y={cy + 4}
                  fill={isDark ? '#94A3B8' : '#475569'}
                  fontSize="11"
                  fontWeight="600"
                  letterSpacing="0.5"
                >
                  {wp.city}
                </text>
              </g>
            );
          })}
        </svg>

        {/* ── VEHICLE MARKERS (HTML OVERLAYS) ── */}
        {vehicles.map((v) => {
          const isSelected = activeVehicle?.id === v.id;
          return (
            <div
              key={v.id}
              onClick={() => handleSelect(v)}
              className="absolute cursor-pointer transition-all duration-300 z-10 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${v.xPercent}%`,
                top: `${v.yPercent}%`,
              }}
            >
              {/* Pulsing ring if active */}
              {isSelected && (
                <div className="absolute -inset-2 rounded-full bg-[#D97757]/30 animate-ping" />
              )}

              {/* Marker pin */}
              <div
                className={cn(
                  'relative flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-xl transition-all duration-200 backdrop-blur-md',
                  isSelected
                    ? 'bg-[#D97757] text-white border-white scale-110 shadow-[0_0_20px_rgba(217,119,87,0.6)]'
                    : isDark
                    ? 'bg-[#131622]/90 text-white/90 border-white/15 hover:border-[#D97757]/60 hover:scale-105'
                    : 'bg-white/90 text-[#0B0B0B] border-[#CBD5E1] hover:border-[#D97757] hover:scale-105'
                )}
              >
                {/* Heading Arrow or Status dot */}
                <div
                  className={cn(
                    'w-4 h-4 rounded-full flex items-center justify-center',
                    isSelected ? 'bg-white text-[#D97757]' : 'bg-[#D97757] text-white'
                  )}
                  style={{ transform: `rotate(${v.heading}deg)` }}
                >
                  <Navigation className="w-2.5 h-2.5 fill-current" />
                </div>

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-black tracking-tight">{v.plate}</span>
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        v.status === 'In Transit'
                          ? 'bg-[#10B981]'
                          : v.status === 'At Dock'
                          ? 'bg-[#3B82F6]'
                          : 'bg-[#F59E0B]'
                      )}
                    />
                  </div>
                  <span className="text-[8px] opacity-80 leading-none">{v.speed} km/h</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── TOP GLASS CONTROLS BAR (mapcn style) ── */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-none">
        {/* Left: Live Status Pill */}
        <div
          className={cn(
            'pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-xl border text-xs shadow-lg transition-all',
            isDark
              ? 'bg-[#0B0C12]/80 border-white/10 text-white'
              : 'bg-white/85 border-[#E5E7EB] text-[#0B0B0B]'
          )}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-bold tracking-wider uppercase text-[10px]">Real-Time GPS Feed</span>
          </div>
          <div className="w-px h-3 bg-white/20" />
          <span className="text-[10px] font-mono opacity-70">
            {vehicles.length} Units Active · 100% Signal
          </span>
        </div>

        {/* Right: Layer / Zoom Controls */}
        <div
          className={cn(
            'pointer-events-auto flex items-center gap-1 p-1 rounded-xl backdrop-blur-xl border shadow-lg',
            isDark
              ? 'bg-[#0B0C12]/80 border-white/10 text-white'
              : 'bg-white/85 border-[#E5E7EB] text-[#0B0B0B]'
          )}
        >
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
            aria-label="Zoom In"
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.8, z - 0.15))}
            aria-label="Zoom Out"
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-white/10 mx-0.5" />
          <button
            type="button"
            onClick={() => setZoom(1)}
            aria-label="Reset View"
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ── FLOATING TELEMETRY HUD CARD (mapcn glass telemetry card) ── */}
      {showTelemetryHUD && activeVehicle && (
        <div className="absolute bottom-3 left-3 z-20 pointer-events-none max-w-sm w-[calc(100%-24px)] md:w-80">
          <div
            className={cn(
              'pointer-events-auto p-3.5 rounded-2xl backdrop-blur-2xl border shadow-2xl transition-all duration-300',
              isDark
                ? 'bg-[#0E101A]/85 border-white/15 text-white'
                : 'bg-white/90 border-[#E2E8F0] text-[#0B0B0B]'
            )}
          >
            {/* Header: Truck Info */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#D97757] flex items-center justify-center text-white font-black text-[11px] shadow-sm">
                  {activeVehicle.plate.slice(0, 3)}
                </div>
                <div>
                  <h4 className="text-[13px] font-black tracking-tight leading-tight">
                    {activeVehicle.name}
                  </h4>
                  <p className="text-[10px] text-[#64748B] font-semibold">
                    {activeVehicle.plate} · Driver: {activeVehicle.driver}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-lg text-[9px] font-black tracking-wider uppercase',
                  activeVehicle.status === 'In Transit'
                    ? 'bg-[#10B981]/20 text-[#10B981]'
                    : activeVehicle.status === 'At Dock'
                    ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                    : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                )}
              >
                {activeVehicle.status}
              </span>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-3 gap-1.5 py-2.5">
              <div
                className={cn(
                  'p-2 rounded-xl flex flex-col',
                  isDark ? 'bg-white/[0.04]' : 'bg-[#F4F4F6]'
                )}
              >
                <div className="flex items-center gap-1 text-[#64748B] mb-0.5">
                  <Gauge className="w-3 h-3 text-[#D97757]" />
                  <span className="text-[9px] uppercase font-bold">Speed</span>
                </div>
                <span className="text-[13px] font-black leading-tight">
                  {activeVehicle.speed} <span className="text-[9px] font-normal opacity-70">km/h</span>
                </span>
              </div>

              <div
                className={cn(
                  'p-2 rounded-xl flex flex-col',
                  isDark ? 'bg-white/[0.04]' : 'bg-[#F4F4F6]'
                )}
              >
                <div className="flex items-center gap-1 text-[#64748B] mb-0.5">
                  <Zap className="w-3 h-3 text-[#10B981]" />
                  <span className="text-[9px] uppercase font-bold">Energy</span>
                </div>
                <span className="text-[13px] font-black leading-tight">
                  {activeVehicle.batteryOrFuel}%
                </span>
              </div>

              <div
                className={cn(
                  'p-2 rounded-xl flex flex-col',
                  isDark ? 'bg-white/[0.04]' : 'bg-[#F4F4F6]'
                )}
              >
                <div className="flex items-center gap-1 text-[#64748B] mb-0.5">
                  <Thermometer className="w-3 h-3 text-[#3B82F6]" />
                  <span className="text-[9px] uppercase font-bold">Reefer</span>
                </div>
                <span className="text-[13px] font-black leading-tight font-mono">
                  {activeVehicle.temp || 'N/A'}
                </span>
              </div>
            </div>

            {/* Route Status bar */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-[10px] text-[#64748B] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#D97757]" />
                  {activeVehicle.currentCity} → {activeVehicle.destinationCity}
                </span>
                <span className="text-[10px] font-bold text-[#D97757] flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  ETA: {activeVehicle.eta}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#10B981] via-[#D97757] to-[#F59E0B] transition-all duration-500"
                  style={{ width: `${activeVehicle.routeProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
