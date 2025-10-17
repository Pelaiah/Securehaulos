import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Load } from '@/lib/data';
import { ArrowRight, MapPin, Truck, Crown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function LoadCard({ load }: { load: Load }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-lg mb-1">{load.cargo}</CardTitle>
            <CardDescription>Shipped by {load.shipper}</CardDescription>
          </div>
          {load.isPremium && (
            <Badge variant="outline" className="border-accent text-accent">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{load.origin}</span>
          <ArrowRight className="w-4 h-4 mx-2" />
          <span>{load.destination}</span>
        </div>
        <Separator />
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm">
            <Truck className="w-4 h-4 text-muted-foreground" />
            <span>{load.equipment}</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Payout</p>
            <p className="font-bold text-lg text-green-500">
              ${load.payout.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Bid Now</Button>
      </CardFooter>
    </Card>
  );
}
