'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import { SignUpModal } from '@/components/auth/SignUpModal';
import { cn } from '@/lib/utils';


export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-truck-ghost');
  
  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover object-center opacity-30"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center relative z-20">
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
            <Button>Post Your First Load</Button>
          </SignUpModal>
        </div>
      </header>
      
      <main className="flex-grow flex items-center relative z-10">
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
                    Post Your First Load <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </SignUpModal>
              </div>
            </div>
          </div>
      </main>
    </div>
  );
}
