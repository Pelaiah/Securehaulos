'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Crown,
  FileText,
  Package,
  ShieldCheck,
  Truck,
  Bell,
  PlusCircle,
  LayoutDashboard,
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
import { useEffect, useState, useMemo, Children, cloneElement } from 'react';
import { documents, trucks as allTrucks, type Truck as TruckType } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmergencyAlert } from '@/components/dashboard/EmergencyAlert';

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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData } = useDoc(userDocRef);
  const userType = userData?.userType;
  const displayTrucks = userType === 'Shipper' ? shipperTrucks : allTrucks;

  const navItems = useMemo(() => {

    const baseItems = [
      { href: '/dashboard/tracking', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/dashboard/documents', icon: FileText, label: 'My Documents' },
      { href: '/dashboard/subscription', icon: Crown, label: 'Subscription' },
    ];

    if (userType === 'Shipper') {
      return [
        { href: '/dashboard/tracking', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/dashboard/load-board', icon: PlusCircle, label: 'My Loads' },
        ...baseItems.slice(1), // Add "My Documents" and "Subscription"
      ];
    }
    
    // Default for Carrier and other types
    return [
      { href: '/dashboard/tracking', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/dashboard/load-board', icon: Package, label: 'Load Board' },
      ...baseItems.slice(1), // Add "My Documents" and "Subscription"
    ];
  }, [userData]);


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

  const getTitle = () => {
    return (
      navItems.find((item) => pathname.startsWith(item.href))?.label ||
      'Dashboard'
    );
  };
  
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
        displayTrucks
      } as any);
    }
    return child;
  });

  return (
    <SidebarProvider>
      <Sidebar variant="floating" collapsible="icon">
        <SidebarHeader>
           <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="shrink-0" asChild>
                    <Link href="/">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </Link>
                </Button>
                 <SidebarToggleButton />
            </div>
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
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className="group-data-[collapsible=icon]:hidden flex items-center justify-center p-4">
                 <Avatar>
                  <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
            </div>
            <SidebarFooterButton />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className='bg-background p-0'>
        {selectedTruck?.unauthorizedDoorOpening && pathname === '/dashboard/tracking' && (
            <EmergencyAlert
              truckId={selectedTruck.id}
              truckLocation={`${selectedTruck.location.lat},${selectedTruck.location.lng}`}
            />
          )}
        <Header title={getTitle()} onLogout={handleLogout} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{childrenWithProps}</main>
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
