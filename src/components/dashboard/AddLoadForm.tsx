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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const addLoadSchema = z.object({
  origin: z.string().min(1, 'Origin location is required'),
  destination: z.string().min(1, 'Destination location is required'),
  cargo: z.string().min(1, 'Cargo description is required'),
  equipment: z.enum(['Dry Van', 'Reefer', 'Flatbed'], {
    required_error: 'Please select an equipment type.',
  }),
  payout: z.coerce.number().positive('Payout must be a positive number'),
  cargoWeight: z.coerce.number().positive('Cargo weight must be a positive number'),
  requirements: z.string().optional(),
});

export function AddLoadForm({ onFormSubmit }: { onFormSubmit: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof addLoadSchema>>({
        resolver: zodResolver(addLoadSchema),
        defaultValues: {
            origin: '',
            destination: '',
            cargo: '',
            payout: 0,
            cargoWeight: 0,
            requirements: '',
        },
    });

    async function onSubmit(values: z.infer<typeof addLoadSchema>) {
        setIsLoading(true);
        console.log('Submitting new load:', values);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real app, you'd add this data to Firestore, e.g.:
        // await addDoc(collection(firestore, 'loads'), { ...values, shipperId: user.uid, status: 'Posted' });

        toast({
            title: 'Load Posted Successfully!',
            description: `Your load from ${values.origin} to ${values.destination} is now on the board.`,
        });
        form.reset();
        setIsLoading(false);
        onFormSubmit();
    }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Origin</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Los Angeles, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
                <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Phoenix, AZ" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
            <FormField
            control={form.control}
            name="cargo"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Cargo Details</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., 1 pallet of consumer electronics" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
                control={form.control}
                name="equipment"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Required Equipment</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select equipment type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Dry Van">Dry Van</SelectItem>
                        <SelectItem value="Reefer">Reefer</SelectItem>
                        <SelectItem value="Flatbed">Flatbed</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
                <FormField
                control={form.control}
                name="cargoWeight"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Cargo Weight (kg)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 18000" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
                <FormField
                control={form.control}
                name="payout"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Total Payout ($)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 2500" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
            <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Additional Requirements (Optional)</FormLabel>
                <FormControl>
                    <Textarea placeholder="e.g., Team drivers required, no-touch freight" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Load
        </Button>
        </form>
    </Form>
  );
}
