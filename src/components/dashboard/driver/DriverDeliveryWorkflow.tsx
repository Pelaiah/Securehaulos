'use client';

import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  PenTool,
  Camera,
  RotateCcw,
  Sparkles,
  MapPin,
  Clock,
  Check,
  TrendingUp,
  FileCheck2,
  ChevronRight,
  PartyPopper,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DriverTrip, TripStatus } from './types';
import { cn } from '@/lib/utils';

interface DriverDeliveryWorkflowProps {
  trip: DriverTrip;
  onBack: () => void;
  onUpdateStatus: (newStatus: TripStatus, metadata?: { podSignature?: string; podNotes?: string }) => void;
  onViewNextLoad: () => void;
}

type DeliveryStep = 'ARRIVED' | 'CHECK_IN' | 'UNLOADING' | 'POD_SIGNATURE' | 'COMPLETED_SUCCESS';

export function DriverDeliveryWorkflow({
  trip,
  onBack,
  onUpdateStatus,
  onViewNextLoad,
}: DriverDeliveryWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<DeliveryStep>('ARRIVED');
  const [recipientName, setRecipientName] = useState('Sarah Jenkins');
  const [deliveryNotes, setDeliveryNotes] = useState('All 24 pallets received intact. Temperature logged at -20°C verified.');
  const [isPhotoCaptured, setIsPhotoCaptured] = useState(false);
  const [isSignatureDrawn, setIsSignatureDrawn] = useState(false);

  // Simple canvas signature pad
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#34785D';
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
    setIsSignatureDrawn(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsSignatureDrawn(false);
  };

  const handleNextStep = () => {
    if (currentStep === 'ARRIVED') {
      setCurrentStep('CHECK_IN');
      onUpdateStatus('AT_DELIVERY');
    } else if (currentStep === 'CHECK_IN') {
      setCurrentStep('UNLOADING');
      onUpdateStatus('UNLOADING');
    } else if (currentStep === 'UNLOADING') {
      setCurrentStep('POD_SIGNATURE');
      onUpdateStatus('DELIVERED_POD_PENDING');
    } else if (currentStep === 'POD_SIGNATURE') {
      setCurrentStep('COMPLETED_SUCCESS');
      onUpdateStatus('COMPLETED', {
        podSignature: recipientName,
        podNotes: deliveryNotes,
      });
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
              Delivery Workflow
            </span>
            <h1 className="text-base font-extrabold text-[#1C1E21]">
              {trip.destination.consignee}
            </h1>
          </div>
        </div>
        <Badge variant="outline" className="bg-[#E8F4EE] border-[#34785D]/20 text-[#34785D] font-mono">
          {trip.loadNumber}
        </Badge>
      </div>

      {/* ── SATISFYING COMPLETION STATE ── */}
      {currentStep === 'COMPLETED_SUCCESS' ? (
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#E1E6E2] p-6 shadow-sm text-center space-y-5 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 rounded-full bg-[#E8F4EE] border-2 border-[#34785D] text-[#34785D] flex items-center justify-center mx-auto shadow-sm">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div>
            <Badge className="bg-[#34785D] text-white font-black tracking-wider text-xs px-3 py-0.5 uppercase">
              Delivered & Confirmed
            </Badge>
            <h2 className="text-2xl font-black text-[#1C1E21] mt-2 tracking-tight">
              DELIVERY COMPLETED
            </h2>
            <p className="text-xs text-[#6E737B] mt-1">
              POD signed by {recipientName}. All records uploaded to carrier network.
            </p>
          </div>

          {/* Delivery Stats Grid */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#F7F8F6] border border-[#E1E6E2] text-center">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#6E737B]">Timestamp</span>
              <p className="text-xs font-bold text-[#1C1E21] font-mono mt-0.5">Today, 02:42 PM</p>
            </div>
            <div className="border-x border-[#E1E6E2]">
              <span className="text-[10px] uppercase font-semibold text-[#6E737B]">Distance</span>
              <p className="text-xs font-bold text-[#1C1E21] font-mono mt-0.5">372.4 mi</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#6E737B]">Payout</span>
              <p className="text-xs font-bold text-[#34785D] font-mono mt-0.5">+$1,420.00</p>
            </div>
          </div>

          {/* Next Load Bridge */}
          <div className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#E1E6E2] text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#34785D] uppercase tracking-wider">
                Next Assigned Load
              </span>
              <span className="text-xs font-mono text-[#6E737B]">Tomorrow 07:00 AM</span>
            </div>
            <p className="text-sm font-bold text-[#1C1E21]">#NX8L-90KLA1 · Phoenix HUB → Albuquerque</p>
            <p className="text-xs text-[#6E737B]">High-Tech Electronics & Server Racks (420 mi)</p>
          </div>

          <Button
            type="button"
            onClick={onViewNextLoad}
            className="w-full h-12 rounded-2xl bg-[#34785D] hover:bg-[#2C644E] text-white font-bold text-sm tracking-wide shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            VIEW NEXT ASSIGNED LOAD
          </Button>
        </div>
      ) : (
        <>
          {/* ── CONSIGNEE DOCK CARD ── */}
          <div className="rounded-3xl bg-[#FFFFFF] border border-[#E1E6E2] p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F8F6] border border-[#E1E6E2]">
              <div>
                <span className="text-[10px] font-bold text-[#6E737B] uppercase tracking-wider">
                  Receiving Dock
                </span>
                <p className="text-base font-black text-[#34785D] font-mono">
                  {trip.destination.dock}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#6E737B] uppercase tracking-wider">
                  Target Window
                </span>
                <p className="text-xs font-bold text-[#1C1E21] font-mono">
                  {trip.destination.appointmentTime}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#E1E6E2] space-y-1 text-xs">
              <span className="text-[10px] font-bold text-[#6E737B] uppercase tracking-wider">
                Consignee Address & Instructions
              </span>
              <p className="text-[#1C1E21] font-semibold">{trip.destination.address}</p>
              <p className="text-[#6E737B] text-[11px] leading-relaxed pt-1">
                {trip.destination.instructions}
              </p>
            </div>

            {/* Proof of Delivery / Digital Signature Form */}
            {currentStep === 'POD_SIGNATURE' && (
              <div className="space-y-4 pt-2 border-t border-[#E1E6E2] animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#1C1E21] uppercase tracking-wider flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-[#34785D]" />
                    Recipient Digital Signature
                  </h3>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-[11px] font-semibold text-[#6E737B] hover:text-[#1C1E21] flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                </div>

                {/* Recipient Full Name */}
                <div>
                  <label className="text-[11px] text-[#6E737B] font-semibold mb-1 block">
                    Receiving Agent Full Name
                  </label>
                  <Input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="bg-[#F7F8F6] border-[#E1E6E2] text-[#1C1E21] font-semibold text-xs rounded-xl focus:border-[#34785D]"
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>

                {/* Interactive Canvas Signature Area */}
                <div className="rounded-2xl bg-[#F7F8F6] border border-dashed border-[#E1E6E2] p-2 relative overflow-hidden">
                  <span className="absolute top-2 left-3 text-[10px] font-mono text-[#6E737B] pointer-events-none">
                    Draw signature with finger or stylus ✍️
                  </span>
                  <canvas
                    ref={canvasRef}
                    width={340}
                    height={120}
                    onPointerDown={startDrawing}
                    onPointerMove={draw}
                    onPointerUp={stopDrawing}
                    onPointerLeave={stopDrawing}
                    className="w-full h-28 cursor-crosshair touch-none"
                  />
                </div>

                {/* Photo POD Capture & Delivery Notes */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPhotoCaptured(!isPhotoCaptured)}
                    className={cn(
                      'p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold active:scale-95',
                      isPhotoCaptured
                        ? 'bg-[#E8F4EE] border-[#34785D] text-[#34785D]'
                        : 'bg-[#F7F8F6] border-[#E1E6E2] text-[#1C1E21] hover:border-[#34785D]'
                    )}
                  >
                    <Camera className="w-5 h-5 text-[#34785D]" />
                    <span>{isPhotoCaptured ? '✓ Pallet Photo Saved' : 'Photo Cargo At Dock'}</span>
                  </button>

                  <div className="p-3 rounded-2xl bg-[#F7F8F6] border border-[#E1E6E2] flex flex-col justify-center text-xs">
                    <span className="text-[10px] text-[#6E737B] uppercase font-semibold">
                      Seal Verified
                    </span>
                    <span className="font-mono text-[#34785D] font-bold mt-0.5">
                      {trip.sealNumber || 'SEAL-994821-AZ'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#6E737B] font-semibold mb-1 block">
                    Delivery Notes / Temperature Log
                  </label>
                  <Textarea
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    rows={2}
                    className="bg-[#F7F8F6] border-[#E1E6E2] text-[#1C1E21] text-xs rounded-xl focus:border-[#34785D]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── ACTION BUTTON ── */}
          <div className="mt-2">
            <Button
              type="button"
              onClick={handleNextStep}
              className="w-full h-12 rounded-2xl bg-[#34785D] hover:bg-[#2C644E] text-white font-extrabold text-sm tracking-wider shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {currentStep === 'ARRIVED' && '1. CONFIRM ARRIVAL AT RECEIVING FACILITY'}
              {currentStep === 'CHECK_IN' && '2. CHECK IN AT DOCK #08 & BACK UP'}
              {currentStep === 'UNLOADING' && '3. UNLOADING COMPLETED (VERIFY TALLY)'}
              {currentStep === 'POD_SIGNATURE' && '4. CONFIRM POD & COMPLETE DELIVERY'}
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
