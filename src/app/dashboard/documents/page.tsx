
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
import { Document } from '@/lib/data';
import { MoreHorizontal, Upload, FileText, Folder, Building, FileBadge, ShieldCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo, useState } from 'react';
import { useCollection, useFirestore, useUser, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { UploadDocumentDialog } from '@/components/dashboard/UploadDocumentDialog';
import { useToast } from '@/hooks/use-toast';

export default function DocumentsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const documentsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'verification_documents');
  }, [firestore, user]);

  const { data: documents, isLoading } = useCollection<Document>(documentsCollectionRef);
  
  const handleUploadDocument = async (values: { name: string, type: Document['type'], expiryDate?: Date, files: File[] }) => {
    if (!documentsCollectionRef) return;
    
    const file = values.files[0];
    // In a real app, you'd upload the file to Firebase Storage here and get a URL.
    // For now, we'll use a placeholder URL and focus on the Firestore write.
    const fileUrl = `uploads/${user?.uid}/${file.name}`;
    
    const newDocumentData = {
      name: values.name,
      type: values.type,
      status: 'Pending' as const,
      expiryDate: values.expiryDate ? values.expiryDate.toISOString().split('T')[0] : null,
      uploadDate: new Date().toISOString().split('T')[0],
      fileUrl: fileUrl,
    };

    try {
      await addDoc(documentsCollectionRef, newDocumentData);
      toast({
        title: "Document Uploaded",
        description: `${values.name} is now pending approval.`
      });
      setIsUploadModalOpen(false);
    } catch (error) {
        const permissionError = new FirestorePermissionError({
          path: documentsCollectionRef.path,
          operation: 'create',
          requestResourceData: newDocumentData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
            variant: 'destructive',
            title: 'Upload Failed',
            description: 'Could not save the document. Please check permissions.'
        });
    }
  };


  const statusColors = {
    Approved: 'text-green-400 bg-green-500/10',
    Pending: 'text-yellow-400 bg-yellow-500/10',
    Rejected: 'text-red-400 bg-red-500/10',
    Expired: 'text-gray-400 bg-gray-500/10',
  };

  const groupedDocuments = useMemo(() => {
    if (!documents) return {};
    return documents.reduce((acc, doc) => {
      if (!acc[doc.type]) {
        acc[doc.type] = [];
      }
      acc[doc.type].push(doc);
      return acc;
    }, {} as Record<Document['type'], Document[]>);
  }, [documents]);
  
  const categoryIcons = {
      'Registration': <Folder className="w-5 h-5" />,
      'Tax': <FileBadge className="w-5 h-5" />,
      'Insurance': <ShieldCheck className="w-5 h-5" />,
      'License': <Building className="w-5 h-5" />,
      'Certification': <FileText className="w-5 h-5" />,
  }

  return (
    <>
     <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-headline">Company Documents</h2>
          <p className="text-muted-foreground">Manage and organize your company's verification documents.</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload New Document
        </Button>
      </div>
    
      <div className="grid grid-cols-1 gap-6">
        {isLoading && (
            <Card>
                <CardHeader>
                    <CardTitle>Loading documents...</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Please wait while we fetch your documents.</p>
                </CardContent>
            </Card>
        )}
        {!isLoading && Object.keys(groupedDocuments).length === 0 && (
             <Card>
                <CardHeader>
                    <CardTitle>No Documents Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Get started by uploading your first company document.</p>
                </CardContent>
            </Card>
        )}
        {Object.entries(groupedDocuments).map(([category, docs]) => (
            <Card key={category}>
                <CardHeader>
                    <CardTitle className='font-headline flex items-center gap-2'>
                        {categoryIcons[category as keyof typeof categoryIcons]}
                        {category} Documents
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Document Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Expires</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {docs.map((doc) => (
                            <TableRow key={doc.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                {doc.name}
                                </TableCell>
                                <TableCell>
                                <Badge
                                    variant="outline"
                                    className={cn('border-0', statusColors[doc.status])}
                                >
                                    {doc.status}
                                </Badge>
                                </TableCell>
                                <TableCell>{doc.expiryDate || 'N/A'}</TableCell>
                                <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => window.open(doc.fileUrl, '_blank')}>View</DropdownMenuItem>
                                    <DropdownMenuItem>Replace</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                        Delete
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
    <UploadDocumentDialog
        isOpen={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUpload={handleUploadDocument}
      />
    </>
  );
}
