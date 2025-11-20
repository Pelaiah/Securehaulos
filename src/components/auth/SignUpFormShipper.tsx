'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const formSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required.' }),
  companyName: z.string().min(1, { message: 'Company name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  phone: z.string().min(1, { message: 'Phone number is required.' }),
});

export function SignUpFormShipper() {
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      companyName: '',
      email: '',
      password: '',
      phone: '',
    },
  });
  
  async function onFormSubmit(formData: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      const userData: any = {
        id: user.uid,
        firstName: firstName,
        lastName: lastName,
        email: formData.email,
        userType: 'Shipper',
        phone: formData.phone,
      };

      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, userData).catch(error => {
          errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
              path: userDocRef.path,
              operation: 'create',
              requestResourceData: userData,
            })
          );
          throw error;
      });
      
      const shipperData = {
          id: user.uid,
          companyName: formData.companyName,
      };
      const shipperDocRef = doc(firestore, 'shippers', user.uid);
      await setDoc(shipperDocRef, shipperData).catch(error => {
          errorEmitter.emit(
              'permission-error',
              new FirestorePermissionError({
                  path: shipperDocRef.path,
                  operation: 'create',
                  requestResourceData: shipperData,
              })
          )
      })

      toast({
        title: 'Account Created',
        description: "You've been successfully signed up. Redirecting to your dashboard...",
      });
      router.push('/dashboard');

    } catch (error) {
      const firebaseError = error as FirebaseError;
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (firebaseError.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use. Please use a different email or log in.';
      } else if (firebaseError.name === 'FirebaseError' && firebaseError.code.startsWith('firestore')) {
        errorMessage = 'Could not save user information due to a database permission issue. Please contact support.';
      }

      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Acme Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Shipper Account
          </Button>
        </div>
      </form>
    </Form>
  );
}
