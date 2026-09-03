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
    <div className="flex flex-col gap-4 pb-28 pt-2 px-3 sm:px-4 max-w-lg mx-auto w-full text-[#1C1E21] font-sans select-none">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-2xl bg-[#FFFFFF] hover:bg-[#E8F4EE] hover:text-[#34785D] border border-[#E1E6E2] text-[#1C1E21] active:scale-95 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#34785D]">
              Pickup Workflow
            </span>
            <h1 className="text-base font-extrabold text-[#1C1E21]">
              {trip.origin.facility}
            </h1>
          </div>
        </div>
        <Badge variant="outline" className="bg-[#E8F4EE] border-[#34785D]/20 text-[#34785D] font-mono">
          {trip.loadNumber}
        </Badge>
      </div>

      {/* ── STEP PROGRESS BAR ── */}
      <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-sm">
        <div className="flex items-center justify-between relative mb-2">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E1E6E2] -translate-y-1/2 z-0" />
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
                      ? 'bg-[#34785D] text-white shadow-sm'
                      : isCurrent
                      ? 'bg-[#34785D] text-white shadow-sm ring-4 ring-[#E8F4EE]'
                      : 'bg-[#F7F8F6] text-[#6E737B] border border-[#E1E6E2]'
                  )}
                >
                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={cn(
                    'text-[9px] font-semibold mt-1 uppercase tracking-tight',
                    isCurrent ? 'text-[#34785D]' : isPassed ? 'text-[#34785D]' : 'text-[#6E737B]'
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
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E1E6E2] p-4 sm:p-5 shadow-sm space-y-4">
        {/* Status Callout */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F8F6] border border-[#E1E6E2]">
          <div>
            <span className="text-[10px] font-bold text-[#6E737B] uppercase tracking-wider">
              Assigned Dock
            </span>
            <p className="text-base font-black text-[#34785D] font-mono">{trip.origin.dock}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-[#6E737B] uppercase tracking-wider">
              Appointment
            </span>
            <p className="text-xs font-bold text-[#1C1E21] font-mono">{trip.origin.appointmentTime}</p>
          </div>
        </div>

        {/* Contact info & Direct Call */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F8F6] border border-[#E1E6E2]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8F4EE] border border-[#34785D]/20 flex items-center justify-center text-[#34785D]">
              <Phone className="w-4 h-4 text-[#34785D]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1C1E21]">{trip.origin.contact}</p>
              <p className="text-[11px] text-[#6E737B] font-mono">{trip.origin.phone}</p>
            </div>
          </div>
          <a
            href={`tel:${trip.origin.phone}`}
            className="px-3 py-1.5 rounded-xl bg-[#E8F4EE] hover:bg-[#34785D] hover:text-white border border-[#34785D]/20 text-xs font-bold text-[#34785D] transition-colors"
          >
            Call Dock
          </a>
        </div>

        {/* Loading Instructions Alert */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4" />
            <span>Special Facility Loading Protocol</span>
          </div>
          <p className="text-amber-700 text-[11px] leading-relaxed">
            {trip.origin.instructions}
          </p>
        </div>

        {/* Interactive Verification Checks (Step 4 & 5) */}
        {(currentStep === 'LOADED' || currentStep === 'CONFIRM') && (
          <div className="space-y-3 pt-2 border-t border-[#E1E6E2]">
            <h3 className="text-xs font-bold text-[#1C1E21] uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#34785D]" />
              Cargo Seal & Verification
            </h3>

            {/* Seal Number Input */}
            <div>
              <label className="text-[11px] text-[#6E737B] font-semibold mb-1 block">
                High-Security Bolt Seal Number
              </label>
              <Input
                value={sealNumber}
                onChange={(e) => setSealNumber(e.target.value)}
                className="bg-[#F7F8F6] border-[#E1E6E2] text-[#1C1E21] font-mono text-xs rounded-xl focus:border-[#34785D]"
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
                    ? 'bg-[#E8F4EE] border-[#34785D] text-[#34785D]'
                    : 'bg-[#F7F8F6] border-[#E1E6E2] text-[#1C1E21] hover:border-[#34785D]'
                )}
              >
                <Camera className="w-5 h-5 text-[#34785D]" />
                <span>{sealPhotoTaken ? '✓ Seal Photo Captured' : 'Take Seal Photo'}</span>
              </button>

              <button
                type="button"
                onClick={() => setBolUploaded(!bolUploaded)}
                className={cn(
                  'p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold active:scale-95',
                  bolUploaded
                    ? 'bg-[#E8F4EE] border-[#34785D] text-[#34785D]'
                    : 'bg-[#F7F8F6] border-[#E1E6E2] text-[#1C1E21] hover:border-[#34785D]'
                )}
              >
                <FileText className="w-5 h-5 text-[#34785D]" />
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
          className="w-full h-12 rounded-2xl bg-[#34785D] hover:bg-[#2C644E] text-white font-extrabold text-sm tracking-wider shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
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
            className="w-full py-2 text-center text-xs font-semibold text-[#6E737B] hover:text-red-600 transition-colors"
          >
            Report Damaged Packaging or Discrepancy
          </button>
        )}
      </div>
    </div>
  );
}
