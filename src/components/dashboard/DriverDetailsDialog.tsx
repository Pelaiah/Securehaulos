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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FileUpload } from './FileUpload';
import { cn } from '@/lib/utils';
import type { Driver, Document } from '@/lib/data';
import { useState } from 'react';
import { Calendar as CalendarIcon, FileText, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

type DriverDetailsDialogProps = {
  driver: Driver | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DriverDetailsDialog({
  driver,
  isOpen,
  onOpenChange,
}: DriverDetailsDialogProps) {
  const [driverOnLeave, setDriverOnLeave] = useState(driver?.onLeave || false);
  const [leaveDateRange, setLeaveDateRange] = useState<DateRange | undefined>(
    {
      from: driver?.leaveStartDate ? new Date(driver.leaveStartDate) : undefined,
      to: driver?.leaveEndDate ? new Date(driver.leaveEndDate) : undefined,
    }
  );
  const [files, setFiles] = useState<File[]>([]);

  const statusColors: { [key: string]: string } = {
    Approved: 'text-green-400 bg-green-500/10',
    Pending: 'text-yellow-400 bg-yellow-500/10',
    Rejected: 'text-red-400 bg-red-500/10',
    Expired: 'text-gray-400 bg-gray-500/10',
  };

  if (!driver) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-row items-center gap-4 space-y-0">
          <Avatar className="h-16 w-16">
            <AvatarImage src={driver.avatar} alt={driver.name} />
            <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <DialogTitle className="font-headline text-2xl">
              {driver.name}
            </DialogTitle>
            <DialogDescription>{driver.phone}</DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto -mx-6 px-6">
          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="leave">Leave Management</TabsTrigger>
            </TabsList>
            <TabsContent value="documents" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Upload New Document</h4>
                  <FileUpload onFilesChange={setFiles} />
                  <Button className="mt-2" size="sm" disabled={files.length === 0}>
                    <Upload className="mr-2 h-4 w-4" /> Upload
                  </Button>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Uploaded Documents</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expires</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {driver.documents.map((doc: Document) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            {doc.name}
                          </TableCell>
                          <TableCell>{doc.type}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                'border-0',
                                statusColors[doc.status]
                              )}
                            >
                              {doc.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{doc.expiryDate || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="leave" className="mt-4 space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="on-leave"
                  checked={driverOnLeave}
                  onCheckedChange={setDriverOnLeave}
                />
                <Label htmlFor="on-leave" className="font-medium">
                  Mark driver as on leave
                </Label>
              </div>

              {driverOnLeave && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="leave-dates">Leave Dates</Label>
                     <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="leave-dates"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !leaveDateRange && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {leaveDateRange?.from ? (
                            leaveDateRange.to ? (
                              <>
                                {format(leaveDateRange.from, "LLL dd, y")} -{" "}
                                {format(leaveDateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(leaveDateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={leaveDateRange?.from}
                          selected={leaveDateRange}
                          onSelect={setLeaveDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
