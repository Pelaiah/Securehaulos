'use client';

import { useState, useEffect } from 'react';
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
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, Clock, XCircle } from 'lucide-react';
import { SecureHaulLogo } from '@/components/ui/SecureHaulLogo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  licenseNumber: z.string().min(1, { message: 'Driver\'s license number is required.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

export function InvitePageClient({ token }: { token: string }) {
  const { toast } = useToast();
  const router = useRouter();
  
  const [isValidating, setIsValidating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorState, setErrorState] = useState<'expired' | 'used' | 'invalid' | null>(null);
  const [carrierId, setCarrierId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      licenseNumber: '',
      password: '',
    },
  });

  useEffect(() => {
    async function validateToken() {
      try {
        const { data, error } = await supabase
          .from('driver_invitations')
          .select('*')
          .eq('token', token)
          .single();

        if (error || !data) {
          setErrorState('invalid');
          return;
        }

        if (data.used) {
          setErrorState('used');
          return;
        }

        if (new Date(data.expires_at) < new Date()) {
          setErrorState('expired');
          return;
        }

        setCarrierId(data.carrier_id);
      } catch (err) {
        setErrorState('invalid');
      } finally {
        setIsValidating(false);
      }
    }

    validateToken();
  }, [token]);

  async function onFormSubmit(formData: z.infer<typeof formSchema>) {
    if (!carrierId) return;
    setIsSubmitting(true);
    
    try {
      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
            user_type: 'Driver',
          },
        },
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error('User ID was not generated.');

      // 2. Insert into users table as Active (bypass pending since they are invited)
      await supabase.from('users').upsert({
        id: userId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        user_type: 'Driver',
        status: 'Active',
      });

      // 3. Link to carrier in drivers table
      await supabase.from('drivers').upsert({
        id: userId,
        license_number: formData.licenseNumber,
        carrier_id: carrierId,
      });

      // 4. Mark token as used
      await supabase.from('driver_invitations').update({ used: true }).eq('token', token);

      toast({
        title: 'Account Created',
        description: 'You have successfully joined the carrier. Redirecting...',
      });
      router.push('/dashboard/driver');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (errorState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-red-500/20 shadow-lg text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              {errorState === 'expired' ? (
                <Clock className="w-8 h-8 text-red-500" />
              ) : (
                <XCircle className="w-8 h-8 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl font-headline font-bold text-red-600">
              {errorState === 'expired' ? 'Link Expired' : errorState === 'used' ? 'Link Already Used' : 'Invalid Link'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground">
              {errorState === 'expired' 
                ? 'This invitation link has expired because it was not used within 120 seconds. Please ask your carrier to generate a new one.' 
                : errorState === 'used' 
                  ? 'This invitation link has already been used to register an account.' 
                  : 'This link is invalid or malformed.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-6">
        <SecureHaulLogo size="lg" />
      </div>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2 text-[#2c7350] mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Verified Invitation</span>
          </div>
          <CardTitle className="text-2xl font-headline">Join Carrier Firm</CardTitle>
          <CardDescription>
            You've been invited to join an active carrier on SecureHaul. Fill out your details below to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Create Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-4">
                <Button type="submit" className="w-full bg-[#2c7350] hover:bg-[#235c40]" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Complete Registration
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
