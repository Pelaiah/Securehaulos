'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { CarrierMyDocuments } from '@/components/dashboard/documents/CarrierMyDocuments';
import { ShipperDocumentsPage } from '@/components/dashboard/documents/ShipperDocumentsPage';

interface DocumentsPageProps {
  userType?: 'Shipper' | 'Carrier';
  isLoading: boolean;
}

export default function DocumentsPage({
  userType,
  isLoading,
}: DocumentsPageProps) {
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

  if (userType === 'Shipper') {
    return <ShipperDocumentsPage />;
  }

  if (userType === 'Carrier') {
    return <CarrierMyDocuments />;
  }

  return (
    <div className="text-center p-8 text-muted-foreground">
      Could not determine user role.
    </div>
  );
}

    