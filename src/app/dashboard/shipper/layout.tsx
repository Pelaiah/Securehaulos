'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { cloneElement, useEffect, useMemo, useState, Children } from 'react';
import {
  ChevronDown,
  FileText,
  Package,
  ShieldCheck,
  Truck,
  LayoutDashboard,
  MessageSquare,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
        return (
             <div className="flex items-center justify-center p-2">
                <SidebarTrigger />
            </div>
        );
    }
    return null;
}


export default function ShipperDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const auth = useAuth();
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

  const shipperNavItems = [
    { href: '/dashboard/shipper', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/shipper/my-loads', icon: Package, label: 'My Loads' },
    { href: '/dashboard/documents', icon: FileText, label: 'Documents' },
    { href: '/dashboard/chats', icon: MessageSquare, label: 'Chats' },
    { href: '/dashboard/shipper/tracking', icon: Truck, label: 'Tracking' },
  ];

  useEffect(() => {
    if (!isUserDataLoading && userType && userType !== 'Shipper') {
      router.replace('/dashboard/carrier');
    }
  }, [isUserDataLoading, userType, router]);

  const handleLogout = () => {
    if(auth) {
      signOut(auth);
      router.push('/login');
    }
  }

  const isLoading = isUserLoading || isUserDataLoading;

  const childrenWithProps = Children.map(children, child => {
    if (React.isValidElement(child)) {
      return cloneElement(child, { userType } as any);
    }
    return child;
  });

  if (isLoading || (userType && userType !== 'Shipper')) {
     return (
        <div className="flex items-center justify-center h-screen bg-background">
            <Skeleton className="h-full w-full" />
        </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="group/sidebar" side="left">
        <SidebarHeader className='p-4'>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="shrink-0" asChild>
                <Link href="/">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </Link>
              </Button>
              <div className="group-data-[collapsible=icon]:hidden">
                <h2 className='font-bold text-lg font-headline'>Saboor</h2>
                <p className='text-xs text-muted-foreground'>Shipper Portal</p>
              </div>
            </div>
            <SidebarToggleButton />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {shipperNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{
                    children: item.label,
                    hidden: useSidebar().state === 'expanded'
                  }}
                  className="justify-start"
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
            <div className="flex items-center justify-center gap-2 p-2">
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </Button>
                 <div className='group-data-[collapsible=icon]:hidden flex-1 flex justify-end'>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 w-full justify-start">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.photoURL || "https://i.imgur.com/a/pZtY2rJ.png"} alt="User avatar" data-ai-hint="man avatar" />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div className="text-left flex-1 truncate">
                            <p className="text-sm font-medium truncate">{user?.displayName || user?.email}</p>
                            <p className="text-xs text-muted-foreground truncate">{userType}</p>
                        </div>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[var(--sidebar-width)]">
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-card-alt h-screen overflow-y-auto">
        {childrenWithProps}
      </SidebarInset>
    </SidebarProvider>
  );
}
