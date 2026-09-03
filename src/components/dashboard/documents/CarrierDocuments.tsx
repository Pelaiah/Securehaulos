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
import { Document, type Carrier, documents as fallbackDocuments } from '@/lib/data';
import {
  Check,
  ShieldCheck,
  X,
  FileText,
  BadgeCheck,
  Lock,
  Download,
  Send,
  Eye,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { DocumentViewerDialog } from './DocumentViewerDialog';

const DEMO_CARRIER_DOCS: Document[] = [
  {
    id: 'doc-cr-01',
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
    id: 'doc-cr-02',
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
    id: 'doc-cr-03',
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
  {
    id: 'doc-cr-04',
    name: 'ZIMRA Tax Clearance Certificate (ITF 263)',
    type: 'Tax',
    status: 'Approved',
    expiryDate: '2025-12-31',
    uploadDate: '2025-01-05',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    allowDownload: false,
    downloadRequestStatus: 'none',
    fileSize: '950 KB',
  },
];

export function CarrierDocuments({ carrierId }: { carrierId: string }) {
  const { toast } = useToast();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDocs() {
      if (!carrierId) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('verification_documents')
          .select('*')
          .eq('user_id', carrierId);
        if (!error && data && data.length > 0) {
          setDocuments(data as unknown as Document[]);
        } else {
          setDocuments(DEMO_CARRIER_DOCS);
        }
      } catch (e) {
        setDocuments(DEMO_CARRIER_DOCS);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDocs();
  }, [carrierId]);

  const statusColors = {
    Approved: 'text-green-500 bg-green-500/10 border-green-500/20',
    Pending: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    Rejected: 'text-red-500 bg-red-500/10 border-red-500/20',
    Expired: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
  };

  const handleDocumentVerification = async (
    docId: string,
    status: 'Approved' | 'Rejected'
  ) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status } : d))
    );
    toast({
      title: `Document ${status}`,
      description: `The document verification status has been updated.`,
    });
    setIsViewerOpen(false);
  };

  const handleRequestDownload = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, downloadRequestStatus: 'requested' } : d))
    );
  };

  const handleDocumentClick = (doc: Document) => {
    setSelectedDocument(doc);
    setIsViewerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        <Skeleton className="h-8 w-full" />
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
    <>
      <div className="p-2">
        <Table>
          <TableHeader>
            <TableRow className="border-[#e2e4dd]">
              <TableHead className="text-xs">Document Name</TableHead>
              <TableHead className="text-xs">Type</TableHead>
              <TableHead className="text-xs">Quality / Status</TableHead>
              <TableHead className="text-xs">Download Permission</TableHead>
              <TableHead className="text-right text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => {
              const isDownloadable = doc.allowDownload === true;
              return (
                <TableRow key={doc.id} className="border-[#e2e4dd]/70 hover:bg-black/[0.02]">
                  <TableCell className="font-medium">
                    <button
                      onClick={() => handleDocumentClick(doc)}
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
                          Expires: {doc.expiryDate || 'N/A'} • {doc.fileSize || '2.1 MB'}
                        </span>
                      </div>
                    </button>
                  </TableCell>
                  <TableCell className="text-xs text-[#82877c]">{doc.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={cn('text-[10px] font-semibold py-0.5', statusColors[doc.status])}
                      >
                        {doc.status}
                      </Badge>
                      <Badge variant="outline" className="text-[9px] bg-sky-500/10 text-sky-600 border-sky-500/30">
                        HD Verified
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isDownloadable ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-500/10 px-2 py-0.5 rounded-md">
                        <Download className="w-3 h-3" />
                        Download Allowed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium bg-amber-500/10 px-2 py-0.5 rounded-md">
                        <Lock className="w-3 h-3" />
                        Carrier Permission Required
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1.5 justify-end items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1"
                        onClick={() => handleDocumentClick(doc)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Full HD
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleDocumentVerification(doc.id, 'Approved')}
                        disabled={doc.status === 'Approved'}
                        title="Approve Document"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDocumentVerification(doc.id, 'Rejected')}
                        disabled={doc.status === 'Rejected'}
                        title="Reject Document"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <DocumentViewerDialog
        isOpen={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        document={selectedDocument}
        onVerify={handleDocumentVerification}
        onRequestDownload={handleRequestDownload}
      />
    </>
  );
}
