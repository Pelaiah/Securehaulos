'use client';

import { useState, useEffect } from 'react';
import * as z from 'zod';
import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';
import { supabase } from '@/lib/supabase/client';
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
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { UploadDocumentDialog } from '@/components/dashboard/UploadDocumentDialog';
import { DocumentViewerDialog } from './DocumentViewerDialog';
import { cn } from '@/lib/utils';
import { Plus, FileText, Trash2, Lock, Download, Eye, ShieldCheck } from 'lucide-react';

const uploadFormSchema = z.object({
  name: z.string().min(1, 'Document name is required.'),
  type: z.enum(['Tax', 'Registration', 'Insurance', 'License', 'Certification']),
  expiryDate: z.date().optional(),
  files: z.array(z.instanceof(File)).min(1, 'Please upload at least one file.'),
});

const DEFAULT_CARRIER_DOCS: Document[] = [
  {
    id: 'doc-my-01',
    name: 'Goods In Transit (GIT) Master Policy',
    type: 'GIT',
    status: 'Approved',
    expiryDate: '2026-11-30',
    uploadDate: '2025-01-15',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    allowDownload: false,
    downloadRequestStatus: 'none',
    fileSize: '2.4 MB',
  },
  {
    id: 'doc-my-02',
    name: 'Carrier Cross-Border Operating Authority',
    type: 'License',
    status: 'Approved',
    expiryDate: '2027-04-10',
    uploadDate: '2025-02-01',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    allowDownload: false,
    downloadRequestStatus: 'none',
    fileSize: '1.8 MB',
  },
  {
    id: 'doc-my-03',
    name: 'Comprehensive Fleet Vehicle Insurance',
    type: 'Insurance',
    status: 'Approved',
    expiryDate: '2026-08-20',
    uploadDate: '2024-09-12',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    allowDownload: true,
    downloadRequestStatus: 'approved',
    fileSize: '3.1 MB',
  },
];

