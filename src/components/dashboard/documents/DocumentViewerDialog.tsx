'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Document } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Check, Download, Lock, ShieldAlert, Sparkles, X, FileText, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type DocumentViewerDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onVerify?: (docId: string, status: 'Approved' | 'Rejected') => void;
  onRequestDownload?: (docId: string) => void;
};

export function DocumentViewerDialog({
  isOpen,
  onOpenChange,
  document,
  onVerify,
  onRequestDownload,
}: DocumentViewerDialogProps) {
  const { toast } = useToast();
  const [requested, setRequested] = useState(false);

  if (!document) return null;

  const statusColors = {
    Approved: 'text-green-500 bg-green-500/10 border-green-500/20',
    Pending: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    Rejected: 'text-red-500 bg-red-500/10 border-red-500/20',
    Expired: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
  };

  const isDownloadPermitted = document.allowDownload === true;
  const isRequestPending = requested || document.downloadRequestStatus === 'requested';

  const handleRequestAccess = () => {
    setRequested(true);
    onRequestDownload?.(document.id);
    toast({
      title: 'Download Request Submitted',
      description: `Access request sent to the carrier for document: "${document.name}". You will be notified once approved.`,
    });
  };

  const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
    document.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  )}`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-6">
        <DialogHeader className="pb-3 border-b border-[#e2e4dd]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="font-headline text-xl text-[#171a16] flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>{document.name}</span>
              </DialogTitle>
              <DialogDescription asChild>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span>Type: <strong className="text-foreground">{document.type}</strong></span>
                  <span>•</span>
                  <span>Expires: {document.expiryDate || 'N/A'}</span>
                  <span>•</span>
                  <span>Security: <strong className="text-foreground">HD Certified Original</strong></span>
                </div>
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn('text-xs font-semibold px-2.5 py-0.5', statusColors[document.status])}>
                {document.status}
              </Badge>
              {isDownloadPermitted ? (
                <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30">
                  Downloads Unlocked
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/30 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Carrier Protected
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* ── HIGH QUALITY DOCUMENT PREVIEW CANVAS ── */}
        <div className="flex-grow my-3 border border-[#e2e4dd] rounded-xl overflow-hidden relative bg-[#f8f9fa] flex flex-col justify-center items-center">
          <iframe
            src={viewerUrl}
            className="w-full h-full"
            title={document.name}
            frameBorder="0"
          />

          {/* High-res security watermark overlay */}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm border border-[#e2e4dd] px-3 py-1 rounded-md text-[11px] text-[#82877c] pointer-events-none flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#2c7350]" />
            <span>SecureHaul High-Res Verified Document</span>
          </div>
        </div>

        {/* ── SECURITY NOTICE BANNER IF DOWNLOAD RESTRICTED ── */}
        {!isDownloadPermitted && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Controlled Access:</strong> You can view this high-quality document in full. Export and download permissions require approval from the carrier.
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRequestAccess}
              disabled={isRequestPending}
              className="bg-white border-amber-300 text-amber-800 hover:bg-amber-100 text-xs h-7 shrink-0"
            >
              <Send className="w-3 h-3 mr-1" />
              {isRequestPending ? 'Request Pending' : 'Request Download'}
            </Button>
          </div>
        )}

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-3 border-t border-[#e2e4dd]">
          {onVerify && (
            <div className="flex-1 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onVerify(document.id, 'Rejected')}
                disabled={document.status === 'Rejected'}
                className="w-full sm:w-auto text-xs"
              >
                <X className="w-3.5 h-3.5 mr-1 text-destructive" />
                Reject
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => onVerify(document.id, 'Approved')}
                disabled={document.status === 'Approved'}
                className="w-full sm:w-auto text-xs bg-[#2c7350] hover:bg-[#235c40]"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Approve
              </Button>
            </div>
          )}

          {isDownloadPermitted ? (
            <a href={document.fileUrl} download target="_blank" rel="noreferrer">
              <Button variant="secondary" size="sm" className="w-full sm:w-auto text-xs">
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download Document
              </Button>
            </a>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              disabled
              className="w-full sm:w-auto text-xs opacity-60 cursor-not-allowed"
              title="Download locked by carrier"
            >
              <Lock className="w-3.5 h-3.5 mr-1.5" />
              Download Locked
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto text-xs"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
