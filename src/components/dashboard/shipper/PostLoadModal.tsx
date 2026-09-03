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
import { Loader2, MapPin, ArrowRight, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { type Load } from '@/lib/data';
import { cn } from '@/lib/utils';

// ── LOCATION DATA ──────────────────────────────────────────────────────────────
const LOCATION_SUGGESTIONS: Array<{ city: string; province: string; country: string }> = [
  { city: 'Harare', province: 'Harare Province', country: 'Zimbabwe' },
  { city: 'Bulawayo', province: 'Bulawayo Province', country: 'Zimbabwe' },
  { city: 'Mutare', province: 'Manicaland', country: 'Zimbabwe' },
  { city: 'Gweru', province: 'Midlands', country: 'Zimbabwe' },
  { city: 'Masvingo', province: 'Masvingo Province', country: 'Zimbabwe' },
  { city: 'Kwekwe', province: 'Midlands', country: 'Zimbabwe' },
  { city: 'Kadoma', province: 'Mashonaland West', country: 'Zimbabwe' },
  { city: 'Chitungwiza', province: 'Harare Province', country: 'Zimbabwe' },
  { city: 'Norton', province: 'Mashonaland West', country: 'Zimbabwe' },
  { city: 'Chiredzi', province: 'Masvingo Province', country: 'Zimbabwe' },
  { city: 'Beitbridge', province: 'Matabeleland South', country: 'Zimbabwe' },
  { city: 'Ruwa', province: 'Harare Province', country: 'Zimbabwe' },
  { city: 'Marondera', province: 'Mashonaland East', country: 'Zimbabwe' },
  { city: 'Chinhoyi', province: 'Mashonaland West', country: 'Zimbabwe' },
  { city: 'Victoria Falls', province: 'Matabeleland North', country: 'Zimbabwe' },
  { city: 'Hwange', province: 'Matabeleland North', country: 'Zimbabwe' },
  { city: 'Kariba', province: 'Mashonaland West', country: 'Zimbabwe' },
  { city: 'Zvishavane', province: 'Midlands', country: 'Zimbabwe' },
  { city: 'Redcliff', province: 'Midlands', country: 'Zimbabwe' },
  { city: 'Bindura', province: 'Mashonaland Central', country: 'Zimbabwe' },
  // Border / corridor hubs
  { city: 'Mutare Border Post', province: 'Manicaland', country: 'Zimbabwe' },
  { city: 'Beira Port Corridor', province: 'Sofala', country: 'Mozambique' },
  { city: 'Harare Ag Hub', province: 'Harare Province', country: 'Zimbabwe' },
  { city: 'Bulawayo Distribution Center', province: 'Bulawayo Province', country: 'Zimbabwe' },
  { city: 'Harare Depot', province: 'Harare Province', country: 'Zimbabwe' },
  { city: 'Kwekwe Industrial', province: 'Midlands', country: 'Zimbabwe' },
  { city: 'Gweru Central', province: 'Midlands', country: 'Zimbabwe' },
  { city: 'Masvingo Hub', province: 'Masvingo Province', country: 'Zimbabwe' },
  { city: 'Chiredzi Estate', province: 'Masvingo Province', country: 'Zimbabwe' },
  { city: 'Harare Wood Works', province: 'Harare Province', country: 'Zimbabwe' },
];

// ── LOCATION PICKER COMPONENT ─────────────────────────────────────────────────
interface LocationPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  label?: string;
}

function LocationPicker({ value, onChange, placeholder, id, label }: LocationPickerProps) {
  const [query, setQuery] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim().length > 0
    ? LOCATION_SUGGESTIONS.filter((loc) =>
        `${loc.city} ${loc.province} ${loc.country}`.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : LOCATION_SUGGESTIONS.slice(0, 8);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSelect = (loc: typeof LOCATION_SUGGESTIONS[0]) => {
    const label = `${loc.city}, ${loc.country}`;
    setQuery(label);
    onChange(label);
    setIsFocused(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* Input with map pin icon */}
      <div className="relative flex items-center">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2c7350] pointer-events-none z-10" />
        <input
          id={id}
          type="text"
          value={query}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          autoComplete="off"
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background',
            'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            isFocused && 'border-[#2c7350] ring-2 ring-[#2c7350]/20'
          )}
        />
      </div>

      {/* Dropdown */}
      {isFocused && filtered.length > 0 && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-white border border-[#e2e4dd] rounded-xl shadow-[0_8px_24px_-8px_rgba(23,26,22,0.25)] overflow-hidden">
          {/* Search hint */}
          <div className="px-3 py-2 border-b border-[#f2f3ef] flex items-center gap-1.5 text-[11px] text-[#82877c]">
            <Search className="w-3 h-3" />
            <span>{query.trim() ? `Results for "${query}"` : 'Popular locations'}</span>
          </div>

          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.map((loc, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => handleSelect(loc)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[#f4f5f7] transition-colors group"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#e7f4ee] flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-[#2c7350]" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-[#171a16] truncate">
                      {loc.city}
                    </div>
                    <div className="text-[11px] text-[#82877c] truncate">
                      {loc.province} · {loc.country}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {/* Manual entry hint */}
          <div className="border-t border-[#f2f3ef] px-3 py-1.5 text-[10.5px] text-[#82877c]">
            Can't find it? Type a custom location above.
          </div>
        </div>
      )}
    </div>
  );
}

// ── FORM SCHEMA ────────────────────────────────────────────────────────────────
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

    setTimeout(() => {
      const newLoad: Omit<Load, 'id'> = {
        ...values,
        shipper: companyName || 'Unknown Shipper',
        isPremium: Math.random() > 0.5,
        status: 'Posted',
        shipperId: '', // Set by parent
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Cargo */}
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

            {/* Payout + Equipment */}
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

            {/* ── ROUTE LOCATION PICKERS ── */}
            <div className="rounded-xl border border-[#e2e4dd] bg-[#f9faf7] p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#2c7350]" />
                <span className="text-[12px] font-semibold text-[#171a16]">Route</span>
                <ArrowRight className="w-3 h-3 text-[#b4b8ac] mx-1" />
                <span className="text-[11px] text-[#82877c]">Pick-up → Delivery</span>
              </div>

              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-[#171a16] text-white text-[9px] font-bold flex items-center justify-center">A</span>
                        Origin (Pick-up)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <LocationPicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="e.g. Harare Ag Hub"
                        id={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Visual route connector */}
              <div className="flex items-center gap-2 pl-1.5 py-0.5">
                <div className="w-px h-4 bg-[#d3d6cd] ml-[7px]" />
                <span className="text-[10px] text-[#82877c]">→</span>
              </div>

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-[#2c7350] text-white text-[9px] font-bold flex items-center justify-center">B</span>
                        Destination (Delivery)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <LocationPicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="e.g. Bulawayo Distribution Center"
                        id={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#2c7350] hover:bg-[#235c40] text-white"
              >
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