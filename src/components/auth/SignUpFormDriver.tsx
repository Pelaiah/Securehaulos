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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required.' }),
  companySelection: z.string({ required_error: "Please make a selection."}).min(1, "Please make a selection."),
  companyName: z.string().optional(),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  phone: z.string().min(1, { message: 'Phone number is required.' }),
  licenseNumber: z.string().min(1, { message: 'Driver\'s license number is required.' }),
  userType: z.literal('Driver'),
}).refine((data) => {
    if (data.companySelection === 'other') {
        return data.companyName && data.companyName.length > 0;
    }
    return true;
}, {
    message: "Please specify your company name.",
    path: ["companyName"],
});

// Mock list of existing companies. In a real app, this would come from an API.
const existingCompanies = [
    { id: 'swift-transport', name: 'Swift Transport' },
    { id: 'bolt-logistics', name: 'Bolt Logistics' },
    { id: 'apex-freight', name: 'Apex Freight' },
];


export function SignUpFormDriver() {
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      companySelection: '',
      companyName: '',
      email: '',
      password: '',
      phone: '',
      licenseNumber: '',
      userType: 'Driver',
    },
  });

  const companySelection = form.watch("companySelection");
  
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
        userType: formData.userType,
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

      // Note: Here you might want logic to associate the driver with the selected company.
      // For this prototype, we'll just create the driver record.
      const driverData = {
        id: user.uid,
        licenseNumber: formData.licenseNumber,
      };
      const driverDocRef = doc(firestore, 'drivers', user.uid);
      await setDoc(driverDocRef, driverData).catch(error => {
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: driverDocRef.path,
            operation: 'create',
            requestResourceData: driverData,
          })
        );
        throw error;
      });
      
      toast({
        title: 'Account Created',
        description: "You've been successfully signed up as a driver. Redirecting to your dashboard...",
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
          name="companySelection"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Are you an Owner-Operator or joining a company?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="owner-operator">I am an Owner-Operator</SelectItem>
                  {existingCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.name}>
                        {company.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">My company isn't listed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {companySelection === 'other' && (
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Company Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
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
        <FormField
          control={form.control}
          name="licenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Driver's License Number</FormLabel>
              <FormControl>
                <Input placeholder="D123-456-789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Driver Account
          </Button>
        </div>
      </form>
    </Form>
  );
}
