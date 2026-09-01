'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Send,
  Phone,
  Clock,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  HelpCircle,
  Truck,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DispatchMessage } from './types';
import { cn } from '@/lib/utils';

interface DriverDispatcherChatProps {
  messages: DispatchMessage[];
  onSendMessage: (text: string, isQuickAction?: boolean) => void;
  onBack: () => void;
}

export function DriverDispatcherChat({
  messages,
  onSendMessage,
  onBack,
}: DriverDispatcherChatProps) {
  const [inputText, setInputText] = useState('');

  const quickActionChips = [
    { label: 'Running Late (15m)', icon: Clock, type: 'warning' },
    { label: 'Heavy Traffic on Route', icon: AlertTriangle, type: 'warning' },
    { label: 'Arrived at Facility Dock', icon: MapPin, type: 'action' },
    { label: 'Cargo Loaded & Sealed', icon: CheckCircle2, type: 'success' },
    { label: 'Unloading Completed', icon: CheckCircle2, type: 'success' },
    { label: 'Vehicle Issue / Sensor Alert', icon: Truck, type: 'critical' },
  ];

  const handleSend = (textToSend?: string, isQuick?: boolean) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    onSendMessage(text, isQuick);
    if (!textToSend) setInputText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] max-w-lg mx-auto w-full text-slate-100 font-sans select-none pb-2 pt-2 px-3 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-2xl bg-[#181B26] hover:bg-[#202534] border border-white/10 text-slate-300 active:scale-95 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-sm font-bold text-white leading-tight">
                Marcus Vance (Fleet Dispatch)
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Channel: Load #WE6K-78RFE4</p>
          </div>
        </div>

        <a
          href="tel:+15552348900"
          className="p-2.5 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30 active:scale-95 transition-colors"
          title="Direct Phone Call to Dispatch"
        >
          <Phone className="w-4 h-4" />
        </a>
      </div>

      {/* ── FAST-TAP PREDEFINED QUICK ACTIONS ── */}
      <div className="py-2.5 border-b border-white/[0.06] space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
          1-Tap Driver Status Chips
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {quickActionChips.map((chip, idx) => {
            const Icon = chip.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(chip.label, true)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all active:scale-95 flex-shrink-0',
                  chip.type === 'warning' && 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20',
                  chip.type === 'action' && 'bg-[#FF6B00]/10 border-[#FF6B00]/30 text-[#FF6B00] hover:bg-[#FF6B00]/20',
                  chip.type === 'success' && 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20',
                  chip.type === 'critical' && 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── LIVE CHAT MESSAGES SCROLL AREA ── */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
        {messages.map((msg) => {
          const isDriver = msg.sender === 'driver';

          return (
            <div
              key={msg.id}
              className={cn(
                'flex flex-col max-w-[82%]',
                isDriver ? 'ml-auto items-end' : 'mr-auto items-start'
              )}
            >
              <div
                className={cn(
                  'px-3.5 py-2.5 rounded-2xl text-xs shadow-md',
                  isDriver
                    ? 'bg-gradient-to-r from-[#FF5500] to-[#FF7700] text-white rounded-tr-none font-medium'
                    : 'bg-[#181C28] border border-white/10 text-slate-200 rounded-tl-none leading-relaxed'
                )}
              >
                {msg.text}
              </div>
              <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── MESSAGE INPUT FORM ── */}
      <div className="pt-2 flex items-center gap-2 border-t border-white/10">
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type message to dispatcher..."
          className="bg-[#141722] border-white/10 text-white text-xs rounded-2xl h-11 focus:border-[#FF6B00]"
        />
        <Button
          type="button"
          onClick={() => handleSend()}
          className="h-11 w-11 rounded-2xl bg-[#FF6B00] hover:bg-[#FF7700] text-white flex items-center justify-center p-0 flex-shrink-0 shadow-lg active:scale-95"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
