import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, ShieldCheck, Truck, Package } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-truck');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            SecureHaul
          </h1>
        </div>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </header>
      <main className="flex-grow">
        <section className="relative py-20 md:py-32">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-bold font-headline text-foreground mb-4">
              The Future of Secure Logistics
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Real-time tracking, a dynamic load marketplace, and ironclad
              security for your peace of mind.
            </p>
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Get Started <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <Truck className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-headline font-semibold mb-2">
                  Real-Time Tracking
                </h3>
                <p className="text-muted-foreground">
                  Monitor your fleet with live GPS, fuel levels, and cargo
                  integrity sensors.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Package className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-headline font-semibold mb-2">
                  Load Marketplace
                </h3>
                <p className="text-muted-foreground">
                  Connect with shippers and find the perfect loads for your
                  carriers, effortlessly.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-headline font-semibold mb-2">
                  Enhanced Security
                </h3>
                <p className="text-muted-foreground">
                  Document verification and emergency protocols to protect
                  every haul.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SecureHaul. All rights reserved.</p>
      </footer>
    </div>
  );
}
