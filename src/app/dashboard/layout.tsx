'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { Children, cloneElement, useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  FileText,
  Package,
  ShieldCheck,
  Truck,
  Bell,
  PlusCircle,
  LayoutDashboard,
  MessageSquare,
  Users,
  Settings,
  History,
  BarChart2,
  FilePlus,
  Sun,
  Moon,
  Map,
} from 'lucide-react';
import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';
import { supabase } from '@/lib/supabase/client';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail,
  SidebarFooter,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuSkeleton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
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
import { documents, trucks as allTrucks, type Truck as TruckType, tripData, type Load, type Document } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { PostLoadModal } from '@/components/dashboard/shipper/PostLoadModal';

function SidebarToggleButton() {
    const { state } = useSidebar();
    if (state === 'expanded') {
        return <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />;
    }
    return null;
}

function SidebarFooterButton() {
    const { state } = useSidebar();
    if (state === 'collapsed') {
        return (
             <div className="flex items-center justify-center p-2">
                <SidebarTrigger />
            </div>
        );
    }
    return null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, userProfile, isLoading, signOut } = useSupabaseAuth();
  const router = useRouter();
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [isQuickPostOpen, setIsQuickPostOpen] = useState(false);
  
  const shipperTrucks = allTrucks.filter(t => ['TR-001', 'TR-004'].includes(t.id));
  const [selectedTruck, setSelectedTruck] = useState<TruckType | null>(shipperTrucks[0]);
  const [selectedDriver, setSelectedDriver] = useState(tripData[2]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
        document.documentElement.classList.add('dark');
    }
  }, []);

  const changeTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const userType = userProfile?.user_type as 'Shipper' | 'Carrier' | undefined;

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
  
  const carrierNavItems = [
    { href: '/dashboard/carrier', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/chats', icon: MessageSquare, label: 'Chats' },
    { href: '/dashboard/my-trucks', icon: Truck, label: 'My Trucks' },
    { href: '/dashboard/my-drivers', icon: Users, label: 'My Drivers' },
    { href: '/dashboard/load-board', icon: Package, label: 'Load Board' },
    { href: '/dashboard/analysis', icon: BarChart2, label: 'Analysis' },
    { href: '/dashboard/documents', icon: FileText, label: 'Documents' },
    { href: '/dashboard/subscription', icon: ShieldCheck, label: 'Subscription' },
 ];

 const shipperNavItems = [
    { href: '/dashboard/shipper', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/shipper/my-loads', icon: Package, label: 'Loadboard' },
    { href: '/dashboard/shipper/tracking', icon: Truck, label: 'Shipments' },
    { href: '/dashboard/documents', icon: FileText, label: 'Documents' },
    { href: '/dashboard/chats', icon: MessageSquare, label: 'Messages' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

const secondaryNavItems = [
    { 
        id: 'history',
        label: 'History',
        icon: History,
        subItems: []
    }
]

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const handleGoToVerification = () => {
    setShowVerificationPrompt(false);
    if(userType === 'Shipper') {
        router.push('/dashboard/shipper/my-loads');
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
        description: 'You have pending applications from carriers. Please review the documents to approve or reject them.',
        actionText: 'Review Applications'
      };
    }
    return {
      title: 'Complete Your Verification',
      description: 'You have pending documents that require your attention. Please upload the required documents to get your account fully verified.',
      actionText: 'Go to Documents'
    };
  }, [userType]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <Skeleton className="h-full w-full" />
        </div>
    );
  }
  
  const isShipper = userType === 'Shipper';
  const navItems = isShipper ? shipperNavItems : carrierNavItems;

  // Derive display name from Supabase user metadata or profile
  const displayName =
    user?.user_metadata?.full_name ||
    (userProfile ? `${userProfile.first_name} ${userProfile.last_name}`.trim() : null) ||
    user?.email;
  const avatarUrl = user?.user_metadata?.avatar_url || 'https://i.imgur.com/a/pZtY2rJ.png';

  const isDriverRoute = pathname.startsWith('/dashboard/driver');

  if (isDriverRoute) {
    return <div className="w-full min-h-screen bg-[#07080C]">{children}</div>;
  }

  return (
    <SidebarProvider
        style={ isShipper ? { '--sidebar-width': '14rem' } as React.CSSProperties : undefined }
    >
      <Sidebar variant={isShipper ? "sidebar" : "floating"} collapsible="none" className="hidden md:flex group/sidebar bg-card">
        <SidebarHeader className='p-4'>
           <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="shrink-0" asChild>
                    <Link href="/">
                        <Image src="https://i.imgur.com/97msenJ.png" alt="Suboor Loads Logo" width={28} height={28} data-ai-hint="logo" />
                    </Link>
                </Button>
                <div className='group-data-[collapsible=icon]:hidden'>
                    <h2 className='font-bold text-lg font-headline'>{isShipper ? 'Dropify' : 'Right Direction'}</h2>
                </div>
            </div>
            <SidebarToggleButton />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  className={cn("justify-start", pathname.startsWith(item.href) && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground")}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
             {!isShipper && secondaryNavItems.map((item: any) => (
                <SidebarMenuItem key={item.id} asChild>
                    <Collapsible>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                            className="justify-between w-full"
                            variant="default"
                            >
                            <div className='flex items-center gap-2'>
                                <item.icon className="h-5 w-5" />
                                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                            </div>
                            {item.subItems.length > 0 && <ChevronDown className="w-4 h-4 group-data-[collapsible=icon]:hidden" />}
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        {item.subItems.length > 0 && (
                             <CollapsibleContent>
                                <SidebarMenuSub>
                                {item.subItems.map((subItem: any) => (
                                     <SidebarMenuSubItem key={subItem.href}>
                                        <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                                            <Link href={subItem.href}>{subItem.label}</Link>
                                        </SidebarMenuSubButton>
                                     </SidebarMenuSubItem>
                                ))}
                                </SidebarMenuSub>
                             </CollapsibleContent>
                        )}
                    </Collapsible>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="group-data-[collapsible=icon]:p-3">
             <div className={cn("flex items-center justify-center gap-2 p-2", isShipper && "flex-col")}>
                <div className={cn("rounded-md p-1 flex items-center gap-1", isShipper && "bg-background")}>
                  <Button variant={theme === 'light' ? 'secondary' : 'ghost'} size="sm" onClick={() => changeTheme('light')} className={cn(theme === 'light' && 'text-foreground')}>
                    <Sun className="w-4 h-4 mr-2" />
                    Light
                  </Button>
                   <Button variant={theme === 'dark' ? 'secondary' : 'ghost'} size="sm" onClick={() => changeTheme('dark')} className={cn(theme === 'dark' && 'text-foreground')}>
                    <Moon className="w-4 h-4 mr-2" />
                    Dark
                  </Button>
                </div>
                <div className='group-data-[collapsible=icon]:hidden flex-1 flex justify-end'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="ghost" className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={avatarUrl} alt="User avatar" data-ai-hint="man avatar" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                            <p className="text-sm font-medium">{displayName}</p>
                            <p className="text-xs text-muted-foreground">{userType}</p>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className={isShipper ? "w-[var(--sidebar-width)]" : ""}>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                 {isShipper && <SidebarFooterButton />}
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className={cn('overflow-y-auto w-full min-h-screen', isShipper ? '' : 'bg-background md:p-6')}>
        <main className="flex-1 w-full pb-20 md:pb-0">{children}</main>
        
        {/* Floating Mobile Bottom Navigation */}
        <MobileBottomNav userType={userType} onQuickAction={handleQuickAction} />

        {/* Quick Post Load Modal for Mobile Plus Action */}
        <PostLoadModal
          isOpen={isQuickPostOpen}
          onOpenChange={setIsQuickPostOpen}
          onPostLoad={handlePostLoad}
          companyName={userProfile?.user_type === 'Shipper' ? (userProfile as any)?.company_name : undefined}
        />

        <AlertDialog open={showVerificationPrompt} onOpenChange={setShowVerificationPrompt}>
          <AlertDialogContent className="p-4">
            <AlertDialogHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
                  <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <AlertDialogTitle className="text-center font-headline text-lg">{alertContent.title}</AlertDialogTitle>
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
      </SidebarInset>
    </SidebarProvider>
  );
}
