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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { type ShipperLoad } from '@/lib/data';

const formSchema = z.object({
  cargo: z.string().min(1, 'Cargo description is required.'),
  invoiceValue: z.coerce.number().positive('Invoice value must be positive.'),
  pickupLocation: z.string().min(1, 'Pickup location is required.'),
  deliveryLocation: z.string().min(1, 'Delivery location is required.'),
  cargoType: z.string().min(1, 'Cargo type is required.'),
});

type PostLoadModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPostLoad: (load: Omit<ShipperLoad, 'id'>) => void;
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
      cargo: companyName || '',
      invoiceValue: 0,
      pickupLocation: '',
      deliveryLocation: '',
      cargoType: '',
    },
  });

  useEffect(() => {
    if (companyName && !form.formState.isDirty) {
      form.setValue('cargo', companyName);
    }
  }, [companyName, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newLoad: Omit<ShipperLoad, 'id'> = {
        ...values,
        date: new Date().toISOString().split('T')[0],
        afterTax: values.invoiceValue * 0.9, // Assuming 10% tax
        status: 'Awaiting Payment',
      };
      
      onPostLoad(newLoad);
      
      toast({
        title: 'Load Posted Successfully',
        description: `${values.cargo} has been added to your loads.`,
      });
      
      setIsLoading(false);
      onOpenChange(false);
      form.reset({
        cargo: companyName || '',
        invoiceValue: 0,
        pickupLocation: '',
        deliveryLocation: '',
        cargoType: '',
      });
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
                  <FormLabel>Cargo / Company</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. UAB Microsoft" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="cargoType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo Type</FormLabel>
                    <FormControl>
                       <Input placeholder="e.g. General Goods" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="invoiceValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Value ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 1500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="pickupLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Los Angeles, CA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="deliveryLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Location</FormLabel>
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
