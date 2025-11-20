'use client';
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
import { Check, Download, X } from 'lucide-react';

type DocumentViewerDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onVerify: (docId: string, status: 'Approved' | 'Rejected') => void;
};

export function DocumentViewerDialog({
  isOpen,
  onOpenChange,
  document,
  onVerify,
}: DocumentViewerDialogProps) {
  if (!document) return null;

  const statusColors = {
    Approved: 'text-green-400 bg-green-500/10',
    Pending: 'text-yellow-400 bg-yellow-500/10',
    Rejected: 'text-red-400 bg-red-500/10',
    Expired: 'text-gray-400 bg-gray-500/10',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">
            {document.name}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Type: {document.type}</span>
                <span>|</span>
                <span>Expires: {document.expiryDate || 'N/A'}</span>
                <Badge
                    variant="outline"
                    className={cn('border-0 ml-auto', statusColors[document.status])}
                >
                    {document.status}
                </Badge>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow my-4 border rounded-md overflow-hidden">
          <iframe
            src={document.fileUrl}
            className="w-full h-full"
            title={document.name}
          />
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4 border-t">
          <div className="flex-1 flex gap-2">
            <Button
              variant="outline"
              onClick={() => onVerify(document.id, 'Rejected')}
              disabled={document.status === 'Rejected'}
              className="w-full sm:w-auto"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              variant="default"
              onClick={() => onVerify(document.id, 'Approved')}
              disabled={document.status === 'Approved'}
              className="w-full sm:w-auto"
            >
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </div>
          <a href={document.fileUrl} download target="_blank" rel="noreferrer">
            <Button variant="secondary" className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </a>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
