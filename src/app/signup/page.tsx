'use client';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignUpForm } from '@/components/auth/SignUpForm';
import Image from 'next/image';

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
       <div className="flex items-center gap-2 mb-6">
        <Image src="https://i.imgur.com/97msenJ.png" alt="Suboor Loads Logo" width={40} height={40} data-ai-hint="logo" />
        <h1 className="text-2xl font-bold font-headline text-foreground">
          Suboor Loads
        </h1>
      </div>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>
            Join Suboor Loads to manage your logistics with ease.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
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
