import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell, ChevronDown, PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';

type HeaderProps = {
  title: string;
  onLogout: () => void;
};

export function Header({ title, onLogout }: HeaderProps) {
  const { user } = useUser();
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-card px-6">
      <div>
        <h1 className="text-xl font-bold">Welcome back, {user?.displayName || 'Jack'}!</h1>
        <p className="text-sm text-muted-foreground">You have 5 new delivered parcels.</p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Search />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell />
        </Button>
        <Button asChild>
          <Link href="/dashboard/shipper/my-loads">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create new order
          </Link>
        </Button>
      </div>
    </header>
  );
}
