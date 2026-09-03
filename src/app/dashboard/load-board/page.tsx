'use client';

import { useEffect, useMemo, useState } from 'react';
import { LoadCard } from '@/components/dashboard/LoadCard';
import { type Load } from '@/lib/data';
import {
  Search,
  RefreshCw,
  Plus,
  PackagePlus,
  History,
  Layers,
  Truck,
  CheckCheck,
  Radio,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { PendingLoadDetailsDialog } from '@/components/dashboard/shipper/PendingLoadDetailsDialog';
import { PostLoadModal } from '@/components/dashboard/shipper/PostLoadModal';
import { EditLoadModal } from '@/components/dashboard/shipper/EditLoadModal';
import {
  CarrierLoadApplyDialog,
  DEMO_CARRIER_FLEET,
} from '@/components/dashboard/carrier/CarrierLoadApplyDialog';
import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

const INITIAL_DEMO_LOADS: Load[] = [
  {
    id: 'LD-1001',
    shipperId: 'demo-shipper',
    shipper: 'Horizon Ag Logistics',
    origin: 'Harare Ag Hub',
    destination: 'Bulawayo Distribution Center',
    cargo: 'Fresh Produce & Fertilizer',
    equipment: 'Reefer',
    payout: 2850,
    status: 'Posted',
    isPremium: true,
    requiredDocuments: ['Proof of Insurance', 'Carrier Authority', 'Reefer Certification'],
  },
  {
    id: 'LD-1002',
    shipperId: 'demo-shipper',
    shipper: 'Trans-Zim Freight',
    origin: 'Mutare Border Post',
    destination: 'Harare Depot',
    cargo: 'Consumer Electronics & Hardware',
    equipment: 'Dry Van',
    payout: 3400,
    status: 'Posted',
    carrierId: null,
    isPremium: false,
    requiredDocuments: ['Proof of Insurance', 'Carrier Authority', 'W-9 Form'],
  },
  {
    id: 'LD-1003',
    shipperId: 'demo-shipper',
    shipper: 'Apex Mining Supplies',
    origin: 'Kwekwe Industrial',
    destination: 'Beira Port Corridor',
    cargo: 'Heavy Steel Rods & Machinery',
    equipment: 'Flatbed',
    payout: 4200,
    status: 'Posted',
    carrierId: null,
    isPremium: true,
    requiredDocuments: ['Proof of Insurance', 'Carrier Authority', 'Oversize Permit'],
  },
  {
    id: 'LD-1004',
    shipperId: 'demo-shipper',
    shipper: 'Metro Retailers',
    origin: 'Gweru Central',
    destination: 'Masvingo Hub',
    cargo: 'Beverages & Dry Goods',
    equipment: 'Dry Van',
    payout: 1950,
    status: 'Completed',
    carrierId: 'carrier-2',
    isPremium: false,
  },
  {
    id: 'LD-1005',
    shipperId: 'demo-shipper',
    shipper: 'Safari Timber Co.',
    origin: 'Chiredzi Estate',
    destination: 'Harare Wood Works',
    cargo: 'Lumber & Timber Planks',
    equipment: 'Flatbed',
    payout: 3100,
    status: 'Completed',
    carrierId: 'carrier-1',
    isPremium: false,
  },
  {
    id: 'LD-1006',
    shipperId: 'demo-shipper',
    shipper: 'ZimCold Chain Ltd',
    origin: 'Harare Cold Storage',
    destination: 'Victoria Falls Hotel',
    cargo: 'Frozen Goods & Dairy',
    equipment: 'Reefer',
    payout: 3700,
    status: 'Posted',
    isPremium: false,
    requiredDocuments: ['Proof of Insurance', 'Reefer Certification', 'Health & Safety Cert'],
  },
];

// Carrier's accepted/active loads (would come from Supabase in production)
interface CarrierActiveLoad {
  loadId: string;
  truckId: string;
  agreedPrice: number;
  grantedTracking: boolean;
  grantedDocuments: boolean;
  acceptedAt: string;
}

export default function LoadBoardPage() {
  const { user, userProfile, isLoading: isAuthLoading } = useSupabaseAuth();
  const userType = (userProfile?.user_type || user?.user_metadata?.user_type || 'Shipper') as
    | 'Shipper'
    | 'Carrier'
    | 'Driver';
  const isShipper = userType === 'Shipper';

  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [loadToReview, setLoadToReview] = useState<Load | null>(null);
  const [loadToEdit, setLoadToEdit] = useState<Load | null>(null);

  const [isCarrierApplyOpen, setIsCarrierApplyOpen] = useState(false);
  const [isPendingReviewOpen, setIsPendingReviewOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loads, setLoads] = useState<Load[]>([]);
  const [areLoadsLoading, setAreLoadsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'live' | 'my-loads' | 'past' | 'active'>(
    isShipper ? 'live' : 'live'
  );

  // Carrier: track which loads they've accepted in this session
  const [carrierActiveLoads, setCarrierActiveLoads] = useState<CarrierActiveLoad[]>([]);

  const { toast } = useToast();

  const fetchLoads = async () => {
    setAreLoadsLoading(true);
    try {
      const { data, error } = await supabase.from('loads').select('*');
      if (!error && data && data.length > 0) {
        setLoads(data as unknown as Load[]);
      } else {
        setLoads(INITIAL_DEMO_LOADS);
      }
    } catch (err) {
      setLoads(INITIAL_DEMO_LOADS);
    } finally {
      setAreLoadsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, []);

  // Carrier fleet equipment types for eligibility hints on cards
  const carrierEquipmentTypes = useMemo(
    () => DEMO_CARRIER_FLEET.filter((t) => t.status === 'Idle').map((t) => t.equipmentType),
    []
  );

  const filteredLoads = useMemo(() => {
    let result = loads;

    const companyName =
      (userProfile as any)?.company_name ||
      (userProfile ? `${userProfile.first_name} ${userProfile.last_name}`.trim() : '') ||
      'My Shipper Co.';

    if (activeTab === 'live') {
      result = result.filter((l) => l.status === 'Posted' || l.status === 'Pending');
    } else if (activeTab === 'my-loads' && isShipper) {
      result = result.filter(
        (l) => l.shipperId === user?.id || l.shipper === companyName || l.shipperId === 'demo-shipper'
      );
    } else if (activeTab === 'past') {
      result = result.filter((l) => l.status === 'Completed');
    } else if (activeTab === 'active' && !isShipper) {
      // Carrier: show loads they've accepted this session
      const activeIds = carrierActiveLoads.map((a) => a.loadId);
      result = result.filter((l) => activeIds.includes(l.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.cargo.toLowerCase().includes(q) ||
          l.origin.toLowerCase().includes(q) ||
          l.destination.toLowerCase().includes(q) ||
          l.shipper.toLowerCase().includes(q)
      );
    }

    if (equipmentFilter !== 'all') {
      result = result.filter(
        (l) => l.equipment.toLowerCase() === equipmentFilter.toLowerCase()
      );
    }

    return result;
  }, [loads, activeTab, searchQuery, equipmentFilter, user?.id, userProfile, carrierActiveLoads, isShipper]);

  const handleGetLoadClick = (load: Load) => {
    setSelectedLoad(load);
    setIsCarrierApplyOpen(true);
  };

  const handleEditLoadClick = (load: Load) => {
    setLoadToEdit(load);
    setIsEditModalOpen(true);
  };

  const handleReviewApplicationClick = (load: Load) => {
    setLoadToReview(load);
    setIsPendingReviewOpen(true);
  };

  const handleDeleteLoadClick = (loadId: string) => {
    setLoads((prev) => prev.filter((l) => l.id !== loadId));
    toast({ title: 'Load Removed', description: `Load #${loadId} has been archived.` });
  };

  const handlePostNewLoad = async (newLoadData: Omit<Load, 'id'>) => {
    const shipperDisplayName =
      (userProfile as any)?.company_name ||
      (userProfile ? `${userProfile.first_name} ${userProfile.last_name}`.trim() : '') ||
      'My Shipper Co.';

    const newLoad: Load = {
      ...newLoadData,
      id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      shipperId: user?.id || 'demo-shipper',
      shipper: shipperDisplayName,
      status: 'Posted',
    };

    setLoads((prev) => [newLoad, ...prev]);

    try {
      await supabase.from('loads').insert({
        id: newLoad.id,
        shipper_id: newLoad.shipperId,
        origin: newLoad.origin,
        destination: newLoad.destination,
        commodity: newLoad.cargo,
        equipment_type: newLoad.equipment,
        price: newLoad.payout,
        status: 'Posted',
      });
    } catch (e) {
      // Offline fallback
    }

    toast({
      title: 'Load Seeded Successfully',
      description: `Your cargo (${newLoad.cargo}) is now live on the loadboard.`,
    });
  };

  const handleSaveEditedLoad = async (updated: Load) => {
    setLoads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    try {
      await supabase.from('loads').update({
        origin: updated.origin,
        destination: updated.destination,
        commodity: updated.cargo,
        equipment_type: updated.equipment,
        price: updated.payout,
      }).eq('id', updated.id);
    } catch (e) {}
  };

  // Carrier accepted a load → mark it Pending in UI, save to active loads
  const handleLoadAccepted = (loadId: string, truckId: string, agreedPrice: number) => {
    setLoads((prev) =>
      prev.map((l) => (l.id === loadId ? { ...l, status: 'Pending', carrierId: user?.id || 'demo-carrier', assignedTruckId: truckId } : l))
    );
    setCarrierActiveLoads((prev) => [
      ...prev,
      { loadId, truckId, agreedPrice, grantedTracking: false, grantedDocuments: false, acceptedAt: new Date().toISOString() },
    ]);
    toast({
      title: '🚛 Load Accepted!',
      description: `You've committed to this load at $${agreedPrice.toLocaleString()}. Deliver safely!`,
    });
  };

  // Carrier completed delivery → mark Completed
  const handleDeliveryComplete = (loadId: string) => {
    setLoads((prev) =>
      prev.map((l) => (l.id === loadId ? { ...l, status: 'Completed' } : l))
    );
    setCarrierActiveLoads((prev) => prev.filter((a) => a.loadId !== loadId));
    setIsCarrierApplyOpen(false);
    toast({
      title: '✅ Delivery Complete!',
      description: 'All shipper access rights have been revoked. Great job!',
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLoads();
    setTimeout(() => {
      setIsRefreshing(false);
      toast({ title: 'Load Board Refreshed', description: 'Real-time loads synced.' });
    }, 600);
  };

  const isLoading = isAuthLoading || isRefreshing || areLoadsLoading;

  return (
    <>
      <div className="space-y-6">

        {/* ── TOP ACTION BAR ── */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white border border-[#e2e4dd] p-5 rounded-2xl shadow-sm">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-[#171a16] tracking-tight">
                SecureHaul Loadboard
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#e7f4ee] text-[#2c7350]">
                {isShipper ? 'Shipper · Seeder' : 'Carrier · Fetcher'}
              </span>
              {!isShipper && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#2c7350] font-semibold bg-[#e7f4ee] border border-green-300/40 px-2.5 py-1 rounded-full">
                  <Radio className="w-3 h-3 animate-pulse" />
                  {DEMO_CARRIER_FLEET.filter((t) => t.status === 'Idle').length} trucks available
                </div>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#82877c] mt-1">
              {isShipper
                ? 'Seed loads to the board, manage active freight, and approve carrier applications.'
                : 'Browse live freight, check equipment & document eligibility, negotiate rates, and begin delivery.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="h-9.5 text-xs">
              <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {isShipper && (
              <Button
                onClick={() => setIsPostModalOpen(true)}
                className="bg-[#2c7350] hover:bg-[#235c40] text-white shadow-sm text-xs font-semibold h-9.5"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Seed New Load
              </Button>
            )}
          </div>
        </div>

        {/* ── CARRIER: FLEET ELIGIBILITY BANNER ── */}
        {!isShipper && (
          <div className="bg-white border border-[#e2e4dd] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-[13px] font-bold text-[#171a16] mb-1 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#2c7350]" />
                  Your Fleet Eligibility
                </div>
                <p className="text-[11.5px] text-[#82877c]">
                  Cards with a green <strong>✓ Match</strong> badge mean your truck type is compatible. Click
                  any load to check documents and negotiate pricing.
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                {DEMO_CARRIER_FLEET.map((truck) => (
                  <div
                    key={truck.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#e2e4dd] bg-[#f9faf7]"
                  >
                    <div className={`w-2 h-2 rounded-full ${truck.status === 'Idle' ? 'bg-[#4fb583]' : 'bg-amber-400'}`} />
                    <span className="text-[11.5px] font-semibold text-[#171a16]">{truck.name}</span>
                    <span className="text-[10.5px] text-[#82877c]">{truck.equipmentType}</span>
                    <Badge variant="outline" className={`text-[9.5px] ${truck.status === 'Idle' ? 'text-[#2c7350] border-green-300/40' : 'text-amber-500 border-amber-300/40'}`}>
                      {truck.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CARRIER: ACTIVE LOADS SUMMARY ── */}
        {!isShipper && carrierActiveLoads.length > 0 && (
          <div className="bg-[#e7f4ee] border border-green-300/50 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CheckCheck className="w-4 h-4 text-[#2c7350]" />
              <span className="text-[13px] font-bold text-[#2c7350]">
                {carrierActiveLoads.length} Active Load{carrierActiveLoads.length > 1 ? 's' : ''} In Progress
              </span>
            </div>
            <div className="flex gap-3 flex-wrap">
              {carrierActiveLoads.map((active) => {
                const load = loads.find((l) => l.id === active.loadId);
                if (!load) return null;
                return (
                  <button
                    key={active.loadId}
                    type="button"
                    onClick={() => {
                      setSelectedLoad(load);
                      setIsCarrierApplyOpen(true);
                    }}
                    className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border border-[#2c7350]/25 hover:border-[#2c7350] transition-all text-left shadow-xs"
                  >
                    <Truck className="w-4 h-4 text-[#2c7350] shrink-0" />
                    <div>
                      <div className="text-[12px] font-bold text-[#171a16]">{load.cargo}</div>
                      <div className="text-[10.5px] text-[#82877c]">
                        {load.origin} → {load.destination} · ${active.agreedPrice.toLocaleString()}
                      </div>
                    </div>
                    <span className="text-[10px] text-[#2c7350] font-semibold bg-[#e7f4ee] px-2 py-0.5 rounded-full shrink-0">
                      Manage →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TABS & SEARCH ── */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="w-full md:w-auto">
            <TabsList className="bg-[#e7e9e3] p-1 rounded-xl">
              <TabsTrigger value="live" className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Layers className="w-3.5 h-3.5 mr-1.5" />
                Live Board ({loads.filter((l) => l.status === 'Posted').length})
              </TabsTrigger>

              {isShipper && (
                <TabsTrigger value="my-loads" className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <PackagePlus className="w-3.5 h-3.5 mr-1.5" />
                  My Seeded Loads
                </TabsTrigger>
              )}

              {!isShipper && (
                <TabsTrigger value="active" className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
                  My Active Loads ({carrierActiveLoads.length})
                </TabsTrigger>
              )}

              <TabsTrigger value="past" className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <History className="w-3.5 h-3.5 mr-1.5" />
                Past Loads History ({loads.filter((l) => l.status === 'Completed').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search and Filters */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cargo, origin, or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9.5 text-xs bg-white border-[#e2e4dd]"
              />
            </div>
            <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
              <SelectTrigger className="w-[140px] h-9.5 text-xs bg-white border-[#e2e4dd]">
                <SelectValue placeholder="Equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Equipment</SelectItem>
                <SelectItem value="dry van">Dry Van</SelectItem>
                <SelectItem value="reefer">Reefer</SelectItem>
                <SelectItem value="flatbed">Flatbed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── LOADS GRID ── */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <Skeleton className="h-56 rounded-2xl bg-white/70" />
            <Skeleton className="h-56 rounded-2xl bg-white/70" />
            <Skeleton className="h-56 rounded-2xl bg-white/70" />
            <Skeleton className="h-56 rounded-2xl bg-white/70" />
          </div>
        ) : filteredLoads.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredLoads.map((load) => (
              <LoadCard
                key={load.id}
                load={load}
                isShipperView={isShipper}
                carrierEquipmentTypes={!isShipper ? carrierEquipmentTypes : []}
                onGetLoadClick={() => handleGetLoadClick(load)}
                onEditLoadClick={handleEditLoadClick}
                onReviewApplicationClick={handleReviewApplicationClick}
                onDeleteLoadClick={handleDeleteLoadClick}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#e2e4dd] rounded-2xl p-12 text-center">
            <PackagePlus className="w-10 h-10 mx-auto text-[#82877c] mb-3" />
            <h3 className="font-bold text-base text-[#171a16]">No loads match your criteria</h3>
            <p className="text-xs text-[#82877c] mt-1 max-w-sm mx-auto">
              {activeTab === 'past'
                ? 'No completed loads recorded yet.'
                : activeTab === 'active'
                ? 'You have no active loads. Browse the Live Board to pick up freight.'
                : 'Try adjusting your search filters or check back for new postings.'}
            </p>
            {isShipper && (
              <Button
                onClick={() => setIsPostModalOpen(true)}
                className="mt-4 bg-[#2c7350] hover:bg-[#235c40] text-white text-xs h-9"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Seed a Load Now
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ── MODALS ── */}

      {/* Carrier: Multi-step apply dialog */}
      <CarrierLoadApplyDialog
        load={selectedLoad}
        isOpen={isCarrierApplyOpen && !isShipper}
        onOpenChange={setIsCarrierApplyOpen}
        carrierFleet={DEMO_CARRIER_FLEET}
        onLoadAccepted={handleLoadAccepted}
        onDeliveryComplete={handleDeliveryComplete}
      />

      <PendingLoadDetailsDialog
        load={loadToReview}
        isOpen={isPendingReviewOpen}
        onOpenChange={(open) => {
          setIsPendingReviewOpen(open);
          if (!open) fetchLoads();
        }}
      />

      <PostLoadModal
        isOpen={isPostModalOpen}
        onOpenChange={setIsPostModalOpen}
        onPostLoad={handlePostNewLoad}
        companyName={
          (userProfile as any)?.company_name ||
          (userProfile ? `${userProfile.first_name} ${userProfile.last_name}`.trim() : '') ||
          'My Shipper Co.'
        }
      />

      <EditLoadModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        load={loadToEdit}
        onSaveLoad={handleSaveEditedLoad}
      />
    </>
  );
}
