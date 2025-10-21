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
  SidebarTrigger,
  SidebarRail,
  SidebarFooter,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuSkeleton,
  SidebarInset,
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
import { Skeleton } from '@/components/ui/skeleton';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
  const userType = userData?.userType as 'Shipper' | 'Carrier' | undefined;
  
  const carrierNavItems = [
    { href: '/dashboard/carrier', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/chats', icon: MessageSquare, label: 'Chats' },
    { href: '/dashboard/my-trucks', icon: Truck, label: 'My Trucks' },
    { href: '/dashboard/my-drivers', icon: Users, label: 'My Drivers' },
    { href: '/dashboard/load-board', icon: Package, label: 'Load Board' },
    { href: '/dashboard/documents', icon: FileText, label: 'Documents' },
    { href: '/dashboard/subscription', icon: ShieldCheck, label: 'Subscription' },
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
    
    checkPendingDocuments();

    const intervalId = setInterval(checkPendingDocuments, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(intervalId);

  }, [user, isUserLoading]);
  
  const handleLogout = () => {
    if(auth) {
      signOut(auth);
      router.push('/login');
    }
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
        displayTrucks: allTrucks,
        selectedDriver,
        setSelectedDriver,
        userType,
        isLoading: isUserDataLoading,
      } as any);
    }
    return child;
  });

  if (isUserDataLoading || isUserLoading) {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <Skeleton className="h-full w-full" />
        </div>
    );
  }

  // If the user is a shipper, don't render the carrier layout.
  // The shipper layout will be rendered by its own layout file.
  if (userType === 'Shipper') {
    return <main>{childrenWithProps}</main>;
  }

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
                    <p className='text-xs text-muted-foreground'>Carrier Portal</p>
                </div>
            </div>
            <SidebarToggleButton />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {carrierNavItems.map((item) => (
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
             <div className="flex items-center justify-center gap-2 p-2">
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </Button>
                <div className='group-data-[collapsible=icon]:hidden flex-1 flex justify-end'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="ghost" className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.photoURL || "https://i.imgur.com/a/pZtY2rJ.png"} alt="User avatar" data-ai-hint="man avatar" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                            <p className="text-sm font-medium">{user?.displayName || user?.email}</p>
                            <p className="text-xs text-muted-foreground">{userType}</p>
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className='bg-background p-6'>
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
