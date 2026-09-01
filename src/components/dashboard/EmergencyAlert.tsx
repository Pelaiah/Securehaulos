'use client';

import { useState } from 'react';
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
        ) as any,
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
      className="border-b-2 border-destructive/80 bg-destructive/10 animate-pulse p-4 rounded-none border-x-0 border-t-0"
    >
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between'>
            <div className='flex items-center gap-2'>
                <Siren className="h-5 w-5" />
                <AlertTitle className="font-headline text-lg font-bold">
                    RED ALERT: Unauthorized Access!
                </AlertTitle>
                <AlertDescription className="hidden md:block ml-4">
                Unauthorized door opening detected on truck{' '}
                <span className="font-semibold">{truckId}</span>.
                </AlertDescription>
            </div>
            <Button
                onClick={handleFindPolice}
                disabled={isLoading}
                variant="destructive"
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shrink-0 mt-2 sm:mt-0"
            >
                {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                <MapPin className="mr-2 h-4 w-4" />
                )}
                Find Nearest Police Station
            </Button>
        </div>
    </Alert>
  );
}
