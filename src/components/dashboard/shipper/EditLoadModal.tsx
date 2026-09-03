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
import { Loader2, Package, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Load } from '@/lib/data';

const editFormSchema = z.object({
  cargo: z.string().min(1, 'Cargo description is required.'),
  payout: z.coerce.number().positive('Payout must be a positive number.'),
  origin: z.string().min(1, 'Pickup location is required.'),
  destination: z.string().min(1, 'Delivery location is required.'),
  equipment: z.enum(['Dry Van', 'Reefer', 'Flatbed']),
});

type EditLoadModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  load: Load | null;
  onSaveLoad: (updatedLoad: Load) => void;
};

export function EditLoadModal({
  isOpen,
  onOpenChange,
  load,
  onSaveLoad,
}: EditLoadModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      cargo: '',
      payout: 0,
      origin: '',
      destination: '',
      equipment: 'Dry Van',
    },
  });

  useEffect(() => {
    if (load) {
      form.reset({
        cargo: load.cargo,
        payout: load.payout,
        origin: load.origin,
        destination: load.destination,
        equipment: load.equipment,
      });
    }
  }, [load, form]);

  if (!load) return null;

  async function onSubmit(values: z.infer<typeof editFormSchema>) {
    if (!load) return;
    setIsLoading(true);

    try {
      const updated: Load = {
        ...load,
        cargo: values.cargo,
        payout: values.payout,
        origin: values.origin,
        destination: values.destination,
        equipment: values.equipment,
      };

      onSaveLoad(updated);
      toast({
        title: 'Load Updated Successfully',
        description: `Load #${load.id} details have been updated on the board.`,
      });
      onOpenChange(false);
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: err.message || 'Could not update the load.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            Edit Seeded Load #{load.id}
          </DialogTitle>
          <DialogDescription>
            Update load specifications, route, and target payout.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
                  <FormLabel>Pickup Location (Origin)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Harare Hub" {...field} />
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
                  <FormLabel>Delivery Location (Destination)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Bulawayo Terminal" {...field} />
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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
