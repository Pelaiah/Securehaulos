'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, ShieldCheck, Zap, MapPin, BadgeCheck, Star } from 'lucide-react';
import { SignUpModal } from '@/components/auth/SignUpModal';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


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
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <SignUpModal>
            <Button>Sign Up</Button>
          </SignUpModal>
        </div>
      </header>
      <main className="flex-grow">
        <section className="relative py-24 md:py-40">
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
              The Future of Freight is Here.
              <br />
              Secure, Transparent, and On Time.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              SecureHaul is the intelligent loadboard connecting shippers and carriers with live tracking, unparalleled cargo security, and a network of verified professionals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignUpModal>
                <Button size="lg" className="w-full sm:w-auto">
                  Post a Load
                </Button>
              </SignUpModal>
              <SignUpModal>
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700">
                  Find a Load
                </Button>
              </SignUpModal>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-10 text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2">
                  Post & Find Instantly
                </h3>
                <p className="text-muted-foreground">
                  Shippers list loads in minutes. Our powerful filters help Carriers find the perfect job, right away.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2">
                  Work with Trusted Partners
                </h3>
                <p className="text-muted-foreground">
                  Our robust verification system ensures every member is vetted and compliant, building a network you can rely on.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2">
                  Monitor with Confidence
                </h3>
                <p className="text-muted-foreground">
                  Track your shipment from start to finish with live GPS, and get peace of mind with our industry-first cargo security sensor system.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24 bg-card border-y">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <BadgeCheck className="w-8 h-8 text-green-500 mb-2" />
                        <h3 className="text-2xl md:text-3xl font-headline font-semibold mb-4 text-green-400">For Shippers: Unmatched Cargo Security</h3>
                        <p className="text-muted-foreground text-lg">
                          Never wonder about your cargo's safety again. Our unique door sensors trigger a 'Red Alert' if your container is opened before its destination, instantly notifying you and suggesting the nearest law enforcement.
                        </p>
                    </div>
                    <div className="p-8 bg-background rounded-lg shadow-inner">
                        <Image src="https://picsum.photos/seed/alert/600/400" alt="Red Alert Notification Graphic" width={600} height={400} className="rounded-lg" data-ai-hint="alert notification" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                     <div className="p-8 bg-background rounded-lg shadow-inner order-last md:order-first">
                        <Image src="https://picsum.photos/seed/dashboard/600/400" alt="Fleet Management Dashboard" width={600} height={400} className="rounded-lg" data-ai-hint="dashboard map" />
                    </div>
                    <div>
                        <h3 className="text-2xl md:text-3xl font-headline font-semibold mb-4">For Carriers: Advanced Fleet Management</h3>
                        <p className="text-muted-foreground text-lg">
                          Optimize your operations. Your dashboard provides a live map of your fleet, idle-time monitoring, fuel tracking, and load weight data. Everything you need to run more efficiently.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-headline font-semibold mb-4">For Everyone: The SecureHaul Verified Network</h3>
                        <p className="text-muted-foreground text-lg">
                         Trust is built-in. Look for the 'Verified' badge on profiles to connect with fully-vetted companies and carriers. Premium carriers are further highlighted with a 'Sensor-Equipped' badge, signifying the highest level of security.
                        </p>
                    </div>
                     <div className="p-8 bg-background rounded-lg shadow-inner">
                        <Image src="https://picsum.photos/seed/profile/600/400" alt="Verified Profile Card" width={600} height={400} className="rounded-lg" data-ai-hint="profile badge" />
                    </div>
                </div>
            </div>
        </section>

        <section id="testimonials" className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold font-headline text-center mb-12">Trusted by Shippers and Carriers Nationwide</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                                <Avatar className="h-12 w-12 mr-4">
                                    <AvatarImage src="https://i.pravatar.cc/150?u=shipper" />
                                    <AvatarFallback>LM</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">Logistics Manager</p>
                                    <p className="text-sm text-muted-foreground">National Foods</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground italic">&ldquo;The Red Alert system is a game-changer. For the first time, we have true peace of mind. We only book carriers with the SecureHaul sensor now.&rdquo;</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                               <Avatar className="h-12 w-12 mr-4">
                                    <AvatarImage src="https://i.pravatar.cc/150?u=carrier" />
                                    <AvatarFallback>OS</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">Owner</p>
                                    <p className="text-sm text-muted-foreground">Smith & Co. Trucking</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground italic">&ldquo;The premium subscription paid for itself in the first month. We get priority access to the best loads, and shippers trust us more because they can see we're sensor-equipped.&rdquo;</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        <section id="final-cta" className="py-16 md:py-24 bg-card border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground mb-8">
              Ready to Revolutionize Your Logistics?
            </h2>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignUpModal>
                <Button size="lg" className="w-full sm:w-auto">
                  Sign Up as a Shipper
                </Button>
              </SignUpModal>
              <SignUpModal>
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700">
                  Sign Up as a Carrier
                </Button>
              </SignUpModal>
            </div>
          </div>
        </section>

      </main>
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:flex md:items-center md:justify-between">
            <div className="flex justify-center space-x-6 md:order-2">
                <Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">Features</Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">Pricing</Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
                 <p className="text-center text-base text-muted-foreground">&copy; {new Date().getFullYear()} SecureHaul. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
