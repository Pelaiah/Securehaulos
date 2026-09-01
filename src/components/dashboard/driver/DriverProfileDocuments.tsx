'use client';

import React from 'react';
import {
  User,
  ShieldCheck,
  Award,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DriverProfile } from './types';
import { cn } from '@/lib/utils';

interface DriverProfileDocumentsProps {
  profile: DriverProfile;
  onLogout?: () => void;
}

export function DriverProfileDocuments({ profile, onLogout }: DriverProfileDocumentsProps) {
  return (
    <div className="flex flex-col gap-4 pb-28 pt-2 px-3 sm:px-4 max-w-lg mx-auto w-full text-slate-100 font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B00]">
            Compliance & Credentials
          </span>
          <h1 className="text-xl font-black text-white">Driver Profile</h1>
        </div>
        <Badge variant="outline" className="bg-[#181B26] border-white/10 text-emerald-400 font-mono">
          ID: {profile.id}
        </Badge>
      </div>

      {/* ── DRIVER PROFILE CARD ── */}
      <div className="rounded-3xl bg-gradient-to-b from-[#1C2030] to-[#121520] border border-white/[0.1] p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-3.5">
          <Avatar className="h-16 w-16 border-2 border-[#FF6B00] shadow-[0_0_15px_rgba(255,107,0,0.3)]">
            <AvatarImage src={profile.photoUrl} alt={profile.name} className="object-cover" />
            <AvatarFallback className="bg-[#141722] text-[#FF6B00] text-lg font-bold">SV</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{profile.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold">
                VERIFIED PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{profile.carrierName}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                ★ {profile.rating}
              </span>
              <span className="text-slate-400 font-mono">
                {profile.completedTrips} Trips
              </span>
              <span className="text-slate-400 font-mono">
                {profile.totalMiles.toLocaleString()} Mi
              </span>
            </div>
          </div>
        </div>

        {/* Safety & Performance Badges */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
          <div className="p-3 rounded-2xl bg-[#0E1015] border border-white/[0.06] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Safety Score</span>
              <p className="text-sm font-black text-white font-mono">{profile.safetyScore}%</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0E1015] border border-white/[0.06] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF6B00]/15 text-[#FF6B00] flex items-center justify-center font-bold text-xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">On-Time Rate</span>
              <p className="text-sm font-black text-white font-mono">{profile.onTimeRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── COMPLIANCE & CREDENTIAL DOCUMENTS VAULT ── */}
      <div className="rounded-3xl bg-[#141722] border border-white/[0.08] p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Mandatory Documents & Certifications
          </span>
          <span className="text-[11px] font-mono text-emerald-400">4 Active</span>
        </div>

        <div className="space-y-2.5">
          {profile.documents.map((doc) => {
            const isExpiring = doc.status === 'Expiring Soon';

            return (
              <div
                key={doc.id}
                className={cn(
                  'p-3.5 rounded-2xl border transition-all space-y-2',
                  isExpiring
                    ? 'bg-amber-500/10 border-amber-500/40'
                    : 'bg-[#0E1015] border-white/[0.06]'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <FileText
                      className={cn(
                        'w-4 h-4 mt-0.5',
                        isExpiring ? 'text-amber-400' : 'text-[#FF6B00]'
                      )}
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{doc.name}</p>
                      <p className="text-[11px] text-slate-400">{doc.type}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] font-mono',
                      isExpiring
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    )}
                  >
                    {doc.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] text-[11px]">
                  <span
                    className={cn(
                      'font-mono font-semibold',
                      isExpiring ? 'text-amber-300' : 'text-slate-400'
                    )}
                  >
                    Expires: {doc.expiryDate} ({doc.daysRemaining} days remaining)
                  </span>
                  <a
                    href={doc.fileUrl}
                    className="text-[#FF6B00] hover:underline font-bold flex items-center gap-0.5"
                  >
                    View <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Logout Action */}
      {onLogout && (
        <Button
          type="button"
          variant="outline"
          onClick={onLogout}
          className="w-full h-12 rounded-2xl bg-transparent border-red-500/30 hover:bg-red-950/30 text-red-400 font-bold text-xs active:scale-95 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          LOGOUT DRIVER SESSION
        </Button>
      )}
    </div>
  );
}
