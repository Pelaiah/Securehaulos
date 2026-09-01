'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Truck, Plus, MessageSquare, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileBottomNavProps {
  userType?: 'Shipper' | 'Carrier';
  onQuickAction?: () => void;
}

export function MobileBottomNav({ userType = 'Shipper', onQuickAction }: MobileBottomNavProps) {
  const pathname = usePathname();

  const homeHref = userType === 'Shipper' ? '/dashboard/shipper' : '/dashboard/carrier';
  const trackingHref = userType === 'Shipper' ? '/dashboard/shipper/tracking' : '/dashboard/my-trucks';
  const chatsHref = '/dashboard/chats';
  const settingsHref = userType === 'Shipper' ? '/dashboard/shipper/my-loads' : '/dashboard/subscription';

  const isHomeActive = pathname === '/dashboard/shipper' || pathname === '/dashboard/carrier' || pathname === '/dashboard';
  const isTrackingActive = pathname.includes('/tracking') || pathname.includes('/my-trucks');
  const isChatsActive = pathname.includes('/chats');
  const isSettingsActive = pathname.includes('/settings') || pathname.includes('/subscription') || pathname.includes('/my-loads');

  return (
    <div className="md:hidden fixed bottom-4 inset-x-4 max-w-sm mx-auto z-50 pointer-events-none">
      <nav 
        aria-label="Mobile Navigation"
        className="pointer-events-auto bg-[#171922]/95 dark:bg-[#151720]/95 backdrop-blur-xl border border-white/10 dark:border-white/[0.08] shadow-[0_12px_35px_rgba(0,0,0,0.6)] rounded-full px-4 py-2 flex items-center justify-between"
      >
        {/* Home */}
        <Link
          href={homeHref}
          className={cn(
            "flex flex-col items-center justify-center w-11 h-11 rounded-full transition-all duration-200",
            isHomeActive
              ? "text-primary bg-primary/15 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Home className="w-5 h-5" />
          <span className="sr-only">Home</span>
        </Link>

        {/* Fleet / Tracking */}
        <Link
          href={trackingHref}
          className={cn(
            "flex flex-col items-center justify-center w-11 h-11 rounded-full transition-all duration-200",
            isTrackingActive
              ? "text-primary bg-primary/15 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Truck className="w-5 h-5" />
          <span className="sr-only">Shipments</span>
        </Link>

        {/* Center Floating Plus Action */}
        <button
          type="button"
          onClick={onQuickAction}
          className="relative -top-2.5 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF5500] to-[#FF8000] text-white shadow-[0_6px_20px_rgba(255,107,0,0.5)] active:scale-95 transition-transform duration-150"
          aria-label="Quick Action / Post Load"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Messages */}
        <Link
          href={chatsHref}
          className={cn(
            "relative flex flex-col items-center justify-center w-11 h-11 rounded-full transition-all duration-200",
            isChatsActive
              ? "text-primary bg-primary/15 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="sr-only">Messages</span>
        </Link>

        {/* Settings */}
        <Link
          href={settingsHref}
          className={cn(
            "flex flex-col items-center justify-center w-11 h-11 rounded-full transition-all duration-200",
            isSettingsActive
              ? "text-primary bg-primary/15 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Settings className="w-5 h-5" />
          <span className="sr-only">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
