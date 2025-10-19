'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getPoliceStationSuggestion } from '@/app/actions';
import { Siren, Loader2, MapPin } from 'lucide-react';

type EmergencyAlertProps = {
  truckId: string;
  truckLocation: string;
};

export function EmergencyAlert({
  truckId,
  truckLocation,
}: EmergencyAlertProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFindPolice = async () => {
    setIsLoading(true);
    const result = await getPoliceStationSuggestion(truckLocation);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: (
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            <span className="font-semibold">Nearest Police Station</span>
          </div>
        ),
        description: result.suggestion,
        duration: 9000,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };

  return (
    <Alert
      variant="destructive"
      className="mb-6 border-2 border-destructive/80 bg-destructive/10 animate-pulse p-0 overflow-hidden"
    >
      <div className="flex items-center">
         <div className="relative h-28 w-32 hidden md:block">
            <Image 
                src="https://picsum.photos/seed/truck-alert/200/200" 
                alt="Truck" 
                layout="fill" 
                objectFit="cover"
                data-ai-hint="truck side"
            />
        </div>
        <div className="p-4 flex-grow">
          <div className='flex items-center gap-2'>
            <Siren className="h-5 w-5" />
            <AlertTitle className="font-headline text-lg font-bold">
              RED ALERT: Unauthorized Access!
            </AlertTitle>
          </div>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between mt-2">
            <p className="mb-2 sm:mb-0">
              Unauthorized door opening detected on truck{' '}
              <span className="font-semibold">{truckId}</span>.
            </p>
            <Button
              onClick={handleFindPolice}
              disabled={isLoading}
              variant="destructive"
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shrink-0"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="mr-2 h-4 w-4" />
              )}
              Find Nearest Police Station
            </Button>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
