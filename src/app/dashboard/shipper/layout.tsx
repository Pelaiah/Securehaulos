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
  User,
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

  // If user is not a shipper, show a loading skeleton while redirecting.
  if (isLoading || (userType && userType !== 'Shipper')) {
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
      <div className="flex min-h-screen">
        <Sidebar variant='floating' collapsible="icon" className="group/sidebar" side="left">
          <SidebarHeader className='p-3'>
            <div className="flex items-center justify-center">
                  <Button variant="ghost" size="icon" className="shrink-0" asChild>
                      <Link href="/">
                          <ShieldCheck className="w-6 h-6 text-primary" />
                      </Link>
                  </Button>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {shipperNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    className="justify-center"
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-3">
              <div className="flex items-center justify-center">
                  <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </Button>
              </div>
              <div className="flex items-center justify-center">
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.photoURL || "https://i.imgur.com/a/pZtY2rJ.png"} alt="User avatar" data-ai-hint="man avatar" />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
              </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 h-screen overflow-hidden bg-card-alt">{childrenWithProps}</main>
      </div>
    </SidebarProvider>
  );
}
