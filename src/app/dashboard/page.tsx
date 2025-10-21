'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
  const userType = userData?.userType as 'Shipper' | 'Carrier' | undefined;

  useEffect(() => {
    if (isUserLoading || isUserDataLoading) {
      return;
    }
    if (userType === 'Shipper') {
      router.replace('/dashboard/load-board');
    } else {
      router.replace('/dashboard/tracking');
    }
  }, [router, userType, isUserLoading, isUserDataLoading]);

  return null;
}
