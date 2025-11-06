
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Ship, Truck, ShieldCheck, UserPlus, Search, ThumbsUp } from 'lucide-react';
import { SignUpModal } from '@/components/auth/SignUpModal';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AnimatedText } from '@/components/AnimatedText';
import { useLayoutEffect, useRef } from 'react';
import { gsap, CustomEase, CustomWiggle, ScrollTrigger } from '@/lib/gsap';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-truck-ghost');
  const featureCardsRef = useRef<HTMLDivElement>(null);
  const getStartedRef = useRef<HTMLElement>(null);


  useLayoutEffect(() => {
    if (!featureCardsRef.current) return;
    const cards = featureCardsRef.current.children;

    const ctx = gsap.context(() => {
        gsap.from(cards, {
            y: 50,
            opacity: 0,
            stagger: 0.1,
            ease: 'power3.out',
            duration: 1,
            scrollTrigger: {
                trigger: featureCardsRef.current,
                start: 'top bottom-=150',
                end: 'bottom center',
                scrub: true,
            }
        });
    }, featureCardsRef);

    return () => ctx.revert();

  }, []);

  useLayoutEffect(() => {
    if (!getStartedRef.current) return;

    const ctx = gsap.context(() => {
      const types = [
        { name: 'easeOut', duration: 1.5, property: 'y', value: 30 },
        { name: 'easeInOut', duration: 1.5, property: 'rotation', value: 30 },
        { name: 'anticipate', duration: 3, property: 'y', value: -30 },
      ];
      const wiggles = 10;
      const flairs = gsap.utils.toArray('.flair');
      const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1 });

      types.forEach((type) => {
        CustomWiggle.create('Wiggle.' + type.name, {
          wiggles: wiggles,
          type: type.name,
        });
      });

      flairs.forEach((flair, i) => {
        const wiggle = types[i];
        if (wiggle) {
          tl.to(
            flair,
            {
              [wiggle.property]: wiggle.value,
              duration: wiggle.duration,
              ease: 'Wiggle.' + wiggle.name,
            },
            0
          ); // Start all animations at the same time
        }
      });

      const st = ScrollTrigger.create({
        trigger: getStartedRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => tl.restart(),
        onLeave: () => tl.pause(),
        onEnterBack: () => tl.restart(),
        onLeaveBack: () => tl.pause(),
      });

      return () => {
        st.kill();
        tl.kill();
      };
    }, getStartedRef);

    return () => ctx.revert();
  }, []);
  
  return (
    <div className="relative text-foreground">
       {heroImage && (
        <div className="fixed h-screen w-screen top-0 left-0 z-0">
            <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover object-center opacity-30"
            style={{ objectPosition: '80% 50%' }}
            data-ai-hint={heroImage.imageHint}
            priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
      )}
      
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-20 bg-transparent">
        <div className="flex items-center gap-2">
          <Image src="https://i.imgur.com/97msenJ.png" alt="Suboor Loads Logo" width={28} height={28} data-ai-hint="logo" />
          <h1 className="text-2xl font-bold font-headline">
            Suboor Loads
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="#get-started">Learn How It Works</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </header>
      
      <main className="min-h-screen flex items-center relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl">
              <AnimatedText 
                el="h2"
                text={[
                  { text: 'Where' },
                  { text: 'freight' },
                  { text: 'meets' },
                  { text: 'focus.', className: 'text-primary' },
                ]}
                className="text-5xl md:text-7xl font-bold font-headline text-foreground mb-4"
                stagger={0.1}
              />
              <AnimatedText 
                el="p"
                text="The intelligent loadboard connecting shippers and carriers with live tracking, unparalleled cargo security, and a network of verified professionals."
                className="text-lg md:text-xl text-muted-foreground mb-8"
                delay={0.5}
              />
              <div className="flex flex-col sm:flex-row items-start justify-start gap-4">
                <SignUpModal>
                  <Button size="lg" className="w-full sm:w-auto">
                    Create Account <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </SignUpModal>
              </div>
            </div>
          </div>
      </main>

       <section className="min-h-screen flex flex-col items-center justify-center relative z-10 bg-background py-20 px-4">
        <div className="text-center mb-12">
          <AnimatedText 
            el="h2"
            text="Built for a Secure Supply Chain"
            className="text-4xl font-bold font-headline"
          />
          <AnimatedText
            el="p"
            text="A unified platform with specialized tools for every link in the logistics chain."
            className="text-muted-foreground text-lg mt-2 max-w-2xl mx-auto"
            delay={0.2}
          />
        </div>
        <div ref={featureCardsRef} className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
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
              <CardDescription>Access a board of quality loads, get paid faster, and benefit from instant booking and streamlined communication.</CardDescription>
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

      <section id="get-started" ref={getStartedRef} className="min-h-screen flex flex-col items-center justify-center relative z-10 bg-background py-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-headline">Simple Steps to Get Started</h2>
          <p className="text-muted-foreground text-lg mt-2 max-w-2xl mx-auto">
            Join our network in just a few clicks and start moving freight securely.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl w-full">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-4 rounded-full bg-primary/10 border-4 border-primary/20 flair">
              <UserPlus className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">1. Create Account</h3>
            <p className="text-muted-foreground">Sign up as a shipper or carrier and complete your profile verification in minutes.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-4 rounded-full bg-primary/10 border-4 border-primary/20 flair">
              <Search className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">2. Find or Post Loads</h3>
            <p className="text-muted-foreground">Carriers can browse our exclusive load board, while shippers can post their freight for our verified network.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-4 rounded-full bg-primary/10 border-4 border-primary/20 flair">
              <ThumbsUp className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">3. Haul Securely</h3>
            <p className="text-muted-foreground">Utilize our advanced tracking and security features to ensure every load is safe and on time.</p>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex flex-col items-center justify-center relative z-10 bg-background py-20 px-4">
        <div className="text-center max-w-2xl">
          <h2 className="text-5xl font-bold font-headline mb-4">Ready to Secure Your Shipments?</h2>
          <p className="text-muted-foreground text-xl mb-8">
            Join Suboor Loads today and experience the future of logistics. Fast, secure, and reliable.
          </p>
          <SignUpModal>
            <Button size="lg" className="w-full sm:w-auto">
              Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </SignUpModal>
        </div>
      </section>

    </div>
  );
}
