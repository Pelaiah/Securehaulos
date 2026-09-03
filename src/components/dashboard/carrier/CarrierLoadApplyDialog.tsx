'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  MapPin,
  ArrowRight,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  DollarSign,
  MessageCircle,
  Radio,
  Lock,
  Unlock,
  Package,
  ChevronRight,
  Send,
  ShieldCheck,
  ShieldOff,
  Eye,
  EyeOff,
  CheckCheck,
  Clock,
  Handshake,
  BadgeCheck,
  AlertTriangle,
  Navigation,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  Load,
  NegotiationOffer,
  ChatMessage,
  AccessGrant,
} from '@/lib/data';

// ── CARRIER FLEET MOCK (would come from Supabase in production) ────────────────
export interface CarrierTruck {
  id: string;
  name: string;
  plate: string;
  equipmentType: 'Dry Van' | 'Reefer' | 'Flatbed';
  status: 'Idle' | 'In Transit' | 'Maintenance';
  driver: string;
  driverInitials: string;
  documents: { name: string; status: 'Approved' | 'Pending' | 'Expired' | 'Rejected' }[];
}

export const DEMO_CARRIER_FLEET: CarrierTruck[] = [
  {
    id: 'CARR-TR-01',
    name: 'Alpha Hauler',
    plate: 'AZT 4521',
    equipmentType: 'Dry Van',
    status: 'Idle',
    driver: 'Tendai Moyo',
    driverInitials: 'TM',
    documents: [
      { name: 'Proof of Insurance', status: 'Approved' },
      { name: 'Carrier Authority', status: 'Approved' },
      { name: 'W-9 Form', status: 'Approved' },
      { name: 'Vehicle Registration', status: 'Approved' },
    ],
  },
  {
    id: 'CARR-TR-02',
    name: 'Beta Reefer',
    plate: 'ACE 7412',
    equipmentType: 'Reefer',
    status: 'Idle',
    driver: 'Sarah Willows',
    driverInitials: 'SW',
    documents: [
      { name: 'Proof of Insurance', status: 'Approved' },
      { name: 'Carrier Authority', status: 'Approved' },
      { name: 'Reefer Certification', status: 'Approved' },
      { name: 'W-9 Form', status: 'Pending' },
    ],
  },
  {
    id: 'CARR-TR-03',
    name: 'Gamma Flatbed',
    plate: 'BHK 9184',
    equipmentType: 'Flatbed',
    status: 'In Transit',
    driver: 'James Rutendo',
    driverInitials: 'JR',
    documents: [
      { name: 'Proof of Insurance', status: 'Expired' },
      { name: 'Carrier Authority', status: 'Approved' },
      { name: 'Oversize Permit', status: 'Pending' },
    ],
  },
];

// ── STEPS ─────────────────────────────────────────────────────────────────────
type Step = 'eligibility' | 'negotiation' | 'agreement' | 'access';

const STEP_ORDER: Step[] = ['eligibility', 'negotiation', 'agreement', 'access'];

const STEP_LABELS: Record<Step, string> = {
  eligibility: 'Eligibility',
  negotiation: 'Negotiate',
  agreement: 'Chat Driver',
  access: 'Access Control',
};

// ── PROPS ─────────────────────────────────────────────────────────────────────
interface CarrierLoadApplyDialogProps {
  load: Load | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  carrierFleet?: CarrierTruck[];
  onLoadAccepted?: (loadId: string, truckId: string, agreedPrice: number) => void;
  onDeliveryComplete?: (loadId: string) => void;
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function now() {
  return new Date().toLocaleTimeString('en-ZW', { hour: '2-digit', minute: '2-digit' });
}

const DEFAULT_REQUIRED_DOCS = ['Proof of Insurance', 'Carrier Authority', 'W-9 Form'];

// ═════════════════════════════════════════════════════════════════════════════
export function CarrierLoadApplyDialog({
  load,
  isOpen,
  onOpenChange,
  carrierFleet = DEMO_CARRIER_FLEET,
  onLoadAccepted,
  onDeliveryComplete,
}: CarrierLoadApplyDialogProps) {
  const [step, setStep] = useState<Step>('eligibility');
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);

