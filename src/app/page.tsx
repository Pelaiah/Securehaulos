'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Ship, Truck, ShieldCheck } from 'lucide-react';
import { SignUpModal } from '@/components/auth/SignUpModal';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-truck-ghost');
  
  return (
    <div className="relative text-foreground">
       {heroImage && (
        <div className="fixed h-screen w-screen top-0 left-0 z-0">
            <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover object-center opacity-50"
            style={{ objectPosition: '65% 50%' }}
            data-ai-hint={heroImage.imageHint}
            priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
      )}
      
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-20 bg-transparent">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold font-headline">
            Suboor Loads
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/subscription">View Trucker Benefits</Link>
          </Button>
          <SignUpModal>
            <Button>Get Your First Load</Button>
          </SignUpModal>
        </div>
      </header>
      
      <main className="min-h-screen flex items-center relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl">
              <h2 className="text-5xl md:text-7xl font-bold font-headline text-foreground mb-4">
                Where freight<br/>meets <span className="text-primary">focus.</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                The intelligent loadboard connecting shippers and carriers with live tracking, unparalleled cargo security, and a network of verified professionals.
              </p>
              <div className="flex flex-col sm:flex-row items-start justify-start gap-4">
                <SignUpModal>
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Your First Load <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </SignUpModal>
              </div>
            </div>
          </div>
      </main>

       <section className="min-h-screen flex flex-col items-center justify-center relative z-10 bg-background py-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-headline">Built for a Secure Supply Chain</h2>
          <p className="text-muted-foreground text-lg mt-2 max-w-2xl mx-auto">
            A unified platform with specialized tools for every link in the logistics chain.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="items-center text-center">
              <div className="p-3 rounded-full bg-primary/10 border border-primary/20 mb-2">
                <Ship className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-headline text-2xl">For Shippers</CardTitle>
              <CardDescription>Post loads, find verified carriers, and track your cargo in real-time with unparalleled visibility.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/50 border-2">
            <CardHeader className="items-center text-center">
              <div className="p-3 rounded-full bg-primary/10 border border-primary/20 mb-2">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-headline text-2xl">For Carriers</CardTitle>
              <CardDescription>Access a board of quality loads, get paid faster, and benefit from our premium membership perks.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="items-center text-center">
              <div className="p-3 rounded-full bg-primary/10 border border-primary/20 mb-2">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-headline text-2xl">Unmatched Security</CardTitle>
              <CardDescription>Leverage our smart security features, including cargo monitoring and emergency alerts, to protect every haul.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
