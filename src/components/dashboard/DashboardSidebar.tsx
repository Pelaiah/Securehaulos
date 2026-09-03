'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  FileText,
  ChartNoAxesColumn,
  Settings,
  Truck,
  Users,
  ShieldCheck,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { SecureHaulLogo } from '@/components/ui/SecureHaulLogo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';
import { cn } from '@/lib/utils';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const SHIPPER_NAVIGATION: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard/shipper',
    icon: LayoutDashboard,
  },
  {
    id: 'loads',
    label: 'Load Board',
    href: '/dashboard/load-board',
    icon: Package,
  },
  {
    id: 'chat',
    label: 'Chats',
    href: '/dashboard/chats',
    icon: MessageSquare,
  },
  {
    id: 'documents',
    label: 'Documents',
    href: '/dashboard/documents',
    icon: FileText,
  },
  {
    id: 'analysis',
    label: 'Analysis',
    href: '/dashboard/analysis',
    icon: ChartNoAxesColumn,
  },
];

const CARRIER_NAVIGATION: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard/carrier',
    icon: LayoutDashboard,
  },
  {
    id: 'loads',
    label: 'Load Board',
    href: '/dashboard/load-board',
    icon: Package,
  },
  {
    id: 'chat',
    label: 'Chats',
    href: '/dashboard/chats',
    icon: MessageSquare,
  },
  {
    id: 'trucks',
    label: 'My Trucks',
    href: '/dashboard/my-trucks',
    icon: Truck,
  },
  {
    id: 'drivers',
    label: 'My Drivers',
    href: '/dashboard/my-drivers',
    icon: Users,
  },
  {
    id: 'documents',
    label: 'Documents',
    href: '/dashboard/documents',
    icon: FileText,
  },
  {
    id: 'analysis',
    label: 'Analysis',
    href: '/dashboard/analysis',
    icon: ChartNoAxesColumn,
  },
  {
    id: 'subscription',
    label: 'Subscription',
    href: '/dashboard/subscription',
    icon: ShieldCheck,
  },
];

const SETTINGS_NAV_ITEM: NavItem = {
  id: 'settings',
  label: 'Settings',
  href: '/dashboard/settings',
  icon: Settings,
};

const isActive = (href: string, pathname: string) => {
  if (href === '/dashboard/shipper' || href === '/dashboard/carrier') {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
};

interface SidebarNavItemProps {
  item: NavItem;
  active: boolean;
}

function SidebarNavItem({ item, active }: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          aria-label={item.label}
          aria-current={active ? 'page' : undefined}
          className={cn(
            'relative w-10 h-10 rounded-[12px] flex items-center justify-center transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34785D]',
            active
              ? 'bg-[#34785D] text-white shadow-sm'
              : 'text-[#6E737B] hover:bg-[#E8F4EE] hover:text-[#34785D]'
          )}
        >
          <Icon className="w-[18px] h-[18px]" />
          {item.badge && item.badge > 0 ? (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#34785D] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[#FFFFFF]">
              {item.badge > 9 ? '9+' : item.badge}
            </span>
          ) : null}
        </Link>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={10}
        className="bg-[#1C1E21] text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg border-0 font-medium"
      >
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userProfile, signOut } = useSupabaseAuth();

  const userType = (userProfile?.user_type || user?.user_metadata?.user_type || 'Shipper') as
    | 'Shipper'
    | 'Carrier'
    | 'Driver';

  const isCarrierRoute = pathname.startsWith('/dashboard/carrier') || pathname.startsWith('/dashboard/my-trucks') || pathname.startsWith('/dashboard/my-drivers');
  const isCarrier = userType === 'Carrier' || isCarrierRoute;
  const navItems = isCarrier ? CARRIER_NAVIGATION : SHIPPER_NAVIGATION;
  const homeHref = isCarrier ? '/dashboard/carrier' : '/dashboard/shipper';

  const initials =
    `${userProfile?.first_name?.[0] || ''}${userProfile?.last_name?.[0] || ''}`.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    'SH';

  const displayName =
    userProfile
      ? `${userProfile.first_name} ${userProfile.last_name}`.trim()
      : user?.email?.split('@')[0] || 'User';

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <TooltipProvider>
      <nav
        aria-label="Main navigation"
        className="w-16 shrink-0 bg-[#FFFFFF] border-r border-[#E1E6E2] hidden md:flex flex-col items-center py-4.5 gap-1.5 select-none h-screen sticky top-0 z-30"
      >
        {/* ── TOP SECUREHAUL BRAND MARK ── */}
        <Link
          href={homeHref}
          aria-label="SecureHaul dashboard"
          className="mb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34785D] rounded-[10px]"
        >
          <div className="w-9 h-9 rounded-[10px] bg-[#34785D] flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
            <SecureHaulLogo variant="icon-only" size="sm" />
          </div>
        </Link>

        {/* ── PRIMARY NAVIGATION ICONS ── */}
        {navItems.map((item) => {
          const active = isActive(item.href, pathname);
          return <SidebarNavItem key={item.id} item={item} active={active} />;
        })}

        {/* ── PINNED BOTTOM SPACER ── */}
        <div className="flex-1" />

        {/* ── SETTINGS NAV ITEM ── */}
        <SidebarNavItem
          item={SETTINGS_NAV_ITEM}
          active={isActive(SETTINGS_NAV_ITEM.href, pathname)}
        />

        {/* ── USER ACCOUNT AVATAR & DROPDOWN ── */}
        <DropdownMenu>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="User profile & account menu"
                  className="w-8.5 h-8.5 rounded-full bg-[#E8F4EE] text-[#34785D] flex items-center justify-center text-xs font-bold shadow-sm hover:ring-2 hover:ring-[#34785D]/40 transition-all focus-visible:outline-none active:scale-95 mt-1"
                >
                  {initials}
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              sideOffset={10}
              className="bg-[#1C1E21] text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg border-0 font-medium"
            >
              Account ({displayName})
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent side="right" sideOffset={14} className="w-56 p-1.5">
            <DropdownMenuLabel className="p-2">
              <p className="text-sm font-bold text-foreground leading-tight">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-semibold uppercase">
                {userType} Portal
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard/settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Account Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard/documents" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>My Documents</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </TooltipProvider>
  );
}
