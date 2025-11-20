'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Document, type Carrier } from '@/lib/data';
import {
  Check,
  Folder,
  ShieldCheck,
  X,
  FileText,
  BadgeCheck,
  Loader2,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import {
  useCollection,
  useFirestore,
  useUser,
  useMemoFirebase,
  errorEmitter,
  FirestorePermissionError,
} from '@/firebase';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

function CarrierDocuments({ carrierId }: { carrierId: string }) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const documentsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !carrierId) return null;
    return collection(firestore, 'users', carrierId, 'verification_documents');
  }, [firestore, carrierId]);

  const { data: documents, isLoading } =
    useCollection<Document>(documentsCollectionRef);

  const statusColors = {
    Approved: 'text-green-400 bg-green-500/10',
    Pending: 'text-yellow-400 bg-yellow-500/10',
    Rejected: 'text-red-400 bg-red-500/10',
    Expired: 'text-gray-400 bg-gray-500/10',
  };

  const handleDocumentVerification = async (
    docId: string,
    status: 'Approved' | 'Rejected'
  ) => {
    if (!carrierId || !firestore) return;

    try {
      const docRef = doc(
        firestore,
        'users',
        carrierId,
        'verification_documents',
        docId
      );
      await updateDoc(docRef, { status: status });

      toast({
        title: `Document ${status}`,
        description: `The document has been marked as ${status.toLowerCase()}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description:
          'Could not update the document status. Please check permissions.',
        variant: 'destructive',
      });
      const permissionError = new FirestorePermissionError({
        path: `users/${carrierId}/verification_documents/${docId}`,
        operation: 'update',
        requestResourceData: { status },
      });
      errorEmitter.emit('permission-error', permissionError);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        This carrier has not uploaded any documents yet.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell className="font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {doc.name}
              </a>
            </TableCell>
            <TableCell>{doc.expiryDate || 'N/A'}</TableCell>
            <TableCell>
              <Badge variant="outline" className={cn('border-0', statusColors[doc.status])}>
                {doc.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDocumentVerification(doc.id, 'Approved')}
                  disabled={doc.status === 'Approved'}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDocumentVerification(doc.id, 'Rejected')}
                  disabled={doc.status === 'Rejected'}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function DocumentsPage() {
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
