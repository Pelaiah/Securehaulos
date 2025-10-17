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
} from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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
import { useEffect, useState } from 'react';


const navItems = [
  { href: '/dashboard/tracking', icon: Truck, label: 'Real-Time Tracking' },
  { href: '/dashboard/load-board', icon: Package, label: 'Load Board' },
  { href: '/dashboard/documents', icon: FileText, label: 'Documents' },
  { href: '/dashboard/subscription', icon: Crown, label: 'Subscription' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);

  useEffect(() => {
    // A simple check. In a real app, you'd have a 'verified' field on the user document.
    const isVerified = false; 
    if (!isUserLoading && user && !isVerified) {
      // Using a timeout to prevent the dialog from appearing too abruptly on login
      const timer = setTimeout(() => {
        setShowVerificationPrompt(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
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

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="shrink-0" asChild>
                <Link href="/">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                </Link>
            </Button>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold font-headline text-sidebar-foreground">
                SecureHaul
              </h2>
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
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className='bg-background'>
        <Header title={getTitle()} onLogout={handleLogout} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        <AlertDialog open={showVerificationPrompt} onOpenChange={setShowVerificationPrompt}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <AlertDialogTitle className="text-center font-headline text-xl">Get Your Account Verified</AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                To access all features and start hauling, you need to complete your profile verification. Upload the required documents to get your verification badge.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
              <AlertDialogCancel>Do It Later</AlertDialogCancel>
              <AlertDialogAction onClick={handleGoToVerification}>
                Get Verified Now
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
