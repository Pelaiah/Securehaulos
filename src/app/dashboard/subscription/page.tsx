import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { subscriptionPlans } from '@/lib/data';
import { Check, Crown } from 'lucide-react';

export default function SubscriptionPage() {
  const { free, premium } = subscriptionPlans;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold font-headline">Subscription Plan</h2>
        <p className="text-muted-foreground">Manage your plan and unlock premium features.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className='font-headline'>{free.name}</CardTitle>
            <CardDescription>{free.price}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2">
              {free.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-primary border-2 relative">
           <div className="absolute -top-4 right-4 bg-primary text-primary-foreground p-2 rounded-full">
                <Crown className="w-6 h-6" />
            </div>
          <CardHeader>
            <CardTitle className='font-headline'>{premium.name}</CardTitle>
            <CardDescription>{premium.price}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <ul className="space-y-2">
              {premium.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              Upgrade to Premium
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
