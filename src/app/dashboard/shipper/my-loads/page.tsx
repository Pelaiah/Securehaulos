'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Load } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Check,
  MoreHorizontal,
  FileDown,
  Plus,
  Pencil,
  X,
  Truck,
  ArrowRight,
  Package,
} from 'lucide-react';
import { useState } from 'react';
import { PostLoadModal } from '@/components/dashboard/shipper/PostLoadModal';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError, useUser } from '@/firebase';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { PendingLoadDetailsDialog } from '@/components/dashboard/shipper/PendingLoadDetailsDialog';
import { trucks } from '@/lib/data';

interface MyLoadsPageProps {
  companyName?: string;
}

export default function MyLoadsPage({ companyName = "Your Company" }: MyLoadsPageProps) {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);

  const firestore = useFirestore();
  const { user } = useUser();

  const loadsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'loads');
  }, [firestore]);

  const { data: loads } = useCollection<Load>(loadsCollectionRef);

  const handlePostLoad = (newLoadData: Omit<Load, 'id'>) => {
    if (!loadsCollectionRef || !user) return;
    
    const loadWithShipperId = {
      ...newLoadData,
      shipperId: user.uid,
    };

    addDoc(loadsCollectionRef, loadWithShipperId)
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: loadsCollectionRef.path,
          operation: 'create',
          requestResourceData: loadWithShipperId,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw error;
      });
  };

  const handleLoadClick = (load: Load) => {
    if (load.status === 'Pending') {
      setSelectedLoad(load);
      setIsReviewModalOpen(true);
    }
    // You can add else logic for other statuses if needed
  };

  const activeLoads = loads?.filter(load => ['Posted', 'In Transit', 'Pending'].includes(load.status)) || [];
  const pastLoads = loads?.filter(load => load.status === 'Completed') || [];

  const statusColors: { [key in Load['status']]: string } = {
    'Posted': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    'In Transit': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'Completed': 'text-green-400 bg-green-500/10 border-green-500/20',
    'Pending': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  }

  return (
    <>
    <div className="p-6 space-y-8 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline">My Posted Loads</h1>
          <p className="text-muted-foreground">Manage all your active and past shipments.</p>
        </div>
        <Button onClick={() => setIsPostModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Post New Load
        </Button>
      </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 font-headline">
            Active Loads
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
              {activeLoads.map((load) => (
                <Card 
                  key={load.id}
                  onClick={() => handleLoadClick(load)}
                  className={cn(load.status === 'Pending' && 'cursor-pointer hover:border-primary')}
                >
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="font-headline text-lg mb-1 flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    {load.cargo}
                                </CardTitle>
                                <CardDescription>ID: {load.id}</CardDescription>
                            </div>
                             <Badge variant="outline" className={cn(statusColors[load.status])}>{load.status}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <div className="flex items-center text-sm text-muted-foreground mb-4">
                            <span>{load.origin}</span>
                            <ArrowRight className="w-4 h-4 mx-2" />
                            <span>{load.destination}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-muted-foreground">Equipment</p>
                                <p className="font-semibold flex items-center gap-2"><Truck className="w-4 h-4" />{load.equipment}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Payout</p>
                                <p className="font-bold text-lg text-green-500">${load.payout.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 font-headline">
            Past Loads
          </h2>
          <Card>
            <CardContent className="p-0">
                <div className="divide-y divide-border">
                {pastLoads.map((load) => (
                    <div
                    key={load.id}
                    className="flex items-center p-3 rounded-lg hover:bg-muted/50"
                    >
                    <div className="flex-1 grid grid-cols-5 items-center gap-4">
                        <div>
                        <p className="font-semibold">{load.cargo}</p>
                        <p className="text-xs text-muted-foreground">
                            {load.id}
                        </p>
                        </div>
                        <p className="text-sm text-muted-foreground">{load.origin}</p>
                        <p className="text-sm text-muted-foreground">{load.destination}</p>
                        <div>
                        <p className="font-semibold">
                            ${load.payout.toLocaleString()}
                        </p>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Badge variant="outline" className={cn(statusColors[load.status])}>Completed</Badge>
                          <Button variant="ghost" size="icon" className='text-muted-foreground'>
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </CardContent>
          </Card>
        </div>
    </div>
    <PostLoadModal 
        isOpen={isPostModalOpen} 
        onOpenChange={setIsPostModalOpen}
        onPostLoad={handlePostLoad}
        companyName={companyName}
     />
     <PendingLoadDetailsDialog
        isOpen={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        load={selectedLoad}
     />
    </>
  );
}
