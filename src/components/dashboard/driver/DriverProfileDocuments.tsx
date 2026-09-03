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
    <div className="flex flex-col gap-4 pb-28 pt-2 px-3 sm:px-4 max-w-lg mx-auto w-full text-[#1C1E21] font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#34785D]">
            Compliance & Credentials
          </span>
          <h1 className="text-xl font-black text-[#1C1E21]">Driver Profile</h1>
        </div>
        <Badge variant="outline" className="bg-[#E8F4EE] border-[#34785D]/20 text-[#34785D] font-mono">
          ID: {profile.id}
        </Badge>
      </div>

      {/* ── DRIVER PROFILE CARD ── */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E1E6E2] p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3.5">
          <Avatar className="h-16 w-16 border-2 border-[#34785D] shadow-sm">
            <AvatarImage src={profile.photoUrl} alt={profile.name} className="object-cover" />
            <AvatarFallback className="bg-[#E8F4EE] text-[#34785D] text-lg font-bold">SV</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#1C1E21]">{profile.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#E8F4EE] text-[#34785D] text-[10px] font-extrabold border border-[#34785D]/20">
                VERIFIED PRO
              </span>
            </div>
            <p className="text-xs text-[#6E737B] mt-0.5">{profile.carrierName}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs">
              <span className="text-amber-600 font-bold flex items-center gap-1">
                ★ {profile.rating}
              </span>
              <span className="text-[#6E737B] font-mono">
                {profile.completedTrips} Trips
              </span>
              <span className="text-[#6E737B] font-mono">
                {profile.totalMiles.toLocaleString()} Mi
              </span>
            </div>
          </div>
        </div>

        {/* Safety & Performance Badges */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E1E6E2]">
          <div className="p-3 rounded-2xl bg-[#F7F8F6] border border-[#E1E6E2] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E8F4EE] text-[#34785D] flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#6E737B]">Safety Score</span>
              <p className="text-sm font-black text-[#1C1E21] font-mono">{profile.safetyScore}%</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F7F8F6] border border-[#E1E6E2] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E8F4EE] text-[#34785D] flex items-center justify-center font-bold text-xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#6E737B]">On-Time Rate</span>
              <p className="text-sm font-black text-[#1C1E21] font-mono">{profile.onTimeRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── COMPLIANCE & CREDENTIAL DOCUMENTS VAULT ── */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E1E6E2] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#6E737B] uppercase tracking-wider">
            Mandatory Documents & Certifications
          </span>
          <span className="text-[11px] font-mono text-[#34785D] font-bold">4 Active</span>
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
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-[#F7F8F6] border-[#E1E6E2]'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <FileText
                      className={cn(
                        'w-4 h-4 mt-0.5',
                        isExpiring ? 'text-amber-600' : 'text-[#34785D]'
                      )}
                    />
                    <div>
                      <p className="text-xs font-bold text-[#1C1E21]">{doc.name}</p>
                      <p className="text-[11px] text-[#6E737B]">{doc.type}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] font-mono',
                      isExpiring
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-[#E8F4EE] text-[#34785D] border-[#34785D]/20'
                    )}
                  >
                    {doc.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#E1E6E2] text-[11px]">
                  <span
                    className={cn(
                      'font-mono font-semibold',
                      isExpiring ? 'text-amber-700' : 'text-[#6E737B]'
                    )}
                  >
                    Expires: {doc.expiryDate} ({doc.daysRemaining} days remaining)
                  </span>
                  <a
                    href={doc.fileUrl}
                    className="text-[#34785D] hover:underline font-bold flex items-center gap-0.5"
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
          className="w-full h-12 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-xs active:scale-95 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          LOGOUT DRIVER SESSION
        </Button>
      )}
    </div>
  );
}
