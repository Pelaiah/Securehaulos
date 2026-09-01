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
      } else {
        router.replace('/dashboard/carrier');
      }
    } else {
      // User is authenticated but profile isn't loaded yet — wait for re-render
      console.log('User authenticated, waiting for profile...');
    }
  }, [user, userProfile, isLoading, router]);

  // Show a loading skeleton while we determine the user's role and redirect
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <Skeleton className="h-full w-full" />
    </div>
  );
}
