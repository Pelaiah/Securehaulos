'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface InformationCardProps {
  driver?: {
    name: string;
    avatar: string;
  };
}

export function InformationCard({ driver }: InformationCardProps) {
  if (!driver) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Package Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Package Details
        </CardTitle>
        <p className="text-sm text-muted-foreground">Electronics | In progress</p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-sm mb-4">
          <div>
            <p className="text-muted-foreground">Weight</p>
            <p className="font-semibold">28 lbs</p>
          </div>
          <div>
            <p className="text-muted-foreground">Length</p>
            <p className="font-semibold">10.2 in</p>
          </div>
          <div>
            <p className="text-muted-foreground">Height</p>
            <p className="font-semibold">8.5 in</p>
          </div>
        </div>

        <p className="text-sm font-medium mb-2">Receiver</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={driver.avatar} alt={driver.name} />
              <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{driver.name}</p>
              <p className="text-xs text-muted-foreground">+1 800 456 2456</p>
            </div>
          </div>
          <Button variant="outline" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
