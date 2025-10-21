import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Cog, LogOut, User } from "lucide-react";
import Link from 'next/link';

type HeaderProps = {
  title: string;
  onLogout: () => void;
  driverName: string;
};

export function Header({ title, onLogout, driverName }: HeaderProps) {
  return (
    <header className="flex h-16 items-center gap-4 bg-transparent px-4 lg:px-6">
      <div className="w-full flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-lg font-semibold p-0 hover:bg-transparent focus-visible:ring-0">
                    {driverName}
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>John Doe</DropdownMenuItem>
              <DropdownMenuItem>Jane Smith</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
       <div className="flex items-center gap-4">
        <span className="text-muted-foreground text-sm">Wed, 7 March 2023</span>
        <Button variant="outline" className="text-green-400 border-green-400/50 hover:bg-green-400/10 hover:text-green-300">Completed</Button>
        <Button variant="ghost" size="icon">
            <Cog className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
}
