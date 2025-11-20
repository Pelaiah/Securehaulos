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
import { cn } from '@/lib/utils';
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
import { DocumentViewerDialog } from './DocumentViewerDialog';

export function CarrierDocuments({ carrierId }: { carrierId: string }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isViewerOpen, setIsViewerOpen] = useState(false);

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
      setIsViewerOpen(false); // Close viewer on action
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

  const handleDocumentClick = (doc: Document) => {
    setSelectedDocument(doc);
    setIsViewerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full mt-2" />
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
    <>
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
              <TableCell className="font-medium">
                <button
                  onClick={() => handleDocumentClick(doc)}
                  className="flex items-center gap-2 hover:underline"
                >
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span>{doc.name}</span>
                </button>
              </TableCell>
              <TableCell>{doc.expiryDate || 'N/A'}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn('border-0', statusColors[doc.status])}
                >
                  {doc.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      handleDocumentVerification(doc.id, 'Approved')
                    }
                    disabled={doc.status === 'Approved'}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      handleDocumentVerification(doc.id, 'Rejected')
                    }
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
      <DocumentViewerDialog
        isOpen={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        document={selectedDocument}
        onVerify={handleDocumentVerification}
      />
    </>
  );
}
