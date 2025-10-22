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
  Users,
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
    { href: '/dashboard/my-loads', icon: Package, label: 'My Loads' },
    { href: '/dashboard/documents', icon: FileText, label: 'Documents' },
    { href: '/dashboard/chats', icon: MessageSquare, label: 'Chats' },
    { href: '/dashboard/tracking', icon: Truck, label: 'Tracking' },
  ];

  const handleLogout = () => {
    if(auth) {
      signOut(auth);
      router.push('/login');
    }
  }

  // If user is not a shipper, redirect them away.
  if (userType !== 'Shipper') {
     router.replace('/dashboard/carrier');
     return (
        <div className="flex items-center justify-center h-screen bg-background">
            <Skeleton className="h-full w-full" />
        </div>
    );
  }
  
  if (isUserDataLoading || isUserLoading) {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <Skeleton className="h-full w-full" />
        </div>
    );
  }

  const childrenWithProps = Children.map(children, child => {
    if (React.isValidElement(child)) {
      return cloneElement(child, { userType } as any);
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
      </SidebarInset>
    </SidebarProvider>
  );
}
