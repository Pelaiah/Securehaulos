'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SignUpForm } from './SignUpForm';

export function SignUpModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Create Your SecureHaul Account</DialogTitle>
          <DialogDescription>
            Join the future of secure logistics. It only takes a minute.
          </DialogDescription>
        </DialogHeader>
        <SignUpForm />
      </DialogContent>
    </Dialog>
  );
}
