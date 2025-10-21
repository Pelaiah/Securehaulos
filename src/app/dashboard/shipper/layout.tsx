'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { Children, cloneElement, useEffect, useMemo, useState } from 'react';
import {
  FileText,
  Package,
  ShieldCheck,
  LayoutDashboard,
  MessageSquare,
  Settings,
  BarChart2,
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
  SidebarFooter,
  useSidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function ShipperDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
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
  
  useEffect(() => {
    if (!isUserDataLoading && userType === 'Carrier') {
      router.replace('/dashboard');
    }
  }, [isUserDataLoading, userType, router]);
  
 const navItems = [
    { href: '/dashboard/shipper', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/load-board', icon: Package, label: 'My Loads' },
    { href: '/dashboard/documents', icon: FileText, label: 'Documents' },
    { href: '/dashboard/chats', icon: MessageSquare, label: 'Chats' },
 ];


  const childrenWithProps = Children.map(children, child => {
    if (React.isValidElement(child)) {
      return cloneElement(child, { 
        userType,
        isLoading: isUserDataLoading,
      } as any);
    }
    return child;
  });

  if (isUserDataLoading || userType !== 'Shipper') {
    return (
        <div className="flex items-center justify-center h-screen">
            <Skeleton className="h-full w-full" />
        </div>
    );
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
                    <p className='text-xs text-muted-foreground'>Shipper Portal</p>
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
                  isActive={pathname === item.href}
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
        <SidebarFooter className="group-data-[collapsible=icon]:p-3">
            <SidebarFooterButton />
             <div className="flex items-center justify-center gap-2 group-data-[collapsible=icon]:hidden p-2">
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" size="icon"><Settings className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon"><BarChart2 className="w-5 h-5" /></Button>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className='bg-background p-6'>
        <main className="flex-1">{childrenWithProps}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}