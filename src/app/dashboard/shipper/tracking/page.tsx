'use client';

import { redirect } from 'next/navigation';
import { tripData } from '@/lib/data';

export default function TrackingPage() {
  const firstTripId = tripData[0]?.id;
  if (firstTripId) {
    redirect(`/dashboard/shipper/tracking/${firstTripId}`);
  }

  return (
    <div className="flex items-center justify-center h-full">
      <p>No trips available to track.</p>
    </div>
  );
}
