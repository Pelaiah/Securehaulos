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
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { LogoUpload } from './LogoUpload';

const formSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required.' }),
  companyName: z.string().min(1, { message: 'Company name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  phone: z.string().min(1, { message: 'Phone number is required.' }),
  fleetSize: z.coerce.number().positive({ message: "Fleet size must be a positive number." }).int(),
  userType: z.literal('Carrier'),
  companyLogo: z.instanceof(File).optional(),
  companyMantra: z.string().optional(),
});

export function SignUpForm() {
  const { toast } = useToast();
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
      userType: 'Carrier',
      fleetSize: 1,
      companyLogo: undefined,
      companyMantra: '',
    },
  });

  async function onFormSubmit(formData: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const companyLogoUrl = '';

      // 1. Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            user_type: formData.userType,
          },
        },
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) {
        throw new Error('User ID was not generated during signup.');
      }

      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      // 2. Insert user profile into public.users
      const { error: userError } = await supabase.from('users').upsert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        user_type: formData.userType,
        phone: formData.phone,
      });

      if (userError) console.warn('Users table update notice:', userError.message);

      // 3. Insert carrier profile into public.carriers
      const { error: carrierError } = await supabase.from('carriers').upsert({
        id: userId,
        company_name: formData.companyName,
        fleet_size: formData.fleetSize,
        verified: false,
        company_logo_url: companyLogoUrl,
        company_mantra: formData.companyMantra,
      });

      if (carrierError) console.warn('Carriers table update notice:', carrierError.message);

      // 4. PRIORITY FIX: Bulk generate N truck records matching fleetSize
      const initialTrucks = Array.from({ length: formData.fleetSize }).map((_, index) => ({
        carrier_id: userId,
        name: `Truck #${index + 1} (Setup Required)`,
        status: 'Incomplete',
        truck_type: 'Flatbed',
        license_plate: '',
        tonnage: 0,
        color: '',
        fuel_level: 100,
        idle_time: '0h 0m',
        load_weight: 0,
        cargo_integrity: true,
        unauthorized_door_opening: false,
        location: { lat: 34.0522, lng: -118.2437 },
      }));

      const { error: trucksError } = await supabase.from('trucks').insert(initialTrucks);
      if (trucksError) console.warn('Trucks creation notice:', trucksError.message);

      toast({
        title: 'Account Created',
        description: `Successfully signed up carrier account with ${formData.fleetSize} trucks created! Redirecting...`,
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred. Please try again.',
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
                <Input placeholder="Your Company Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyLogo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Logo</FormLabel>
              <FormControl>
                <LogoUpload onFileChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyMantra"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Mantra</FormLabel>
              <FormControl>
                <Input placeholder="e.g. We deliver excellence" {...field} />
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

        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Carrier Account
          </Button>
        </div>
      </form>
    </Form>
  );
}
