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
import { documents } from '@/lib/data';
import { MoreHorizontal, Upload, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DocumentsPage() {
  const statusColors = {
    Approved: 'text-green-400 bg-green-500/10',
    Pending: 'text-yellow-400 bg-yellow-500/10',
    Rejected: 'text-red-400 bg-red-500/10',
    Expired: 'text-gray-400 bg-gray-500/10',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Company Documents</CardTitle>
          <CardDescription>Manage your company's verification documents.</CardDescription>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  {doc.name}
                </TableCell>
                <TableCell>{doc.type}</TableCell>
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
  );
}
