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
} from 'lucide-react';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
  SidebarFooter,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/dashboard/Header';
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
import { documents, trucks as allTrucks, type Truck as TruckType, tripData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmergencyAlert } from '@/components/dashboard/EmergencyAlert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

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
        return <SidebarTrigger />;
    }
    return null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  
  const shipperTrucks = allTrucks.filter(t => ['TR-001', 'TR-004'].includes(t.id));
  const [selectedTruck, setSelectedTruck] = useState<TruckType | null>(shipperTrucks[0]);
  const [selectedDriver, setSelectedDriver] = useState(tripData[2]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData } = useDoc(userDocRef);
  const userType = userData?.userType;
  const displayTrucks = userType === 'Shipper' ? shipperTrucks : allTrucks;

 const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/chats', icon: MessageSquare, label: 'Chats' },
    { href: '/dashboard/tracking', icon: Truck, label: 'Tracking' },
];

const secondaryNavItems = [
    { 
        id: 'analysis',
        label: 'Analysis',
        icon: BarChart2,
        subItems: []
    },
    {
        id: 'history',
        label: 'History',
        icon: History,
        subItems: []
    }
]


  useEffect(() => {
    if (isUserLoading || !user) {
      return;
    }

    const checkPendingDocuments = () => {
        const hasPendingDocuments = documents.some(doc => doc.status === 'Pending');
        if (hasPendingDocuments) {
            setShowVerificationPrompt(true);
        }
    };
    
    // Check immediately on load
    checkPendingDocuments();

    // Set up an interval to check every hour
    const intervalId = setInterval(checkPendingDocuments, 60 * 60 * 1000); // 1 hour

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);

  }, [user, isUserLoading]);
  
  const handleLogout = () => {
    auth.signOut();
  }

  const handleGoToVerification = () => {
    setShowVerificationPrompt(false);
    router.push('/dashboard/documents');
  }

  const childrenWithProps = Children.map(children, child => {
    if (React.isValidElement(child)) {
      return cloneElement(child, { 
        selectedTruck,
        setSelectedTruck,
        isDetailsOpen,
        setIsDetailsOpen,
        displayTrucks,
        selectedDriver,
        setSelectedDriver,
        userType
      } as any);
    }
    return child;
  });

  return (
    <SidebarProvider>
      <Sidebar variant="floating" collapsible="icon" className="group/sidebar">
        <SidebarHeader className='p-4'>
           <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="shrink-0" asChild>
                    <Link href="/">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </Link>
                </Button>
                <div className='group-data-[collapsible=icon]:hidden'>
                    <h2 className='font-bold text-lg font-headline'>Right Direction</h2>
                    <p className='text-xs text-muted-foreground'>Since 2002</p>
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
                  className="justify-start"
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
             {secondaryNavItems.map((item) => (
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
                                {item.subItems.map(subItem => (
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
            <SidebarFooterButton />
             <div className="flex items-center justify-center gap-2 group-data-[collapsible=icon]:hidden p-2">
                <Button variant="ghost" size="icon"><Sun className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon"><Settings className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon"><BarChart2 className="w-5 h-5" /></Button>
            </div>
            <Button className="w-full justify-center group-data-[collapsible=icon]:hidden">
                <FilePlus className="w-5 h-5" />
                <span className="ml-2">Create New Request</span>
            </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className='bg-background p-0'>
        <main className="flex-1">{childrenWithProps}</main>
        <AlertDialog open={showVerificationPrompt} onOpenChange={setShowVerificationPrompt}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <AlertDialogTitle className="text-center font-headline text-xl">Complete Your Verification</AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                You have pending documents that require your attention. Please upload the required documents to get your account fully verified.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
              <AlertDialogCancel>Do It Later</AlertDialogCancel>
              <AlertDialogAction onClick={handleGoToVerification}>
                Go to Documents
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
