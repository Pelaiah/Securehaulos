'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SecureHaulLogoProps {
  variant?: 'horizontal' | 'vertical' | 'icon-only' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export function SecureHaulLogo({
  variant = 'horizontal',
  size = 'md',
  showTagline = false,
  className,
}: SecureHaulLogoProps) {
  // Dimensions scaling
  const iconDimensions = {
    sm: { width: 28, height: 28 },
    md: { width: 36, height: 36 },
    lg: { width: 48, height: 48 },
    xl: { width: 80, height: 80 },
  }[size];

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl',
  }[size];

  return (
    <div
      className={cn(
        'inline-flex items-center select-none font-sans',
        variant === 'vertical' ? 'flex-col text-center gap-2' : 'flex-row gap-2.5',
        className
      )}
    >
      {/* ── METALLIC 3D HEXAGON ROAD EMBLEM (Vector SVG) ── */}
      <div
        className="relative shrink-0 flex items-center justify-center drop-shadow-[0_4px_12px_rgba(229,166,56,0.25)]"
        style={{ width: iconDimensions.width, height: iconDimensions.height }}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Polished Gold Gradient */}
            <linearGradient id="shGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F9E29C" />
              <stop offset="35%" stopColor="#E5A638" />
              <stop offset="70%" stopColor="#B3781A" />
              <stop offset="100%" stopColor="#F3D17A" />
            </linearGradient>

            {/* Polished Silver/Chrome Gradient */}
            <linearGradient id="shSilverGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#718096" />
              <stop offset="40%" stopColor="#E2E8F0" />
              <stop offset="70%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>

            {/* Road Asphalt Dark Gradient */}
            <linearGradient id="shRoadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1A1D24" />
              <stop offset="50%" stopColor="#0E1015" />
              <stop offset="100%" stopColor="#252A35" />
            </linearGradient>

            {/* Glowing yellow dashed line */}
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── TOP / UPPER EMBLEM ARM (GOLD HEXAGON WING) ── */}
          <path
            d="M 60,8 L 102,32 L 88,40 L 60,24 L 32,40 L 46,48 L 60,40 L 88,56 L 68,68 L 50,58 L 22,74 L 18,72 L 18,32 Z"
            fill="url(#shGoldGrad)"
          />
          {/* Top highlight facet */}
          <path
            d="M 60,8 L 102,32 L 95,36 L 60,16 L 25,36 L 18,32 Z"
            fill="#FFF5C2"
            opacity="0.8"
          />

          {/* ── BOTTOM / LOWER EMBLEM ARM (CHROME SILVER HEXAGON WING) ── */}
          <path
            d="M 60,112 L 18,88 L 32,80 L 60,96 L 88,80 L 74,72 L 60,80 L 32,64 L 52,52 L 70,62 L 98,46 L 102,48 L 102,88 Z"
            fill="url(#shSilverGrad)"
          />
          {/* Bottom silver bevel highlight */}
          <path
            d="M 60,112 L 18,88 L 25,84 L 60,104 L 95,84 L 102,88 Z"
            fill="#FFFFFF"
            opacity="0.9"
          />

          {/* ── CENTER WINDING ROAD RIBBON ── */}
          <path
            d="M 32,96 C 52,78 68,64 74,48 L 88,40 C 80,62 60,84 42,106 Z"
            fill="url(#shRoadGrad)"
            stroke="#1E293B"
            strokeWidth="1.5"
          />

          {/* Road Yellow Dashes (Center Markings) */}
          <path
            d="M 36,98 C 54,80 70,64 76,46"
            stroke="#F59E0B"
            strokeWidth="3.5"
            strokeDasharray="6 5"
            fill="none"
            strokeLinecap="round"
            filter="url(#goldGlow)"
          />

          {/* Inner Road Edges */}
          <path
            d="M 32,96 C 52,78 68,64 74,48"
            stroke="#94A3B8"
            strokeWidth="1"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 42,106 C 60,84 80,62 88,40"
            stroke="#E5A638"
            strokeWidth="1"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* ── BRAND WORDMARK ("SECURE" in Chrome Silver/White + "HAUL" in Gold) ── */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col text-left">
          <div className="flex items-center tracking-wider leading-none">
            <span
              className={cn(
                'font-black tracking-tight text-white drop-shadow-sm',
                textSizeClasses
              )}
            >
              SECURE
            </span>
            <span
              className={cn(
                'font-black tracking-tight text-[#E5A638] ml-1 drop-shadow-[0_2px_8px_rgba(229,166,56,0.4)]',
                textSizeClasses
              )}
            >
              HAUL
            </span>
          </div>

          {/* Tagline for vertical or badge variant */}
          {showTagline && (
            <div className="mt-1 flex flex-col items-center">
              <p className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8] text-center">
                SMART LOADS. <span className="text-[#E5A638]">SECURE CONNECTIONS.</span>
              </p>
              <div className="w-full flex items-center justify-center gap-1.5 my-0.5">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#E5A638]/40" />
                <span className="text-[7px] font-bold text-[#E5A638] uppercase tracking-wider">
                  Shipper Meet Carriers
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#E5A638]/40" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
