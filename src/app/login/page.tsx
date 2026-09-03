'use client';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { SecureHaulLogo } from '@/components/ui/SecureHaulLogo';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
      <div className="mb-6">
        <SecureHaulLogo size="lg" />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
