'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';
import { supabase } from '@/lib/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { PostLoadModal } from '@/components/dashboard/shipper/PostLoadModal';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import type { Load } from '@/lib/data';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, userProfile, isLoading } = useSupabaseAuth();
  const router = useRouter();
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [isQuickPostOpen, setIsQuickPostOpen] = useState(false);

  const userType = userProfile?.user_type as 'Shipper' | 'Carrier' | 'Driver' | undefined;

  // Authorization & Protection Guard
  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }

    if (userProfile?.user_type) {
      if (userProfile.user_type === 'Shipper' && pathname.startsWith('/dashboard/carrier')) {
        router.replace('/dashboard/shipper');
      } else if (userProfile.user_type === 'Carrier' && pathname.startsWith('/dashboard/shipper')) {
        router.replace('/dashboard/carrier');
      }
    }
  }, [user, userProfile, isLoading, pathname, router]);

  const handleGoToVerification = () => {
    setShowVerificationPrompt(false);
    if (userType === 'Shipper') {
      router.push('/dashboard/load-board');
    } else {
      router.push('/dashboard/documents');
    }
  };

  const handleQuickAction = () => {
    if (userType === 'Shipper') {
      setIsQuickPostOpen(true);
    } else {
      router.push('/dashboard/load-board');
    }
  };

  const handlePostLoad = async (newLoadData: Omit<Load, 'id'>) => {
    if (!user) return;
    await supabase.from('loads').insert({
      ...newLoadData,
      shipper_id: user.id,
    });
  };

  const alertContent = useMemo(() => {
    if (userType === 'Shipper') {
      return {
        title: 'Pending Load Applications',
        description:
          'You have pending applications from carriers. Please review the documents to approve or reject them.',
        actionText: 'Review Applications',
      };
    }
    return {
      title: 'Complete Your Verification',
      description:
        'You have pending documents that require your attention. Please upload the required documents to get your account fully verified.',
      actionText: 'Go to Documents',
    };
  }, [userType]);

  const isDriverRoute = pathname.startsWith('/dashboard/driver');
  const isCarrierMainRoute = pathname === '/dashboard/carrier';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F7F8F6]">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (isDriverRoute) {
    return <div className="w-full min-h-screen bg-[#F7F8F6] text-[#1C1E21]">{children}</div>;
  }

  // Carrier main dashboard — sidebar + Fleet OS side-by-side at full viewport height
  if (isCarrierMainRoute) {
    return (
      <div className="flex w-full h-screen bg-[#F7F8F6] text-[#1C1E21] overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 h-screen overflow-hidden bg-[#F7F8F6]">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-[#F7F8F6] text-[#1C1E21] overflow-x-hidden">
      {/* ── SINGLE COMPACT DESKTOP SIDEBAR RAIL ── */}
      <DashboardSidebar />

      {/* ── MAIN APPLICATION VIEWPORT ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        <main className="flex-1 w-full pb-20 md:pb-0">{children}</main>

        {/* Floating Mobile Bottom Navigation */}
        <MobileBottomNav
          userType={userType === 'Driver' ? 'Shipper' : (userType as 'Shipper' | 'Carrier' | undefined)}
          onQuickAction={handleQuickAction}
        />

        {/* Quick Post Load Modal for Mobile Plus Action */}
        <PostLoadModal
          isOpen={isQuickPostOpen}
          onOpenChange={setIsQuickPostOpen}
          onPostLoad={handlePostLoad}
          companyName={
            userProfile?.user_type === 'Shipper'
              ? (userProfile as any)?.company_name
              : undefined
          }
        />

        {/* Verification Alert Dialog */}
        <AlertDialog open={showVerificationPrompt} onOpenChange={setShowVerificationPrompt}>
          <AlertDialogContent className="p-4">
            <AlertDialogHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <AlertDialogTitle className="text-center font-headline text-lg">
                {alertContent.title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-sm">
                {alertContent.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2">
              <AlertDialogCancel>Do It Later</AlertDialogCancel>
              <AlertDialogAction onClick={handleGoToVerification}>
                {alertContent.actionText}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
