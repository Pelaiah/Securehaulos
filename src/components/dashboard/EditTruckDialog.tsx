'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import type { Truck } from '@/lib/data';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wrench } from 'lucide-react';

const truckFormSchema = z.object({
  name: z.string().min(1, { message: 'Truck name is required.' }),
  truckType: z.enum(['Flatbed', 'Reefer', 'Box Truck', 'Tanker'], {
    required_error: 'Please select a truck type.',
  }),
  licensePlate: z.string().min(1, { message: 'License plate is required.' }),
  tonnage: z.coerce.number().positive({ message: 'Tonnage capacity must be a positive number.' }),
  color: z.string().min(1, { message: 'Color is required.' }),
});

type EditTruckDialogProps = {
  truck: Truck | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTruckUpdated?: (updatedTruck: Truck) => void;
};

export function EditTruckDialog({
  truck,
  isOpen,
  onOpenChange,
  onTruckUpdated,
}: EditTruckDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof truckFormSchema>>({
    resolver: zodResolver(truckFormSchema),
    defaultValues: {
      name: '',
      truckType: 'Flatbed',
      licensePlate: '',
      tonnage: 10,
      color: 'White',
    },
  });

  useEffect(() => {
    if (truck) {
      form.reset({
        name: truck.name || 'Alpha Hauler',
        truckType: truck.truckType || 'Flatbed',
        licensePlate: truck.licensePlate || '',
        tonnage: truck.tonnage || 15,
        color: truck.color || 'White',
      });
    }
  }, [truck, form]);

  if (!truck) return null;

  async function onSubmit(values: z.infer<typeof truckFormSchema>) {
    if (!truck) return;
    setIsLoading(true);
    try {
      const isCurrentlyIncomplete = truck?.status === 'Incomplete' || truck?.status === 'Pending';
      const newStatus = isCurrentlyIncomplete ? 'Idle' : truck?.status || 'Idle';

      // Update in Supabase DB if user is connected
      const { error } = await supabase
        .from('trucks')
        .update({
          name: values.name,
          truck_type: values.truckType,
          license_plate: values.licensePlate,
          tonnage: values.tonnage,
          color: values.color,
          status: newStatus,
        })
        .eq('id', truck.id);

      if (error) {
        console.warn('Supabase DB update warning:', error.message);
      }

      const updatedTruck: Truck = {
        ...truck,
        name: values.name,
        truckType: values.truckType,
        licensePlate: values.licensePlate,
        tonnage: values.tonnage,
        color: values.color,
        status: newStatus,
      };

      if (onTruckUpdated) {
        onTruckUpdated(updatedTruck);
      }

      toast({
        title: 'Truck Updated',
        description: `Details saved for ${values.name} (${values.licensePlate}). Status set to ${newStatus}.`,
      });

      onOpenChange(false);
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: err.message || 'Could not update truck details.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            <span>Complete / Edit Truck Details</span>
          </DialogTitle>
          <DialogDescription>
            Specify vehicle type, plate number, capacity, and color to activate this truck.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Truck Name / Identifier</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Echo Hauler #1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="truckType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Flatbed">Flatbed</SelectItem>
                        <SelectItem value="Reefer">Reefer</SelectItem>
                        <SelectItem value="Box Truck">Box Truck</SelectItem>
                        <SelectItem value="Tanker">Tanker</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="licensePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License / Plate Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ABG-9876" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tonnage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity (Tons)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. White / Navy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save & Activate Truck
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
