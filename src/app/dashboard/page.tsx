'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (isUserLoading || isUserDataLoading) {
      // Still loading, do nothing
      return;
    }

    if (!user) {
      // If no user, send to login
      router.replace('/login');
      return;
    }

    if (userData) {
      // We have user data, redirect based on role
      const userType = userData.userType;
      if (userType === 'Shipper') {
        router.replace('/dashboard/shipper');
      } else if (userType === 'Carrier') {
        router.replace('/dashboard/carrier');
      } else {
        // Fallback for unknown role, maybe to a generic dashboard or an error page
        console.error("Unknown user type:", userType);
        router.replace('/login'); // Or a generic dashboard
      }
    } else {
      // User is authenticated but has no data in Firestore yet.
      // This can happen briefly during signup. We wait, and the hook will re-run.
      // If this persists, it's an issue. For now, we don't redirect.
      console.log("User authenticated, but user data not yet available. Waiting...");
    }
  }, [user, userData, isUserLoading, isUserDataLoading, router]);

  // Show a loading skeleton while we determine the user's role and redirect
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <Skeleton className="h-full w-full" />
    </div>
  );
}
