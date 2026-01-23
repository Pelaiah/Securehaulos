'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  useUser,
} from '@/firebase';
import { type Carrier } from '@/lib/data';
import { collection } from 'firebase/firestore';
import { BadgeCheck, Folder, Loader2 } from 'lucide-react';
import { CarrierDocuments } from '@/components/dashboard/documents/CarrierDocuments';

export function ShipperDocumentsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const carriersCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'carriers');
  }, [firestore]);

  const { data: carriers, isLoading } =
    useCollection<Carrier>(carriersCollectionRef);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-headline">
            Carrier Documents
          </h2>
          <p className="text-muted-foreground">
            Review and verify documents from carriers in your network.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading && (
            <div className="p-6 text-center text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin inline-block" />
              <p>Loading carriers...</p>
            </div>
          )}
          {!isLoading && carriers && carriers.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {carriers.map((carrier) => (
                <AccordionItem value={carrier.id} key={carrier.id}>
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50 text-base">
                    <div className="flex items-center gap-3">
                      <Folder className="w-5 h-5 text-primary" />
                      <span className="font-semibold">
                        {carrier.companyName}
                      </span>
                      {carrier.verified && (
                        <Badge
                          variant="outline"
                          className="text-green-500 border-green-500/50 bg-green-500/10"
                        >
                          <BadgeCheck className="w-4 h-4 mr-1.5" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-background">
                    <CarrierDocuments carrierId={carrier.id} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            !isLoading && (
              <div className="p-6 text-center text-muted-foreground">
                No carriers found.
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    