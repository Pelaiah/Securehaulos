
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
import { MoreHorizontal, PlusCircle, UserPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const drivers = [
  {
    id: 'DRV-001',
    name: 'Alex Williams',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    phone: '+1 (555) 123-4567',
    truck: 'TR-002',
    status: 'On-time',
  },
  {
    id: 'DRV-002',
    name: 'Monika Brown',
    avatar: 'https://i.pravatar.cc/150?u=monika',
    phone: '+1 (555) 987-6543',
    truck: 'TR-004',
    status: 'Delayed',
  },
  {
    id: 'DRV-003',
    name: 'Harry Johnson',
    avatar: 'https://i.pravatar.cc/150?u=harry',
    phone: '+1 (555) 345-6789',
    truck: 'TR-001',
    status: 'Alert',
  },
    {
    id: 'DRV-004',
    name: 'Anna Miller',
    avatar: 'https://i.pravatar.cc/150?u=anna',
    phone: '+1 (555) 234-5678',
    truck: 'N/A',
    status: 'Idle',
  },
];


export default function MyDriversPage() {
  const statusColors = {
    'On-time': 'text-green-400 bg-green-500/10',
    Delayed: 'text-yellow-400 bg-yellow-500/10',
    Alert: 'text-red-400 bg-red-500/10',
    Idle: 'text-gray-400 bg-gray-500/10',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">My Drivers</CardTitle>
          <CardDescription>Manage your team of drivers.</CardDescription>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Driver
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Assigned Truck</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell className="font-medium flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={driver.avatar} alt={driver.name} />
                    <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {driver.name}
                </TableCell>
                <TableCell>{driver.phone}</TableCell>
                <TableCell>{driver.truck}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn('border-0', statusColors[driver.status as keyof typeof statusColors])}
                  >
                    {driver.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      <DropdownMenuItem>Assign Truck</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Remove Driver
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