  // Negotiation state
  const [negoOffers, setNegoOffers] = useState<NegotiationOffer[]>([
    {
      id: 'n-0',
      from: 'shipper',
      amount: load?.payout ?? 0,
      note: 'Listed rate',
      timestamp: now(),
      status: 'pending',
    },
  ]);
  const [counterInput, setCounterInput] = useState<number>((load?.payout ?? 0) + 50);
  const [counterNote, setCounterNote] = useState('');
  const [agreedPrice, setAgreedPrice] = useState<number | null>(null);
  const [negoFinished, setNegoFinished] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'cm-0',
      from: 'driver',
      text: `Hi! I'm ready for pickup at ${load?.origin}. What time shall we schedule?`,
      timestamp: now(),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Access grants state
  const [grants, setGrants] = useState<{ tracking: boolean; documents: boolean }>({
    tracking: false,
    documents: false,
  });
  const [grantLog, setGrantLog] = useState<AccessGrant[]>([]);
  const [deliveryComplete, setDeliveryComplete] = useState(false);

  // Reset when load changes
  useEffect(() => {
    if (load) {
      setStep('eligibility');
      setSelectedTruckId(null);
      setNegoOffers([{
        id: 'n-0',
        from: 'shipper',
        amount: load.payout,
        note: 'Listed rate',
        timestamp: now(),
        status: 'pending',
      }]);
      setCounterInput(load.payout + 50);
      setCounterNote('');
      setAgreedPrice(null);
      setNegoFinished(false);
      setChatMessages([{
        id: 'cm-0',
        from: 'driver',
        text: `Hi! Ready for pickup at ${load.origin}. What time shall we schedule?`,
        timestamp: now(),
      }]);
      setGrants({ tracking: false, documents: false });
      setGrantLog([]);
      setDeliveryComplete(false);
    }
  }, [load?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!load) return null;

  const requiredDocs = load.requiredDocuments ?? DEFAULT_REQUIRED_DOCS;
  const selectedTruck = carrierFleet.find((t) => t.id === selectedTruckId) ?? null;

  // Eligibility checks
  const matchingTrucks = carrierFleet.filter((t) => t.equipmentType === load.equipment);
  const hasMatchingTruck = matchingTrucks.length > 0;
  const truckForCheck = selectedTruck ?? matchingTrucks[0] ?? null;

  const docCheck = requiredDocs.map((reqDoc) => {
    const found = truckForCheck?.documents.find((d) =>
      d.name.toLowerCase().includes(reqDoc.toLowerCase().split(' ')[0])
    );
    return {
      name: reqDoc,
      status: found?.status ?? 'Missing',
      pass: found?.status === 'Approved',
    };
  });

  const allDocsPassed = docCheck.every((d) => d.pass);
  const canApply = hasMatchingTruck && allDocsPassed;
  const selectedTruckFinal = selectedTruck ?? (matchingTrucks[0] ?? null);

  // Negotiation actions
  const handleSendCounter = () => {
    const offer: NegotiationOffer = {
      id: `n-${negoOffers.length}`,
      from: 'carrier',
      amount: counterInput,
      note: counterNote || undefined,
      timestamp: now(),
      status: 'pending',
    };
    setNegoOffers((prev) => [...prev, offer]);
    setCounterNote('');

    // Simulate shipper auto-response after 1.2s
    setTimeout(() => {
      const diff = counterInput - load.payout;
      const accepted = diff <= 80; // shipper accepts if within $80
      const responseOffer: NegotiationOffer = {
        id: `n-${negoOffers.length + 1}`,
        from: 'shipper',
        amount: accepted ? counterInput : Math.round(load.payout + diff * 0.4),
        note: accepted ? 'Accepted ✓' : 'Counter-offer from shipper',
        timestamp: now(),
        status: accepted ? 'accepted' : 'pending',
      };
      setNegoOffers((prev) => [...prev, responseOffer]);
      if (accepted) {
        setAgreedPrice(counterInput);
        setNegoFinished(true);
      } else {
        setCounterInput(responseOffer.amount + 20);
      }
    }, 1200);
  };

  const handleAcceptListedPrice = () => {
    const accepted: NegotiationOffer = {
      id: `n-accept`,
      from: 'carrier',
      amount: load.payout,
      note: 'Accepted listed price',
      timestamp: now(),
      status: 'accepted',
    };
    setNegoOffers((prev) => [...prev, accepted]);
    setAgreedPrice(load.payout);
    setNegoFinished(true);
  };

  // Chat
  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const msg: ChatMessage = {
      id: `cm-${chatMessages.length}`,
      from: 'carrier',
      text: chatInput.trim(),
      timestamp: now(),
    };
    setChatMessages((prev) => [...prev, msg]);
    setChatInput('');

    // Auto driver reply
    const replies = [
      'Got it, will be ready!',
      'Understood. Proceeding to the pickup point.',
      'Confirmed. ETA ~20 minutes.',
      'Copy that. All cargo secured.',
    ];
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `cm-auto-${Date.now()}`,
          from: 'driver',
          text: replies[Math.floor(Math.random() * replies.length)],
          timestamp: now(),
        },
      ]);
    }, 1000);
  };

  // Access grants
  const toggleGrant = (type: 'tracking' | 'documents') => {
    const newVal = !grants[type];
    setGrants((prev) => ({ ...prev, [type]: newVal }));
    const entry: AccessGrant = {
      type,
      grantedTo: 'shipper',
      grantedAt: new Date().toISOString(),
      revokedAt: newVal ? undefined : new Date().toISOString(),
      active: newVal,
    };
    setGrantLog((prev) => [...prev, entry]);
  };

  const handleCompleteDelivery = () => {
    setGrants({ tracking: false, documents: false });
    const revokeTime = new Date().toISOString();
    setGrantLog((prev) => [
      ...prev,
      { type: 'tracking', grantedTo: 'shipper', grantedAt: revokeTime, revokedAt: revokeTime, active: false },
      { type: 'documents', grantedTo: 'shipper', grantedAt: revokeTime, revokedAt: revokeTime, active: false },
    ]);
    setDeliveryComplete(true);
    onDeliveryComplete?.(load.id);
  };

  const currentStepIdx = STEP_ORDER.indexOf(step);

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-hidden flex flex-col p-0 gap-0">
        {/* ── HEADER ── */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-[#e2e4dd] bg-[#f9faf7] flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="font-headline text-xl flex items-center gap-2">
                <Package className="w-5 h-5 text-[#2c7350]" />
                {load.cargo}
              </DialogTitle>
              <DialogDescription className="mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2c7350]" />
                {load.origin}
                <ArrowRight className="w-3 h-3 text-[#b4b8ac]" />
                {load.destination}
                <span className="mx-1 text-[#d3d6cd]">·</span>
                <Truck className="w-3.5 h-3.5" />
                {load.equipment}
                <span className="mx-1 text-[#d3d6cd]">·</span>
                <span className="font-bold text-[#2c7350]">${load.payout.toLocaleString()}</span>
              </DialogDescription>
            </div>
            <Badge variant="outline" className="text-[10px] border-blue-400/40 text-blue-500 bg-blue-50 shrink-0">
              {load.status}
            </Badge>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-1 mt-3">
            {STEP_ORDER.map((s, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = s === step;
              return (
                <React.Fragment key={s}>
                  <div
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all',
                      isCurrent
                        ? 'bg-[#2c7350] text-white shadow-sm'
                        : isPast
                        ? 'bg-[#e7f4ee] text-[#2c7350]'
                        : 'bg-[#f2f3ef] text-[#82877c]'
                    )}
                  >
                    {isPast ? <CheckCheck className="w-3 h-3" /> : null}
                    {STEP_LABELS[s]}
                  </div>
                  {idx < STEP_ORDER.length - 1 && (
                    <div className={cn('h-px w-4 transition-all', isPast ? 'bg-[#2c7350]' : 'bg-[#e2e4dd]')} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </DialogHeader>

        {/* ── BODY (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">

          {/* ════ STEP 1: ELIGIBILITY ════ */}
          {step === 'eligibility' && (
            <div className="space-y-5">
              {/* Truck Matching */}
              <div>
                <h3 className="text-sm font-bold text-[#171a16] mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#2c7350]" />
                  Your Fleet — Equipment Match
                  <span className="text-[11px] font-normal text-[#82877c]">(Load requires: <b>{load.equipment}</b>)</span>
                </h3>
                <div className="space-y-2">
                  {carrierFleet.map((truck) => {
                    const matches = truck.equipmentType === load.equipment;
                    const isSelected = selectedTruckId === truck.id || (!selectedTruckId && matches);
                    return (
                      <button
                        key={truck.id}
                        type="button"
                        onClick={() => matches && truck.status === 'Idle' && setSelectedTruckId(truck.id)}
                        disabled={!matches || truck.status !== 'Idle'}
                        className={cn(
                          'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                          isSelected && matches
                            ? 'border-[#2c7350] bg-[#e7f4ee] shadow-sm'
                            : matches && truck.status === 'Idle'
                            ? 'border-[#e2e4dd] hover:border-[#2c7350]/40 hover:bg-[#f9faf7]'
                            : 'border-[#e2e4dd] opacity-50 cursor-not-allowed bg-[#f9f9f7]'
                        )}
                      >
                        {/* Status icon */}
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                          matches && truck.status === 'Idle' ? 'bg-[#2c7350] text-white' : 'bg-[#e2e4dd] text-[#82877c]'
                        )}>
                          <Truck className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-[#171a16]">{truck.name}</span>
                            <span className="text-[11px] font-mono text-[#82877c]">{truck.plate}</span>
                          </div>
                          <div className="text-[11.5px] text-[#82877c]">
                            {truck.equipmentType} · Driver: {truck.driver}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {truck.status !== 'Idle' && (
                            <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-400/40 bg-amber-50">
                              {truck.status}
                            </Badge>
                          )}
                          {matches ? (
                            <CheckCircle2 className="w-4 h-4 text-[#2c7350]" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Document Check */}
              <div>
                <h3 className="text-sm font-bold text-[#171a16] mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#2c7350]" />
                  Required Documents
                  {truckForCheck && (
                    <span className="text-[11px] font-normal text-[#82877c]">
                      — checking against <b>{truckForCheck.name}</b>
                    </span>
                  )}
                </h3>
                <div className="space-y-2">
                  {docCheck.map((doc) => (
                    <div
                      key={doc.name}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-xl border',
                        doc.pass
                          ? 'border-green-200 bg-green-50/60'
                          : 'border-red-200 bg-red-50/60'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        {doc.pass ? (
                          <CheckCircle2 className="w-4 h-4 text-[#2c7350] shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <span className="text-[13px] font-medium text-[#171a16]">{doc.name}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px]',
                          doc.status === 'Approved'
                            ? 'text-[#2c7350] border-green-400/40 bg-green-50'
                            : doc.status === 'Missing'
                            ? 'text-red-500 border-red-400/40 bg-red-50'
                            : 'text-amber-500 border-amber-400/40 bg-amber-50'
                        )}
                      >
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>

                {!canApply && (
                  <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-[12px] text-amber-700">
                      {!hasMatchingTruck
                        ? `No ${load.equipment} trucks in your fleet. Please add the right equipment before applying.`
                        : 'Some required documents are missing or not approved. Upload them in the Documents tab to qualify.'}
                    </div>
                  </div>
                )}

                {canApply && (
                  <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-[#e7f4ee] border border-green-300/50">
                    <BadgeCheck className="w-4 h-4 text-[#2c7350]" />
                    <span className="text-[12px] text-[#2c7350] font-semibold">
                      Your fleet and documents qualify for this load!
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════ STEP 2: NEGOTIATION ════ */}
          {step === 'negotiation' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#171a16] flex items-center gap-2">
                  <Handshake className="w-4 h-4 text-[#2c7350]" />
                  Price Negotiation
                </h3>
                {agreedPrice !== null && (
                  <Badge className="bg-[#e7f4ee] text-[#2c7350] border-green-300/50 font-bold">
                    Agreed: ${agreedPrice.toLocaleString()} ✓
                  </Badge>
                )}
              </div>

              {/* Offer timeline */}
              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                {negoOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className={cn(
                      'flex gap-3 items-start',
                      offer.from === 'carrier' ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0',
                      offer.from === 'carrier' ? 'bg-[#171a16]' : 'bg-[#2c7350]'
                    )}>
                      {offer.from === 'carrier' ? 'C' : 'S'}
                    </div>
                    <div className={cn(
                      'max-w-[65%] px-3.5 py-2.5 rounded-2xl text-[12.5px]',
                      offer.from === 'carrier'
                        ? 'bg-[#171a16] text-white rounded-tr-sm'
                        : 'bg-[#f2f3ef] text-[#171a16] rounded-tl-sm',
                      offer.status === 'accepted' && 'ring-2 ring-[#2c7350] ring-offset-1'
                    )}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base">${offer.amount.toLocaleString()}</span>
                        {offer.status === 'accepted' && <CheckCircle2 className="w-3.5 h-3.5 text-[#4fb583]" />}
                      </div>
                      {offer.note && (
                        <div className={cn('text-[11px] mt-0.5', offer.from === 'carrier' ? 'text-white/70' : 'text-[#82877c]')}>
                          {offer.note}
                        </div>
                      )}
                      <div className={cn('text-[10px] mt-0.5', offer.from === 'carrier' ? 'text-white/50' : 'text-[#b4b8ac]')}>
                        {offer.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Counter input */}
              {!negoFinished ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#82877c] font-medium mb-1 block">Your Counter ($)</label>
                      <Input
                        type="number"
                        value={counterInput}
                        onChange={(e) => setCounterInput(Number(e.target.value))}
                        className="font-mono font-bold text-[#171a16] h-10"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#82877c] font-medium mb-1 block">Shipper Listed ($)</label>
                      <div className="h-10 flex items-center px-3 border rounded-md bg-[#f9faf7] font-mono font-bold text-[#2c7350]">
                        ${load.payout.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Add a note (optional) — e.g. 'Fuel surcharge included'"
                    value={counterNote}
                    onChange={(e) => setCounterNote(e.target.value)}
                    className="text-[12.5px] resize-none h-16"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSendCounter}
                      className="flex-1 bg-[#171a16] hover:bg-black text-white h-9 text-xs font-semibold"
                    >
                      <Send className="w-3.5 h-3.5 mr-1.5" />
                      Send Counter-Offer
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleAcceptListedPrice}
                      className="flex-1 border-[#2c7350] text-[#2c7350] hover:bg-[#e7f4ee] h-9 text-xs font-semibold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      Accept Listed Price
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4">
                  <div className="w-12 h-12 rounded-full bg-[#e7f4ee] flex items-center justify-center">
                    <Handshake className="w-6 h-6 text-[#2c7350]" />
                  </div>
                  <div className="text-[14px] font-bold text-[#171a16]">Deal agreed at ${agreedPrice?.toLocaleString()}</div>
                  <div className="text-[12px] text-[#82877c]">Both parties have confirmed the freight price.</div>
                </div>
              )}
            </div>
          )}

          {/* ════ STEP 3: DRIVER CHAT ════ */}
          {step === 'agreement' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#171a16] flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#2c7350]" />
                  Chat with Driver — {selectedTruckFinal?.driver ?? 'Assigned Driver'}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2c7350] bg-[#e7f4ee] px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4fb583] animate-pulse" />
                  Online
                </div>
              </div>

              {/* Agreed fare recap */}
              <div className="flex items-center gap-2 px-3 py-2 bg-[#f2f3ef] rounded-xl text-[12px]">
                <CheckCheck className="w-4 h-4 text-[#2c7350]" />
                <span className="text-[#82877c]">Agreed price:</span>
                <span className="font-bold text-[#2c7350] font-mono">${agreedPrice?.toLocaleString() ?? load.payout.toLocaleString()}</span>
                <Separator orientation="vertical" className="h-4" />
                <Truck className="w-3.5 h-3.5 text-[#82877c]" />
                <span className="text-[#82877c]">{selectedTruckFinal?.plate}</span>
              </div>

              {/* Chat messages */}
              <div className="h-52 overflow-y-auto flex flex-col gap-3 pr-1">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn('flex gap-2 items-end', msg.from === 'carrier' ? 'flex-row-reverse' : 'flex-row')}
                  >
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0',
                      msg.from === 'carrier' ? 'bg-[#171a16]' : 'bg-[#2c7350]'
                    )}>
                      {msg.from === 'carrier' ? 'C' : (selectedTruckFinal?.driverInitials ?? 'D')}
                    </div>
                    <div className={cn(
                      'max-w-[72%] px-3.5 py-2 rounded-2xl text-[12.5px]',
                      msg.from === 'carrier'
                        ? 'bg-[#171a16] text-white rounded-br-sm'
                        : 'bg-[#f2f3ef] text-[#171a16] rounded-bl-sm'
                    )}>
                      <div>{msg.text}</div>
                      <div className={cn('text-[10px] mt-0.5', msg.from === 'carrier' ? 'text-white/50' : 'text-[#b4b8ac]')}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat input */}
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                  placeholder="Message driver..."
                  className="text-[13px] h-10"
                />
                <Button
                  onClick={handleSendChat}
                  disabled={!chatInput.trim()}
                  className="w-10 h-10 p-0 bg-[#2c7350] hover:bg-[#235c40] text-white rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ════ STEP 4: ACCESS CONTROL ════ */}
          {step === 'access' && (
            <div className="space-y-5">
              {deliveryComplete ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="w-16 h-16 rounded-full bg-[#e7f4ee] flex items-center justify-center">
                    <BadgeCheck className="w-9 h-9 text-[#2c7350]" />
                  </div>
                  <div className="text-[16px] font-bold text-[#171a16]">Delivery Completed!</div>
                  <div className="text-[12.5px] text-[#82877c] text-center max-w-xs">
                    All shipper access rights have been automatically revoked.
                    Load <b>{load.id}</b> is marked as Completed.
                  </div>
                  <div className="flex flex-col gap-2 w-full max-w-xs">
                    {['tracking', 'documents'].map((type) => (
                      <div key={type} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#f2f3ef] border border-[#e2e4dd]">
                        <div className="flex items-center gap-2 text-[12.5px] font-semibold text-[#82877c]">
                          <ShieldOff className="w-4 h-4" />
                          Shipper {type} access
                        </div>
                        <Badge variant="outline" className="text-[10px] text-red-400 border-red-300/40 bg-red-50">
                          Revoked
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-sm font-bold text-[#171a16] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#2c7350]" />
                    Shipper Access Control
                  </h3>
                  <p className="text-[12.5px] text-[#82877c] -mt-2">
                    Grant the shipper temporary access to track this delivery and view documents.
                    All rights are automatically revoked when you mark delivery as complete.
                  </p>

                  {/* Grant Toggles */}
                  <div className="space-y-3">
                    {/* Tracking Access */}
                    <div
                      className={cn(
                        'flex items-center justify-between p-4 rounded-2xl border transition-all',
                        grants.tracking
                          ? 'border-[#2c7350] bg-[#e7f4ee]'
                          : 'border-[#e2e4dd] bg-white hover:border-[#d3d6cd]'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-9 h-9 rounded-full flex items-center justify-center',
                          grants.tracking ? 'bg-[#2c7350] text-white' : 'bg-[#f2f3ef] text-[#82877c]'
                        )}>
                          <Navigation className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-[#171a16]">Live Tracking Access</div>
                          <div className="text-[11.5px] text-[#82877c]">
                            Shipper can see real-time truck location and ETA
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleGrant('tracking')}
                        aria-label="Toggle tracking access"
                        className={cn(
                          'relative w-11 h-6 rounded-full transition-all flex-shrink-0',
                          grants.tracking ? 'bg-[#2c7350]' : 'bg-[#d3d6cd]'
                        )}
                      >
                        <span className={cn(
                          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                          grants.tracking ? 'translate-x-5' : 'translate-x-0.5'
                        )} />
                      </button>
                    </div>

                    {/* Document Access */}
                    <div
                      className={cn(
                        'flex items-center justify-between p-4 rounded-2xl border transition-all',
                        grants.documents
                          ? 'border-[#2c7350] bg-[#e7f4ee]'
                          : 'border-[#e2e4dd] bg-white hover:border-[#d3d6cd]'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-9 h-9 rounded-full flex items-center justify-center',
                          grants.documents ? 'bg-[#2c7350] text-white' : 'bg-[#f2f3ef] text-[#82877c]'
                        )}>
                          <FileText className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-[#171a16]">Document View Access</div>
                          <div className="text-[11.5px] text-[#82877c]">
                            Shipper can view (not download) cargo & truck documents
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleGrant('documents')}
                        aria-label="Toggle document access"
                        className={cn(
                          'relative w-11 h-6 rounded-full transition-all flex-shrink-0',
                          grants.documents ? 'bg-[#2c7350]' : 'bg-[#d3d6cd]'
                        )}
                      >
                        <span className={cn(
                          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                          grants.documents ? 'translate-x-5' : 'translate-x-0.5'
                        )} />
                      </button>
                    </div>
                  </div>

                  {/* Active Grant Summary */}
                  {(grants.tracking || grants.documents) && (
                    <div className="flex items-start gap-2 p-3.5 rounded-xl bg-white border border-[#2c7350]/25">
                      <Radio className="w-4 h-4 text-[#2c7350] mt-0.5 animate-pulse" />
                      <div>
                        <div className="text-[12px] font-bold text-[#2c7350] mb-0.5">Active Grants to Shipper</div>
                        <div className="text-[11.5px] text-[#82877c] space-y-0.5">
                          {grants.tracking && <div>✓ Live tracking — shipper can see your truck's location</div>}
                          {grants.documents && <div>✓ Documents — shipper can view (read-only) your cargo docs</div>}
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Complete Delivery */}
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div className="text-[12px] text-amber-700">
                        Marking delivery complete will <b>immediately revoke all shipper access</b> and
                        close this load. This cannot be undone.
                      </div>
                    </div>
                    <Button
                      onClick={handleCompleteDelivery}
                      className="w-full bg-[#171a16] hover:bg-black text-white h-10 text-[13px] font-semibold"
                    >
                      <BadgeCheck className="w-4 h-4 mr-2" />
                      Mark Delivery Complete & Revoke Access
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── FOOTER NAV ── */}
        {!deliveryComplete && (
          <div className="px-6 py-4 border-t border-[#e2e4dd] bg-[#f9faf7] flex-shrink-0 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => {
                if (step === 'eligibility') onOpenChange(false);
                else setStep(STEP_ORDER[currentStepIdx - 1]);
              }}
              className="h-9 text-xs border-[#e2e4dd]"
            >
              {step === 'eligibility' ? 'Cancel' : '← Back'}
            </Button>

            {step === 'eligibility' && (
              <Button
                onClick={() => setStep('negotiation')}
                disabled={!canApply}
                className="h-9 text-xs bg-[#2c7350] hover:bg-[#235c40] text-white font-semibold px-6"
              >
                Apply for Load <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}

            {step === 'negotiation' && (
              <Button
                onClick={() => setStep('agreement')}
                disabled={!negoFinished}
                className="h-9 text-xs bg-[#2c7350] hover:bg-[#235c40] text-white font-semibold px-6"
              >
                Chat with Driver <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}

            {step === 'agreement' && (
              <Button
                onClick={() => {
                  setStep('access');
                  onLoadAccepted?.(load.id, selectedTruckFinal?.id ?? '', agreedPrice ?? load.payout);
                }}
                className="h-9 text-xs bg-[#2c7350] hover:bg-[#235c40] text-white font-semibold px-6"
              >
                Begin Delivery & Set Access <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}

            {step === 'access' && (
              <div className="text-[11.5px] text-[#82877c]">
                {grants.tracking || grants.documents
                  ? 'Shipper access is active'
                  : 'No access currently granted'}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
