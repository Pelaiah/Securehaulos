'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Crown,
  FileText,
  Package,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useAuth } from '@/firebase';
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

  const getTitle = () => {
    return (
      navItems.find((item) => pathname.startsWith(item.href))?.label ||
      'Dashboard'
    );
  };
  
  const handleLogout = () => {
    auth.signOut();
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
      </SidebarInset>
    </SidebarProvider>
  );
}
