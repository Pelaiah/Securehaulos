'use client';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignUpFormDriver } from '@/components/auth/SignUpFormDriver';
import { SecureHaulLogo } from '@/components/ui/SecureHaulLogo';

export default function SignUpDriverPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
       <div className="mb-6">
        <SecureHaulLogo size="lg" />
      </div>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Create a Driver Account</CardTitle>
          <CardDescription>
            Sign up as an independent driver or join an existing company.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpFormDriver />
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
