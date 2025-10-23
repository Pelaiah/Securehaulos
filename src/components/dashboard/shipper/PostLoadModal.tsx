'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { type Load } from '@/lib/data';

const formSchema = z.object({
  cargo: z.string().min(1, 'Cargo description is required.'),
  payout: z.coerce.number().positive('Payout must be a positive number.'),
  origin: z.string().min(1, 'Pickup location is required.'),
  destination: z.string().min(1, 'Delivery location is required.'),
  equipment: z.enum(['Dry Van', 'Reefer', 'Flatbed']),
});

type PostLoadModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPostLoad: (load: Omit<Load, 'id'>) => void;
  companyName?: string;
};

export function PostLoadModal({
  isOpen,
  onOpenChange,
  onPostLoad,
  companyName,
}: PostLoadModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cargo: '',
      payout: 0,
      origin: '',
      destination: '',
      equipment: 'Dry Van',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newLoad: Omit<Load, 'id'> = {
        ...values,
        shipper: companyName || 'Unknown Shipper',
        isPremium: Math.random() > 0.5,
        status: 'Posted',
      };
      
      onPostLoad(newLoad);
      
      toast({
        title: 'Load Posted Successfully',
        description: `${values.cargo} has been added to the load board.`,
      });
      
      setIsLoading(false);
      onOpenChange(false);
      form.reset();
    }, 1000);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Post a New Load</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new load to the board.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="cargo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Consumer Electronics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="payout"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Payout ($)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g. 2500" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="equipment"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Equipment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select equipment" />
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
            </div>
             <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origin</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Los Angeles, CA" {...field} />
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
                    <Input placeholder="e.g. Phoenix, AZ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Load
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
