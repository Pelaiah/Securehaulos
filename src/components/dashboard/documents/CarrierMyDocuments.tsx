'use client';
import { useState } from 'react';
import * as z from 'zod';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  useUser,
  errorEmitter,
  FirestorePermissionError,
} from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { type Document } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
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
import { Skeleton } from '@/components/ui/skeleton';
import { UploadDocumentDialog } from '@/components/dashboard/UploadDocumentDialog';
import { cn } from '@/lib/utils';
import { Plus, FileText, Trash2 } from 'lucide-react';

const uploadFormSchema = z.object({
  name: z.string().min(1, 'Document name is required.'),
  type: z.enum(['Tax', 'Registration', 'Insurance', 'License', 'Certification']),
  expiryDate: z.date().optional(),
  files: z.array(z.instanceof(File)).min(1, 'Please upload at least one file.'),
});

export function CarrierMyDocuments() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isUploadOpen, setUploadOpen] = useState(false);

  const myDocsCollectionRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'verification_documents');
  }, [user, firestore]);

  const { data: documents, isLoading: areDocsLoading } =
    useCollection<Document>(myDocsCollectionRef);

  const handleUpload = async (values: z.infer<typeof uploadFormSchema>) => {
    if (!user || !firestore || !myDocsCollectionRef) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'User not authenticated. Please log in again.',
      });
      return;
    }

    // In a real app, you would upload the file to Firebase Storage here
    // and get the download URL. For this demo, we'll use a placeholder.
    const file = values.files[0];
    const placeholderUrl = `https://storage.googleapis.com/your-bucket/uploads/${
      user.uid
    }/${Date.now()}-${file.name}`;

    try {
      const docData = {
        userId: user.uid,
        name: values.name,
        documentType: values.type,
        uploadDate: new Date().toISOString(),
        expiryDate: values.expiryDate
          ? format(values.expiryDate, 'yyyy-MM-dd')
          : null,
        status: 'Pending',
        fileUrl: placeholderUrl,
      };
      
      await addDoc(myDocsCollectionRef, docData);

      toast({
        title: 'Document Uploaded',
        description: `${values.name} has been submitted for verification.`,
      });
      setUploadOpen(false);
    } catch (error) {
      const fError = new FirestorePermissionError({
          path: myDocsCollectionRef.path,
          operation: 'create',
      });
      errorEmitter.emit('permission-error', fError);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description:
          'Could not submit your document. Please check your permissions and try again.',
      });
    }
  };
  
  const isLoading = isUserLoading || areDocsLoading;

  const statusColors = {
    Approved: 'text-green-400 bg-green-500/10',
    Pending: 'text-yellow-400 bg-yellow-500/10',
    Rejected: 'text-red-400 bg-red-500/10',
    Expired: 'text-gray-400 bg-gray-500/10',
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold font-headline">
              My Verification Documents
            </h2>
            <p className="text-muted-foreground">
              Manage the documents required for your carrier profile.
            </p>
          </div>
          <Button onClick={() => setUploadOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              These documents are used by shippers to verify your company.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <>
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Skeleton className="h-8" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Skeleton className="h-8" />
                      </TableCell>
                    </TableRow>
                  </>
                )}
                {!isLoading && documents && documents.length > 0 ? (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                         <FileText className="w-4 h-4 text-muted-foreground" />
                        {doc.name}
                      </TableCell>
                      <TableCell>{doc.type}</TableCell>
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
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  !isLoading && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        You haven't uploaded any documents yet.
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <UploadDocumentDialog
        isOpen={isUploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={handleUpload}
      />
    </>
  );
}

    