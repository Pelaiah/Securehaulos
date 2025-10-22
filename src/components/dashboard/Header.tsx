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
import { ChevronDown, Cog, LogOut, User, CheckCircle } from "lucide-react";
import Link from 'next/link';

type HeaderProps = {
  title: string;
  onLogout: () => void;
};

export function Header({ title, onLogout }: HeaderProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card-alt px-6">
       <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="text-lg font-semibold md:text-2xl p-0 h-auto">
                {title}
                <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Alex Williams</DropdownMenuItem>
            <DropdownMenuItem>Monika Brown</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
       <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex items-center gap-4">
          <p className="text-sm font-medium">Wed, 7 March 2025</p>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>Completed</span>
          </div>
        </div>
      </div>
    </header>
  );
}
