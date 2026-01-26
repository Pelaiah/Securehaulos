'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ship, Truck, User } from 'lucide-react';
import Link from 'next/link';

export function RoleSelectionDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-center">Join Today</DialogTitle>
          <DialogDescription className="text-center">
            Choose the account type that best describes you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
            <Link href="/signup-shipper">
                <Card className="text-center p-6 hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full flex flex-col justify-center items-center">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                            <Ship className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="font-headline">Shipper</CardTitle>
                        <CardDescription>Post loads and connect with our network of verified carriers.</CardDescription>
                    </CardHeader>
                </Card>
            </Link>
             <Link href="/signup">
                <Card className="text-center p-6 hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full flex flex-col justify-center items-center border-2 border-primary shadow-lg">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                            <Truck className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="font-headline">Carrier</CardTitle>
                        <CardDescription>Find quality loads, manage your fleet, and grow your business.</CardDescription>
                    </CardHeader>
                </Card>
            </Link>
             <Link href="/signup-driver">
                <Card className="text-center p-6 hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full flex flex-col justify-center items-center">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                            <User className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="font-headline">Sole Driver</CardTitle>
                        <CardDescription>Operate as an independent driver or join a carrier company.</CardDescription>
                    </CardHeader>
                </Card>
            </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
