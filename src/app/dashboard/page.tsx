'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, userProfile, isLoading } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      // Still determining auth state, do nothing
      return;
    }

    if (!user) {
      // Not authenticated — send to login
      router.replace('/login');
      return;
    }

    if (userProfile) {
      // Redirect based on user_type stored in the users table
      if (userProfile.user_type === 'Shipper') {
        router.replace('/dashboard/shipper');
      } else if (userProfile.user_type === 'Driver') {
        router.replace('/dashboard/driver');
      } else {
        router.replace('/dashboard/carrier');
      }
    } else {
      // Fallback if profile takes longer than 1.5s or role is default
      const userTypeMeta = user?.user_metadata?.user_type;
      if (userTypeMeta === 'Driver') {
        router.replace('/dashboard/driver');
      } else if (userTypeMeta === 'Carrier') {
        router.replace('/dashboard/carrier');
      } else {
        router.replace('/dashboard/shipper');
      }
    }
  }, [user, userProfile, isLoading, router]);

  // Show a loading skeleton while we determine the user's role and redirect
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <Skeleton className="h-full w-full" />
    </div>
  );
}
