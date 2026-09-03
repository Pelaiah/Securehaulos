'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, UserPlus, Link as LinkIcon, Check, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { drivers, type Driver } from '@/lib/data';
import { DriverDetailsDialog } from '@/components/dashboard/DriverDetailsDialog';
import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function MyDriversPage() {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const statusColors = {
    'On-time': 'text-green-400 bg-green-500/10',
    Delayed: 'text-yellow-400 bg-yellow-500/10',
    Alert: 'text-red-400 bg-red-500/10',
    Idle: 'text-gray-400 bg-gray-500/10',
  };

  const handleDriverClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDetailsOpen(true);
  };

  const generateInviteLink = async () => {
    if (!user) return;
    setIsGeneratingLink(true);
    setHasCopied(false);
    
    try {
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 120 * 1000).toISOString(); // 120 seconds

      const { error } = await supabase.from('driver_invitations').insert({
        carrier_id: user.id,
        token: token,
        expires_at: expiresAt,
        used: false
      });

      if (error) throw error;

      const link = `${window.location.origin}/invite/${token}`;
      setGeneratedLink(link);
      setIsLinkDialogOpen(true);
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to generate link',
        description: err.message || 'An error occurred while creating the invitation.'
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setHasCopied(true);
    toast({
      title: 'Link Copied',
      description: 'The invitation link has been copied to your clipboard. It expires in 120 seconds.'
    });
    setTimeout(() => setHasCopied(false), 3000);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">My Drivers</CardTitle>
            <CardDescription>Manage your team of drivers.</CardDescription>
          </div>
          <Button onClick={generateInviteLink} disabled={isGeneratingLink}>
            {isGeneratingLink ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Add Driver
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Assigned Truck</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow 
                  key={driver.id} 
                  onClick={() => handleDriverClick(driver)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={driver.avatar} alt={driver.name} />
                      <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {driver.name}
                  </TableCell>
                  <TableCell>{driver.phone}</TableCell>
                  <TableCell>{driver.truck}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn('border-0', statusColors[driver.status as keyof typeof statusColors])}
                    >
                      {driver.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDriverClick(driver)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem>Assign Truck</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Remove Driver
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <DriverDetailsDialog
        driver={selectedDriver}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Driver</DialogTitle>
            <DialogDescription>
              Share this link with your driver to complete their onboarding. 
              <strong className="text-red-500 block mt-2">Warning: This link is single-use and expires in exactly 120 seconds.</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <Input
                readOnly
                value={generatedLink}
                className="font-mono text-xs text-muted-foreground"
              />
            </div>
            <Button size="sm" onClick={copyToClipboard} className="px-3" variant="secondary">
              <span className="sr-only">Copy</span>
              {hasCopied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
