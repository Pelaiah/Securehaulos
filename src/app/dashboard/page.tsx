'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  useEffect(() => {
    // Wait until both user and user data are loaded
    if (isUserLoading || isUserDataLoading) {
      return;
    }

    // If there's no user, redirect to login
    if (!user) {
      router.replace('/login');
      return;
    }

    // If user is authenticated but user data is not yet available (e.g., during sign-up),
    // just wait. The hook will re-run when the data becomes available.
    if (!userData) {
      return;
    }

    // Once data is available, redirect based on userType
    if (userData) {
      const userType = userData.userType;
      // All users are redirected to the carrier dashboard
      router.replace('/dashboard/carrier');
    }
  }, [user, userData, isUserLoading, isUserDataLoading, router]);

  // Show a loading skeleton while we determine the route
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <Skeleton className="h-full w-full" />
    </div>
  );
}
