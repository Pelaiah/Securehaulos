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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { useState } from 'react';
import { Loader2, User, Building, Truck } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const shipperSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required.' }),
  companyName: z.string().min(1, { message: 'Company name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  phone: z.string().min(1, { message: 'Phone number is required.' }),
  companyReg: z.string().min(1, { message: 'Company registration number is required.' }),
  taxNumber: z.string().min(1, { message: 'Tax/VAT number is required.' }),
  userType: z.literal('Shipper'),
});

const carrierSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required.' }),
  companyName: z.string().min(1, { message: 'Company name or "Owner-Operator" is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  phone: z.string().min(1, { message: 'Phone number is required.' }),
  fleetSize: z.coerce.number().positive({ message: "Fleet size must be a positive number." }).int(),
  userType: z.literal('Carrier'),
});

const formSchema = z.union([shipperSchema, carrierSchema]);

export function SignUpForm() {
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [userType, setUserType] = useState<'Shipper' | 'Carrier' | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      companyName: '',
      email: '',
      password: '',
      phone: '',
      companyReg: '',
      taxNumber: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      const nameParts = values.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      const userData: any = {
        id: user.uid,
        firstName: firstName,
        lastName: lastName,
        email: values.email,
        userType: values.userType,
        phone: values.phone,
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
          // Re-throw to be caught by the outer catch block
          throw error;
      });

      if (values.userType === 'Shipper') {
        const shipperData = {
          id: user.uid,
          companyName: values.companyName,
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
          );
          throw error;
        });
      } else if (values.userType === 'Carrier') {
        const carrierData = {
          id: user.uid,
          companyName: values.companyName,
          fleetSize: values.fleetSize, 
          premiumMembership: false,
        };
        const carrierDocRef = doc(firestore, 'carriers', user.uid);
        await setDoc(carrierDocRef, carrierData).catch(error => {
          errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
              path: carrierDocRef.path,
              operation: 'create',
              requestResourceData: carrierData,
            })
          );
          throw error;
        });
      }

      toast({
        title: 'Account Created',
        description: "You've been successfully signed up. Redirecting to your dashboard...",
      });
      router.push('/dashboard');

    } catch (error) {
      console.error("Sign up error:", error);
      const firebaseError = error as FirebaseError;
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (firebaseError.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use. Please use a different email.';
      } else if (firebaseError.name === 'FirebaseError') { // Catch Firestore permission errors re-thrown
        errorMessage = 'Could not save user information. Please contact support.'
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
  
  const handleRoleSelect = (role: 'Shipper' | 'Carrier') => {
    setUserType(role);
    form.setValue('userType', role);
    setStep('form');
  };

  if (step === 'role') {
    return (
      <div className="space-y-4 pt-4">
        <h3 className="text-center font-medium">Select your role to get started</h3>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => handleRoleSelect('Shipper')}>
            <Building className="w-8 h-8" />
            <span>Company (Shipper)</span>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => handleRoleSelect('Carrier')}>
            <Truck className="w-8 h-8" />
            <span>Carrier (Driver)</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <Input placeholder={userType === 'Carrier' ? 'e.g. Smith Trucking or Owner-Operator' : 'e.g. National Foods'} {...field} />
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

        {userType === 'Shipper' && (
          <>
            <FormField
              control={form.control}
              name="companyReg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Registration Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter registration number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax/VAT Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tax/vat number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {userType === 'Carrier' && (
          <FormField
            control={form.control}
            name="fleetSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Trucks in Fleet</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setStep('role')} type="button">
            Back
          </Button>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </div>
      </form>
    </Form>
  );
}
