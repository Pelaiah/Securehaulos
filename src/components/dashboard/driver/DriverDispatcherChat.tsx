'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Phone,
  Send,
  Mic,
  Square,
  Navigation,
  Clock,
  AlertTriangle,
  Package,
  Wrench,
  MapPin,
  X,
  Radio,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { DispatchMessage, DriverTrip } from './types';
import { cn } from '@/lib/utils';

interface DriverDispatcherChatProps {
  messages: DispatchMessage[];
  onSendMessage: (text: string, isQuickAction?: boolean) => void;
  onBack: () => void;
  activeTrip?: DriverTrip;
}

export function DriverDispatcherChat({
  messages,
  onSendMessage,
  onBack,
  activeTrip,
}: DriverDispatcherChatProps) {
  const [inputText, setInputText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [isLoadWidgetVisible, setIsLoadWidgetVisible] = useState(true);
  const [activeOrbitalTap, setActiveOrbitalTap] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRecordingVoice]);

  // Voice recording timer
  useEffect(() => {
    if (isRecordingVoice) {
      setRecordDuration(0);
      timerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecordingVoice]);

  const triggerOrbitalAction = (id: string, text: string) => {
    setActiveOrbitalTap(id);
    setTimeout(() => setActiveOrbitalTap(null), 600);
    onSendMessage(text, true);
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleStopAndSendVoice = () => {
    setIsRecordingVoice(false);
    onSendMessage(`🎙️ Voice Message (${recordDuration}s)`, true);
    setRecordDuration(0);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="relative w-full h-[calc(100vh-1rem)] max-w-lg mx-auto flex flex-col justify-between p-3 sm:px-4 text-[#1C1E21] font-sans select-none overflow-hidden">
      {/* ── MASTER FROSTED GLASS ORBITAL CARD ── */}
      <div className="relative z-10 w-full h-full rounded-[36px] bg-[#FFFFFF] border border-[#E1E6E2] shadow-xl flex flex-col overflow-hidden">
        {/* ── 1. CHAT HEADER ── */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#E1E6E2] bg-[#FFFFFF]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-[#F7F8F6] hover:bg-[#E8F4EE] hover:text-[#34785D] border border-[#E1E6E2] text-[#1C1E21] flex items-center justify-center active:scale-95 transition-all shadow-sm"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-[#1C1E21] tracking-tight">
                  Marcus Vance
                </h1>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-[#34785D] bg-[#E8F4EE] border border-[#34785D]/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34785D] animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#6E737B] mt-0.5">
                ACTIVE TRIP {activeTrip?.loadNumber || '#WE6K-78RFE4'} · DISPATCH
              </p>
            </div>
          </div>

          {/* Top-Right Call Button */}
          <a
            href="tel:+15552348900"
            className="w-10 h-10 rounded-full bg-[#E8F4EE] hover:bg-[#34785D] hover:text-white border border-[#34785D]/20 text-[#34785D] flex items-center justify-center shadow-sm active:scale-95 transition-all group"
            title="Call Dispatcher"
          >
            <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </a>
        </div>

        {/* ── CHAT SCROLL AREA (Upper Half) ── */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 min-h-[120px] max-h-[220px] sm:max-h-[260px] no-scrollbar bg-[#F7F8F6]/30">
          {messages.map((msg) => {
            const isDriver = msg.sender === 'driver';

            return (
              <div
                key={msg.id}
                className={cn(
                  'flex flex-col max-w-[85%]',
                  isDriver ? 'ml-auto items-end' : 'mr-auto items-start'
                )}
              >
                <div
                  className={cn(
                    'px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed transition-all shadow-sm',
                    isDriver
                      ? 'bg-[#34785D] text-white rounded-br-sm font-medium shadow-sm'
                      : 'bg-[#FFFFFF] border border-[#E1E6E2] text-[#1C1E21] rounded-bl-sm'
                  )}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] font-mono text-[#6E737B] mt-0.5 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* ── 2. QUICK ACTION ORBITAL CLUSTER (Centerpiece) ── */}
        <div className="relative py-3 flex flex-col items-center justify-center bg-[#F7F8F6]/60 border-y border-[#E1E6E2]">
          {/* Compass / Orbital Rings Container */}
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* Soft Radial Ambient Orbit Track */}
            <div className="absolute inset-0 rounded-full border border-[#E1E6E2] pointer-events-none" />
            <div className="absolute inset-6 rounded-full border border-dashed border-[#34785D]/25 pointer-events-none animate-spin-slow" />

            {/* Concentric Pulse Rings behind Center Button */}
            <div className="absolute w-28 h-28 rounded-full bg-[#34785D]/10 animate-ping opacity-30 pointer-events-none" />
            <div className="absolute w-24 h-24 rounded-full bg-[#34785D]/15 blur-md pointer-events-none" />

            {/* NORTH: Send Live Location */}
            <div className="absolute top-0 flex flex-col items-center">
              <button
                type="button"
                onClick={() =>
                  triggerOrbitalAction(
                    'north',
                    '📍 Live GPS Location Broadcasted: I-10 East @ Milepost 142'
                  )
                }
                className={cn(
                  'w-11 h-11 rounded-full bg-[#FFFFFF] border border-[#E1E6E2] flex items-center justify-center text-[#1C1E21] hover:bg-[#E8F4EE] hover:text-[#34785D] shadow-sm active:scale-90 transition-all group',
                  activeOrbitalTap === 'north' &&
                    'bg-[#34785D] text-white border-[#34785D] shadow-md'
                )}
                title="Send Location"
                aria-label="Send Location"
              >
                <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform text-[#34785D]" />
              </button>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#6E737B] mt-1">
                Location
              </span>
            </div>

            {/* WEST: Report Vehicle Issue */}
            <div className="absolute left-0 flex flex-col items-center">
              <button
                type="button"
                onClick={() =>
                  triggerOrbitalAction(
                    'west',
                    '⚠️ Sensor / Mechanical Alert Reported: Pre-trip warning flagged'
                  )
                }
                className={cn(
                  'w-11 h-11 rounded-full bg-[#FFFFFF] border border-[#E1E6E2] flex items-center justify-center text-[#1C1E21] hover:bg-[#E8F4EE] hover:text-[#34785D] shadow-sm active:scale-90 transition-all group',
                  activeOrbitalTap === 'west' &&
                    'bg-[#34785D] text-white border-[#34785D] shadow-md'
                )}
                title="Report Issue"
                aria-label="Report Issue"
              >
                <Wrench className="w-4 h-4 group-hover:scale-110 transition-transform text-[#34785D]" />
              </button>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#6E737B] mt-1">
                Issue
              </span>
            </div>

            {/* CENTER (Master Action): Radio Dispatch Call */}
            <div className="relative z-20 flex flex-col items-center">
              <button
                type="button"
                onClick={() =>
                  triggerOrbitalAction(
                    'center',
                    '📞 Direct Dispatch Radio Connection Requested'
                  )
                }
                className={cn(
                  'w-16 h-16 rounded-full bg-[#34785D] text-white flex items-center justify-center shadow-lg ring-4 ring-[#E8F4EE] hover:scale-105 active:scale-95 transition-all duration-300 group',
                  activeOrbitalTap === 'center' && 'scale-110 shadow-xl'
                )}
                title="Direct Dispatch Call"
                aria-label="Direct Dispatch Call"
              >
                <Phone className="w-7 h-7 fill-white stroke-[1.5] group-hover:rotate-12 transition-transform" />
              </button>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#34785D] mt-1.5">
                Radio Dispatch
              </span>
            </div>

            {/* EAST: Cargo Status */}
            <div className="absolute right-0 flex flex-col items-center">
              <button
                type="button"
                onClick={() =>
                  triggerOrbitalAction(
                    'east',
                    '📦 Cargo Status Update: Trailer sealed & Reefer temp stable (-4°F)'
                  )
                }
                className={cn(
                  'w-11 h-11 rounded-full bg-[#FFFFFF] border border-[#E1E6E2] flex items-center justify-center text-[#1C1E21] hover:bg-[#E8F4EE] hover:text-[#34785D] shadow-sm active:scale-90 transition-all group',
                  activeOrbitalTap === 'east' &&
                    'bg-[#34785D] text-white border-[#34785D] shadow-md'
                )}
                title="Cargo Status"
                aria-label="Cargo Status"
              >
                <Package className="w-4 h-4 group-hover:scale-110 transition-transform text-[#34785D]" />
              </button>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#6E737B] mt-1">
                Cargo
              </span>
            </div>

            {/* SOUTH: Report Delay */}
            <div className="absolute bottom-0 flex flex-col items-center">
              <button
                type="button"
                onClick={() =>
                  triggerOrbitalAction(
                    'south',
                    '⏱️ Delay Notice: Traffic congestion on route (+15m estimated)'
                  )
                }
                className={cn(
                  'w-11 h-11 rounded-full bg-[#FFFFFF] border border-[#E1E6E2] flex items-center justify-center text-[#1C1E21] hover:bg-[#E8F4EE] hover:text-[#34785D] shadow-sm active:scale-90 transition-all group',
                  activeOrbitalTap === 'south' &&
                    'bg-[#34785D] text-white border-[#34785D] shadow-md'
                )}
                title="Report Delay"
                aria-label="Report Delay"
              >
                <Clock className="w-4 h-4 group-hover:scale-110 transition-transform text-[#34785D]" />
              </button>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#6E737B] mt-1">
                Delay
              </span>
            </div>
          </div>
        </div>

        {/* ── 3. ACTIVE LOAD FLOATING WIDGET ── */}
        {activeTrip && isLoadWidgetVisible && (
          <div className="mx-4 my-2.5 p-3 rounded-2xl bg-[#FFFFFF] border border-[#E1E6E2] shadow-sm flex items-center justify-between animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E8F4EE] border border-[#34785D]/20 flex items-center justify-center text-[#34785D] flex-shrink-0">
                <Navigation className="w-4 h-4 fill-[#34785D]" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1C1E21] leading-tight">
                    En route — I-10 near Palm Springs
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34785D]" />
                </div>
                <p className="text-[11px] font-mono text-[#6E737B]">
                  <span className="text-[#34785D] font-semibold">
                    {activeTrip.metrics.estimatedHours} left
                  </span>{' '}
                  · {activeTrip.metrics.remainingDistanceMi} mi to delivery
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLoadWidgetVisible(false)}
              className="p-1 rounded-lg text-[#6E737B] hover:text-[#1C1E21] hover:bg-[#F7F8F6] active:scale-95 transition-colors"
              aria-label="Dismiss active load widget"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ── 4. MESSAGE INPUT BAR ── */}
        <div className="p-3.5 border-t border-[#E1E6E2] bg-[#FFFFFF]">
          {isRecordingVoice ? (
            /* Voice Recording Active Waveform Bar */
            <div className="h-12 w-full rounded-2xl bg-[#F7F8F6] border border-[#34785D] px-4 flex items-center justify-between shadow-inner animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  Recording Voice Note
                </span>
                <span className="text-xs font-mono text-[#1C1E21] font-bold ml-2">
                  {formatTimer(recordDuration)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleStopAndSendVoice}
                className="h-8 px-3 rounded-xl bg-[#34785D] hover:bg-[#2C644E] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Square className="w-3 h-3 fill-white" />
                Send
              </button>
            </div>
          ) : (
            /* Standard Text & Voice Input */
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                placeholder="Message dispatcher…"
                className="w-full h-12 rounded-2xl bg-[#F7F8F6] border border-[#E1E6E2] px-4 pr-24 text-xs text-[#1C1E21] placeholder:text-[#6E737B] focus:outline-none focus:border-[#34785D] transition-all shadow-inner"
              />

              {/* Right Side Inline Actions */}
              <div className="absolute right-1.5 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsRecordingVoice(true)}
                  className="w-9 h-9 rounded-xl bg-[#FFFFFF] border border-[#E1E6E2] text-[#6E737B] hover:text-[#34785D] flex items-center justify-center active:scale-95 transition-all shadow-sm"
                  title="Record voice note"
                  aria-label="Record voice note"
                >
                  <Mic className="w-4 h-4 text-[#34785D]" />
                </button>

                <button
                  type="button"
                  disabled={!inputText.trim()}
                  onClick={handleSendText}
                  className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-sm',
                    inputText.trim()
                      ? 'bg-[#34785D] hover:bg-[#2C644E] text-white shadow-sm'
                      : 'bg-[#F7F8F6] text-[#6E737B]/40 cursor-not-allowed border border-[#E1E6E2]'
                  )}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
