'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';
import { RoleSelectionDialog } from '@/components/auth/RoleSelectionDialog';
import { Button } from '@/components/ui/button';

export function MobileHeroOnboarding() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: 'Smart Shipping\nMade Simple',
      subtitle: 'Stay updated every step of the way with live shipment tracking.',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1080&q=80',
    },
    {
      title: 'Real-time GPS\n& Cargo Security',
      subtitle: 'Continuous monitoring and instant alerts for unmatched peace of mind.',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    },
  ];

  const current = slides[activeSlide];

  return (
    <div className="md:hidden relative w-full h-[100dvh] flex flex-col justify-between bg-[#0B0D12] text-white overflow-hidden select-none">
      {/* Background Hero Truck Image with Cinematic Lighting & Gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src={current.image}
          alt="Modern Commercial Hauler Truck"
          fill
          priority
          className="object-cover object-center scale-105 transition-all duration-700"
        />
        {/* Dark Vignette and Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#0B0D12] z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/80 to-transparent z-10" />
      </div>

      {/* Top Header / App Brand */}
      <div className="relative z-20 px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center shadow-md">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-wide text-white font-headline">
            Suboor Loads
          </span>
        </div>
        <Link
          href="/login"
          className="text-xs font-semibold text-white/80 hover:text-white px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10"
        >
          Sign In
        </Link>
      </div>

      {/* Bottom Content Area */}
      <div className="relative z-20 px-6 pb-8 space-y-6">
        {/* Step Indicator Dots */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeSlide === i
                  ? 'w-6 bg-[#FF6B00]'
                  : 'w-2 bg-white/40'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Headline */}
        <div className="space-y-2.5">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-headline leading-[1.15] whitespace-pre-line">
            {current.title}
          </h1>
          <p className="text-sm text-white/80 leading-relaxed max-w-sm">
            {current.subtitle}
          </p>
        </div>

        {/* Slide-to-Action / Get Started Button (Matching Screen 1) */}
        <RoleSelectionDialog>
          <button
            type="button"
            className="w-full rounded-full py-2 pl-2 pr-6 bg-[#1A1D27]/90 backdrop-blur-xl border border-white/15 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.6)] active:scale-[0.98] transition-transform group"
          >
            {/* Left Orange Icon Circle */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF5500] to-[#FF8000] flex items-center justify-center text-white shadow-[0_4px_15px_rgba(255,107,0,0.5)]">
              <Package className="w-5 h-5 stroke-[2.2]" />
            </div>

            {/* Center Label */}
            <span className="font-semibold text-base text-white tracking-wide">
              Get Started
            </span>

            {/* Right Arrow Triple Chevrons */}
            <div className="flex items-center text-white/70 group-hover:text-white transition-colors font-bold tracking-widest text-sm">
              <span>&gt;&gt;&gt;</span>
            </div>
          </button>
        </RoleSelectionDialog>
      </div>
    </div>
  );
}
