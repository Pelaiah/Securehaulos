'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Camera,
  QrCode,
  FileText,
  Upload,
  AlertTriangle,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DriverTrip, TripStatus } from './types';
import { cn } from '@/lib/utils';

interface DriverPickupWorkflowProps {
  trip: DriverTrip;
  onBack: () => void;
  onUpdateStatus: (newStatus: TripStatus, metadata?: { sealNumber?: string }) => void;
  onCompletePickup: () => void;
}

type PickupStep = 'ARRIVED' | 'CHECK_IN' | 'LOADING' | 'LOADED' | 'CONFIRM';

export function DriverPickupWorkflow({
  trip,
  onBack,
  onUpdateStatus,
  onCompletePickup,
}: DriverPickupWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<PickupStep>('ARRIVED');
  const [sealNumber, setSealNumber] = useState(trip.sealNumber || 'SEAL-994821-AZ');
  const [sealPhotoTaken, setSealPhotoTaken] = useState(false);
  const [bolUploaded, setBolUploaded] = useState(false);
  const [isDamagedReported, setIsDamagedReported] = useState(false);

  const stepsList: { key: PickupStep; label: string }[] = [
    { key: 'ARRIVED', label: 'Arrived' },
    { key: 'CHECK_IN', label: 'Check In' },
    { key: 'LOADING', label: 'Loading' },
    { key: 'LOADED', label: 'Loaded & Seal' },
    { key: 'CONFIRM', label: 'Confirm' },
  ];

  const handleNextStep = () => {
    if (currentStep === 'ARRIVED') {
      setCurrentStep('CHECK_IN');
      onUpdateStatus('AT_PICKUP');
    } else if (currentStep === 'CHECK_IN') {
      setCurrentStep('LOADING');
      onUpdateStatus('LOADING');
    } else if (currentStep === 'LOADING') {
      setCurrentStep('LOADED');
      onUpdateStatus('LOADED');
    } else if (currentStep === 'LOADED') {
      setCurrentStep('CONFIRM');
    } else if (currentStep === 'CONFIRM') {
      onUpdateStatus('IN_TRANSIT', { sealNumber });
      onCompletePickup();
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-28 pt-2 px-3 sm:px-4 max-w-lg mx-auto w-full text-slate-100 font-sans select-none">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-2xl bg-[#181B26] hover:bg-[#202534] border border-white/10 text-slate-300 active:scale-95 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B00]">
              Pickup Workflow
            </span>
            <h1 className="text-base font-extrabold text-white">
              {trip.origin.facility}
            </h1>
          </div>
        </div>
        <Badge variant="outline" className="bg-[#181B26] border-[#FF6B00]/40 text-[#FF6B00] font-mono">
          {trip.loadNumber}
        </Badge>
      </div>

      {/* ── STEP PROGRESS BAR ── */}
      <div className="p-3.5 rounded-2xl bg-[#141722] border border-white/[0.08] shadow-md">
        <div className="flex items-center justify-between relative mb-2">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          {stepsList.map((step, idx) => {
            const stepOrder = ['ARRIVED', 'CHECK_IN', 'LOADING', 'LOADED', 'CONFIRM'];
            const currentIndex = stepOrder.indexOf(currentStep);
            const isPassed = stepOrder.indexOf(step.key) < currentIndex;
            const isCurrent = step.key === currentStep;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                    isPassed
                      ? 'bg-emerald-500 text-white shadow-[0_0_10px_#10B981]'
                      : isCurrent
                      ? 'bg-[#FF6B00] text-white shadow-[0_0_12px_#FF6B00] ring-4 ring-[#FF6B00]/20'
                      : 'bg-[#1C202F] text-slate-500 border border-white/10'
                  )}
                >
                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={cn(
                    'text-[9px] font-semibold mt-1 uppercase tracking-tight',
                    isCurrent ? 'text-[#FF6B00]' : isPassed ? 'text-emerald-400' : 'text-slate-500'
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FACILITY DOCK CARD ── */}
      <div className="rounded-3xl bg-[#181B28] border border-white/[0.1] p-4 sm:p-5 shadow-xl space-y-4">
        {/* Status Callout */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0E1015] border border-white/10">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Assigned Dock
            </span>
            <p className="text-base font-black text-[#FF6B00] font-mono">{trip.origin.dock}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Appointment
            </span>
            <p className="text-xs font-bold text-white font-mono">{trip.origin.appointmentTime}</p>
          </div>
        </div>

        {/* Contact info & Direct Call */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#141722] border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300">
              <Phone className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">{trip.origin.contact}</p>
              <p className="text-[11px] text-slate-400 font-mono">{trip.origin.phone}</p>
            </div>
          </div>
          <a
            href={`tel:${trip.origin.phone}`}
            className="px-3 py-1.5 rounded-xl bg-[#1C2132] hover:bg-[#252C42] border border-white/10 text-xs font-bold text-emerald-400"
          >
            Call Dock
          </a>
        </div>

        {/* Loading Instructions Alert */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Special Facility Loading Protocol</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {trip.origin.instructions}
          </p>
        </div>

        {/* Interactive Verification Checks (Step 4 & 5) */}
        {(currentStep === 'LOADED' || currentStep === 'CONFIRM') && (
          <div className="space-y-3 pt-2 border-t border-white/10">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#FF6B00]" />
              Cargo Seal & Verification
            </h3>

            {/* Seal Number Input */}
            <div>
              <label className="text-[11px] text-slate-400 font-semibold mb-1 block">
                High-Security Bolt Seal Number
              </label>
              <Input
                value={sealNumber}
                onChange={(e) => setSealNumber(e.target.value)}
                className="bg-[#0E1015] border-white/10 text-white font-mono text-xs rounded-xl focus:border-[#FF6B00]"
                placeholder="e.g. SEAL-994821"
              />
            </div>

            {/* Photo Capture Simulator */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSealPhotoTaken(!sealPhotoTaken)}
                className={cn(
                  'p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold active:scale-95',
                  sealPhotoTaken
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-[#141722] border-white/10 text-slate-300 hover:border-[#FF6B00]'
                )}
              >
                <Camera className="w-5 h-5 text-[#FF6B00]" />
                <span>{sealPhotoTaken ? '✓ Seal Photo Captured' : 'Take Seal Photo'}</span>
              </button>

              <button
                type="button"
                onClick={() => setBolUploaded(!bolUploaded)}
                className={cn(
                  'p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold active:scale-95',
                  bolUploaded
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-[#141722] border-white/10 text-slate-300 hover:border-[#FF6B00]'
                )}
              >
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>{bolUploaded ? '✓ Signed BOL Scanned' : 'Scan BOL Document'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── STEP ACTION BUTTON ── */}
      <div className="mt-2 space-y-2">
        <Button
          type="button"
          onClick={handleNextStep}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#FF7700] hover:from-[#FF6600] hover:to-[#FF8800] text-white font-extrabold text-sm tracking-wider shadow-[0_8px_25px_rgba(255,107,0,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {currentStep === 'ARRIVED' && '1. CONFIRM ARRIVAL AT GUARDHOUSE'}
          {currentStep === 'CHECK_IN' && '2. CHECK IN AT DOCK #14 MASTER'}
          {currentStep === 'LOADING' && '3. FORKLIFT LOADING IN PROGRESS...'}
          {currentStep === 'LOADED' && '4. SEAL TRAILER & VERIFY BOL'}
          {currentStep === 'CONFIRM' && '5. CONFIRM PICKUP & DEPART (START TRANSIT)'}
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </Button>

        {currentStep !== 'CONFIRM' && (
          <button
            type="button"
            onClick={() => setIsDamagedReported(true)}
            className="w-full py-2 text-center text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors"
          >
            Report Damaged Packaging or Discrepancy
          </button>
        )}
      </div>
    </div>
  );
}
