'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { CarrierMyDocuments } from '@/components/dashboard/documents/CarrierMyDocuments';
import { ShipperDocumentsPage } from '@/components/dashboard/documents/ShipperDocumentsPage';

import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';

export default function DocumentsPage() {
  const { userProfile, isLoading } = useSupabaseAuth();
  const userType = userProfile?.user_type?.toLowerCase();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (userType === 'carrier') {
    return <CarrierMyDocuments />;
  }

  // Default to Shipper view (covers Shipper role and any edge-case undetermined role in shipper portal)
  return <ShipperDocumentsPage />;
}