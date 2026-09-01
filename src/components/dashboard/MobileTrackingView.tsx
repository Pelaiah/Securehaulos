'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  MessageSquare,
  Phone,
  Package,
  MapPin,
  ArrowRight,
  ChevronsRight,
  User,
  Navigation,
  Pause,
  Clock,
  Ruler,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Truck } from '@/lib/data';

interface MobileTrackingViewProps {
  tripId?: string;
  orderId?: string;
  orderLabel?: string;
  driverName?: string;
  driverAvatar?: string;
  truck?: Truck | null;
  fromAddress?: string;
  toAddress?: string;
  placedDate?: string;
  estimatedDate?: string;
  price?: string;
  carrier?: string;
  quantity?: string;
  size?: string;
  weight?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  customerName?: string;
  deliveryAddress?: string;
  timeWindow?: string;
  onBack?: () => void;
}

export function MobileTrackingView({
  tripId = '1',
  orderId = '#324561324',
  orderLabel = 'Birthday gift',
  driverName = 'Michael Johnson',
  driverAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  truck,
  fromAddress = 'Warehouse A, 123 Industrial Park, Los Angeles, CA 90001',
  toAddress = '2464 Royal Ln. Mesa, New Jersey 45463',
  placedDate = '14 Aug 2024',
  estimatedDate = '14 Aug 2024',
  price = '$250',
  carrier = 'Welton Express',
  quantity = '1',
  size = '50×40×50 cm',
  weight = '2 kg',
  paymentMethod = 'Mastercard •••0034',
  paymentStatus = 'Paid',
  customerName = 'Holden Caulfield',
  deliveryAddress = '2464 Royal Ln. Mesa, New Jersey 45463',
  timeWindow = '10 AM – 13 AM',
  onBack,
}: MobileTrackingViewProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [sliderX, setSliderX] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/dashboard/shipper');
    }
  };

  /* ── Swipe-to-confirm logic ── */
  const handleSliderPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const startX = e.clientX - sliderX;
    const trackWidth = trackRef.current?.clientWidth ?? 300;
    const knobWidth = 56;
    const maxX = trackWidth - knobWidth - 8;

    const onMove = (ev: PointerEvent) => {
      const nx = Math.max(0, Math.min(ev.clientX - startX, maxX));
      setSliderX(nx);
      if (nx >= maxX * 0.9) {
        setIsConfirmed(true);
        setSliderX(maxX);
      }
    };
    const onUp = () => {
      if (!isConfirmed) setSliderX(0);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  /* ── Map SVG ── */
  const MapSVG = () => (
    <svg viewBox="0 0 400 220" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Base map */}
      <rect width="400" height="220" fill="#E8EFF5" />
      {/* Roads */}
      <path d="M0 110 Q100 100 200 120 T400 105" stroke="#D0D9E3" strokeWidth="14" fill="none" />
      <path d="M0 50 Q80 80 160 60 T400 70" stroke="#D0D9E3" strokeWidth="10" fill="none" />
      <path d="M100 0 Q120 80 110 160 T130 220" stroke="#D0D9E3" strokeWidth="10" fill="none" />
      <path d="M240 0 Q250 90 260 160 T270 220" stroke="#D0D9E3" strokeWidth="8" fill="none" />
      <path d="M0 170 Q120 155 220 175 T400 160" stroke="#D0D9E3" strokeWidth="8" fill="none" />
      {/* Route highlight – purple like reference */}
      <path
        d="M60 160 Q100 140 140 115 Q175 90 210 105 Q250 120 300 80 Q330 60 360 55"
        stroke="#6366F1"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Start pin */}
      <circle cx="60" cy="160" r="8" fill="#6366F1" />
      <circle cx="60" cy="160" r="13" stroke="#6366F1" strokeWidth="2" opacity="0.3" />
      {/* Current position (filled circle + pulse) */}
      <circle cx="210" cy="105" r="11" fill="#6366F1" />
      <circle cx="210" cy="105" r="18" stroke="#6366F1" strokeWidth="2.5" opacity="0.25" className="animate-ping" />
      <circle cx="210" cy="105" r="5" fill="white" />
      {/* Destination */}
      <circle cx="360" cy="55" r="7" fill="#4B5563" />
      <circle cx="360" cy="55" r="12" stroke="#4B5563" strokeWidth="2" opacity="0.3" />
      {/* Navigation arrow marker */}
      <polygon points="195,75 215,75 205,95" fill="white" stroke="#6366F1" strokeWidth="1" />
    </svg>
  );

  return (
    <div className="md:hidden flex flex-col min-h-screen bg-white dark:bg-[#0E1015]">

      {/* ══════════════════════════════════════════
          VIEW 1 ─ SHIPMENT DETAIL (no navigation)
         ══════════════════════════════════════════ */}
      {!isNavigating ? (
        <div className="flex flex-col min-h-screen">
          {/* Map with back button and expected date */}
          <div className="relative w-full h-64 bg-[#E8EFF5] overflow-hidden">
            <MapSVG />

            {/* Back */}
            <button
              type="button"
              onClick={handleBack}
              className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 active:scale-95 transition-transform"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>

            {/* Expected date overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#16181F] px-5 py-3 flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-muted-foreground">
                Expected on: <span className="font-semibold text-black dark:text-white">{estimatedDate}</span>
              </p>
              <button type="button" className="text-gray-400">
                <svg width="20" height="4" viewBox="0 0 20 4" fill="none">
                  <circle cx="2" cy="2" r="2" fill="currentColor" />
                  <circle cx="10" cy="2" r="2" fill="currentColor" />
                  <circle cx="18" cy="2" r="2" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Order Info Card ── */}
          <div className="flex-1 bg-white dark:bg-[#0E1015] px-5 pt-4 pb-36 overflow-y-auto">
            {/* Order ID row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] dark:bg-[#1A1C26] flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-500 dark:text-muted-foreground" />
                </div>
                <div>
                  <p className="font-bold text-[15px] text-black dark:text-white">{orderId}</p>
                  <p className="text-xs text-gray-500 dark:text-muted-foreground">{orderLabel}</p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-[#7C3AED] text-white text-[11px] font-semibold">
                Awaiting Pickup
              </span>
            </div>

            {/* Carrier / Cost / Created row */}
            <div className="grid grid-cols-3 gap-3 mb-4 bg-[#F9FAFB] dark:bg-[#16181F] rounded-2xl p-4">
              <div>
                <p className="text-[10px] text-gray-400 dark:text-muted-foreground">Shipped by</p>
                <p className="text-[13px] font-semibold text-black dark:text-white mt-0.5">{carrier}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-muted-foreground">Order cost</p>
                <p className="text-[13px] font-semibold text-black dark:text-white mt-0.5">{price}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-muted-foreground">Created</p>
                <p className="text-[13px] font-semibold text-black dark:text-white mt-0.5">12/03/2025</p>
              </div>
            </div>

            {/* Order metadata rows */}
            <div className="bg-[#F9FAFB] dark:bg-[#16181F] rounded-2xl overflow-hidden mb-4">
              {[
                { label: 'Quantity:', value: quantity },
                { label: 'Size:', value: size },
                { label: 'Weight:', value: weight },
                { label: 'Type of order:', value: 'Own terms' },
                { label: 'Order cost:', value: '$129' },
                { label: 'Payment method:', value: paymentMethod },
                { label: 'Status:', value: paymentStatus },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={cn(
                    'flex items-center justify-between px-4 py-3',
                    i < arr.length - 1 && 'border-b border-gray-100 dark:border-white/[0.05]'
                  )}
                >
                  <span className="text-[12px] text-gray-500 dark:text-muted-foreground">{row.label}</span>
                  <span className="text-[12px] font-semibold text-black dark:text-white text-right">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Navigate Button */}
            <button
              type="button"
              onClick={() => setIsNavigating(true)}
              className="w-full mb-3 py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(255,107,0,0.35)] active:scale-[0.98] transition-transform"
            >
              <Navigation className="w-4 h-4" />
              Start Navigation
            </button>

            {/* Support row */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex-1 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 text-[13px] font-medium text-black dark:text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <MessageSquare className="w-4 h-4 text-gray-500 dark:text-muted-foreground" />
                Chat with support
              </button>
              <button
                type="button"
                onClick={() => { window.location.href = 'tel:+18005550199'; }}
                className="w-14 h-14 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center justify-center active:scale-95 transition-transform"
              >
                <Phone className="w-5 h-5 text-black dark:text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (

        /* ══════════════════════════════════════════
            VIEW 2 ─ LIVE NAVIGATION
           ══════════════════════════════════════════ */
        <div className="flex flex-col min-h-screen">
          {/* Navigation top bar */}
          <div className="bg-black text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-4 h-4 rotate-[-45deg]" />
              </div>
              <div>
                <p className="text-xs text-gray-400">20 FT</p>
                <p className="font-semibold text-[13px]">5643 Grand St.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsNavigating(false)}
              className="px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium"
            >
              Pause
            </button>
          </div>

          {/* Map */}
          <div className="relative h-60 bg-[#E8EFF5] overflow-hidden">
            <MapSVG />
            <button
              type="button"
              onClick={handleBack}
              className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700"
            >
              <ChevronLeft className="w-4 h-4 -ml-0.5" />
            </button>
          </div>

          {/* Trip stats */}
          <div className="bg-white dark:bg-[#16181F] px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-white/[0.06]">
            <div className="text-center">
              <p className="text-[10px] text-gray-400 dark:text-muted-foreground">distance</p>
              <p className="font-bold text-[16px] text-black dark:text-white">2.8 mile</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 dark:text-muted-foreground">Time left</p>
              <p className="font-bold text-[16px] text-black dark:text-white">2:23 min</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 dark:text-muted-foreground">Arrival</p>
              <p className="font-bold text-[16px] text-black dark:text-white">9:44 AM</p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="bg-white dark:bg-[#16181F] px-5 py-3 flex items-center gap-3 border-b border-gray-100 dark:border-white/[0.06]">
            <div className="w-7 h-7 rounded-full bg-[#F3F4F6] dark:bg-[#22252F] flex items-center justify-center">
              <Package className="w-3.5 h-3.5 text-gray-500 dark:text-muted-foreground" />
            </div>
            <div className="flex-1 flex items-center gap-1">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={cn('flex-1 h-[2px] rounded-full', i < 4 ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10')}
                />
              ))}
            </div>
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>

          {/* Order row */}
          <div className="bg-white dark:bg-[#16181F] px-5 py-3 flex items-center justify-between border-b border-gray-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] dark:bg-[#22252F] flex items-center justify-center">
                <Package className="w-4 h-4 text-gray-500 dark:text-muted-foreground" />
              </div>
              <div>
                <p className="font-bold text-[13px] text-black dark:text-white">{orderId}</p>
                <p className="text-[11px] text-gray-400 dark:text-muted-foreground">{orderLabel}</p>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-black dark:bg-white/10 text-white text-[11px] font-medium">
              {timeWindow}
            </span>
          </div>

          {/* Customer & delivery detail */}
          <div className="flex-1 bg-white dark:bg-[#0E1015] px-5 pt-4 pb-36 overflow-y-auto">
            {/* Customer */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[11px] text-gray-400 dark:text-muted-foreground mb-0.5">Customer</p>
                <p className="font-bold text-[16px] text-black dark:text-white">{customerName}</p>
              </div>
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-[0_4px_12px_rgba(255,107,0,0.4)]"
              >
                <MessageSquare className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Delivery address */}
            <div className="flex items-start gap-2 mb-5">
              <MapPin className="w-4 h-4 text-gray-400 dark:text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-[13px] text-black dark:text-white">{deliveryAddress}</p>
            </div>

            {/* Order meta table */}
            <div className="bg-[#F9FAFB] dark:bg-[#16181F] rounded-2xl overflow-hidden mb-4">
              {[
                { label: 'Type of order:', value: 'Own terms' },
                { label: 'Order cost:', value: '$129' },
                { label: 'Payment method:', value: paymentMethod },
                { label: 'Status:', value: paymentStatus },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={cn(
                    'flex items-center justify-between px-4 py-3',
                    i < arr.length - 1 && 'border-b border-gray-100 dark:border-white/[0.05]'
                  )}
                >
                  <span className="text-[12px] text-gray-500 dark:text-muted-foreground">{row.label}</span>
                  <span className="text-[12px] font-semibold text-black dark:text-white">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Support */}
            <div className="flex items-center gap-3 mb-6">
              <button
                type="button"
                className="flex-1 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 text-[13px] font-medium text-black dark:text-white flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-gray-500 dark:text-muted-foreground" />
                Chat with support
              </button>
              <button
                type="button"
                onClick={() => { window.location.href = 'tel:+18005550199'; }}
                className="w-14 h-14 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center justify-center"
              >
                <Phone className="w-5 h-5 text-black dark:text-white" />
              </button>
            </div>

            {/* Slide to confirm delivery */}
            <div
              ref={trackRef}
              className={cn(
                'relative w-full h-16 rounded-full overflow-hidden select-none',
                isConfirmed ? 'bg-primary' : 'bg-black dark:bg-[#16181F]'
              )}
            >
              {/* Track label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className={cn('text-sm font-semibold', isConfirmed ? 'text-white' : 'text-white/70')}>
                  {isConfirmed ? '✓ Delivery Confirmed!' : 'Slide to confirm the delivery'}
                </p>
              </div>

              {/* Draggable knob */}
              {!isConfirmed && (
                <div
                  ref={sliderRef}
                  style={{ transform: `translateX(${sliderX + 4}px)` }}
                  onPointerDown={handleSliderPointerDown}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary shadow-[0_4px_15px_rgba(255,107,0,0.5)] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none z-10"
                >
                  <ChevronsRight className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
