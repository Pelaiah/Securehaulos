
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
import { useMemo } from 'react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function DocumentsPage() {
   const { user } = useUser();
  const firestore = useFirestore();

  const documentsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'verification_documents');
  }, [firestore, user]);

  const { data: documents, isLoading } = useCollection<Document>(documentsCollectionRef);

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
     <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-headline">Company Documents</h2>
          <p className="text-muted-foreground">Manage and organize your company's verification documents.</p>
        </div>
        <Button>
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
                                    <DropdownMenuItem>View</DropdownMenuItem>
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
  );
}