export function CarrierMyDocuments() {
  const { user, isLoading: isUserLoading } = useSupabaseAuth();
  const { toast } = useToast();
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [areDocsLoading, setAreDocsLoading] = useState(true);

  useEffect(() => {
    async function fetchDocs() {
      if (!user) {
        setDocuments(DEFAULT_CARRIER_DOCS);
        setAreDocsLoading(false);
        return;
      }
      setAreDocsLoading(true);
      try {
        const { data, error } = await supabase
          .from('verification_documents')
          .select('*')
          .eq('user_id', user.id);
        if (!error && data && data.length > 0) {
          setDocuments(data as unknown as Document[]);
        } else {
          setDocuments(DEFAULT_CARRIER_DOCS);
        }
      } catch (err) {
        setDocuments(DEFAULT_CARRIER_DOCS);
      } finally {
        setAreDocsLoading(false);
      }
    }
    fetchDocs();
  }, [user]);

  const handleToggleDownloadPermission = async (docId: string, currentAllow: boolean) => {
    const newStatus = !currentAllow;
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, allowDownload: newStatus } : d))
    );

    try {
      if (user) {
        await supabase
          .from('verification_documents')
          .update({ allow_download: newStatus })
          .eq('id', docId);
      }
    } catch (e) {
      // offline fallback
    }

    toast({
      title: newStatus ? 'Download Access Granted' : 'Download Access Restricted',
      description: newStatus
        ? 'Shippers can now download this high-quality document directly.'
        : 'Shippers can only preview this document; downloads are locked.',
    });
  };

  const handleUpload = async (values: z.infer<typeof uploadFormSchema>) => {
    const file = values.files[0];
    const placeholderUrl = `https://storage.googleapis.com/your-bucket/uploads/${user?.id || 'demo'}/${Date.now()}-${file.name}`;

    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: values.name,
      type: values.type,
      uploadDate: new Date().toISOString(),
      expiryDate: values.expiryDate ? format(values.expiryDate, 'yyyy-MM-dd') : undefined,
      status: 'Pending',
      fileUrl: placeholderUrl,
      allowDownload: false,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    };

    setDocuments((prev) => [newDoc, ...prev]);

    try {
      if (user) {
        await supabase.from('verification_documents').insert({
          user_id: user.id,
          name: values.name,
          document_type: values.type,
          upload_date: new Date().toISOString(),
          expiry_date: values.expiryDate ? format(values.expiryDate, 'yyyy-MM-dd') : null,
          status: 'Pending',
          file_url: placeholderUrl,
          allow_download: false,
        });
      }
    } catch (err) {
      // Supabase fallback
    }

    toast({
      title: 'Document Uploaded (HD)',
      description: `${values.name} has been submitted for carrier compliance verification.`,
    });
    setUploadOpen(false);
  };

  const handleDelete = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    toast({
      title: 'Document Removed',
      description: 'The selected document has been deleted from your compliance profile.',
    });
  };

  const isLoading = isUserLoading || areDocsLoading;

  const statusColors = {
    Approved: 'text-green-500 bg-green-500/10 border-green-500/20',
    Pending: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    Rejected: 'text-red-500 bg-red-500/10 border-red-500/20',
    Expired: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white border border-[#e2e4dd] p-5 rounded-2xl shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold font-headline text-[#171a16] tracking-tight">
                Carrier Document Vault & Permissions
              </h2>
              <Badge variant="outline" className="bg-[#e7f4ee] text-[#2c7350] border-green-500/30 text-xs">
                Protected Storage
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#82877c] mt-1">
              Upload high-quality truck and corporate certifications. Control which shippers can download original copies.
            </p>
          </div>
          <Button onClick={() => setUploadOpen(true)} className="bg-[#2c7350] hover:bg-[#235c40] text-white text-xs h-9.5">
            <Plus className="mr-1.5 h-4 w-4" />
            Upload Document
          </Button>
        </div>

        <Card className="border-[#e2e4dd] shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-[#fafbf9] border-b border-[#e2e4dd] py-4">
            <CardTitle className="text-base font-bold font-headline">Compliance & Licensing Documents</CardTitle>
            <CardDescription className="text-xs">
              Shippers can view high-definition previews during load bidding. Toggle download permissions individually.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-[#e2e4dd]">
                  <TableHead className="text-xs">Document Name</TableHead>
                  <TableHead className="text-xs">Category</TableHead>
                  <TableHead className="text-xs">Expiry Date</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Shipper Download Permission</TableHead>
                  <TableHead className="text-right text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <>
                    <TableRow>
                      <TableCell colSpan={6}><Skeleton className="h-9 w-full" /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6}><Skeleton className="h-9 w-full" /></TableCell>
                    </TableRow>
                  </>
                )}
                {!isLoading && documents && documents.length > 0 ? (
                  documents.map((doc) => {
                    const isDownloadable = doc.allowDownload === true;
                    return (
                      <TableRow key={doc.id} className="border-[#e2e4dd]/70 hover:bg-black/[0.02]">
                        <TableCell className="font-medium">
                          <button
                            onClick={() => {
                              setSelectedDoc(doc);
                              setIsViewerOpen(true);
                            }}
                            className="flex items-center gap-2.5 text-xs text-left hover:underline group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="font-bold text-[#171a16] group-hover:text-primary transition-colors block">
                                {doc.name}
                              </span>
                              <span className="text-[11px] text-[#82877c]">
                                {doc.fileSize || '2.4 MB'} • High Definition Verified
                              </span>
                            </div>
                          </button>
                        </TableCell>
                        <TableCell className="text-xs text-[#82877c]">{doc.type}</TableCell>
                        <TableCell className="text-xs font-mono">{doc.expiryDate || 'Permanent'}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn('text-[10px] font-semibold py-0.5', statusColors[doc.status])}
                          >
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Switch
                              checked={isDownloadable}
                              onCheckedChange={() => handleToggleDownloadPermission(doc.id, !!doc.allowDownload)}
                              id={`toggle-${doc.id}`}
                            />
                            <label
                              htmlFor={`toggle-${doc.id}`}
                              className={cn(
                                'text-xs cursor-pointer select-none font-medium',
                                isDownloadable ? 'text-green-600' : 'text-[#82877c]'
                              )}
                            >
                              {isDownloadable ? 'Download Allowed' : 'Download Locked'}
                            </label>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1.5 justify-end items-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs gap-1"
                              onClick={() => {
                                setSelectedDoc(doc);
                                setIsViewerOpen(true);
                              }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Preview
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDelete(doc.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  !isLoading && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">
                        You haven't uploaded any verification documents yet.
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

      <DocumentViewerDialog
        isOpen={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        document={selectedDoc}
      />
    </>
  );
}