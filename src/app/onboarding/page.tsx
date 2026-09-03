'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OnboardingRolePicker() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">How will you be using SecureHaul?</h2>
        <p className="text-sm text-gray-500 mt-2">Select your role to continue your setup.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => router.push('/onboarding/shipper')}>
          <CardHeader>
            <CardTitle>Shipper</CardTitle>
            <CardDescription>I need to post loads and find carriers.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => router.push('/onboarding/carrier')}>
          <CardHeader>
            <CardTitle>Carrier</CardTitle>
            <CardDescription>I manage a fleet and need to find loads.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => router.push('/onboarding/driver')}>
          <CardHeader>
            <CardTitle>Independent Driver</CardTitle>
            <CardDescription>I am an owner-operator looking for loads.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
