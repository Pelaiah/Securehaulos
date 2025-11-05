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
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
      <div className="flex items-center gap-2 mb-6">
        <Image src="https://i.imgur.com/97msenJ.png" alt="Suboor Loads Logo" width={40} height={40} data-ai-hint="logo" />
        <h1 className="text-2xl font-bold font-headline text-foreground">
          Suboor Loads
        </h1>
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
