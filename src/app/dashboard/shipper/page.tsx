'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, Truck, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ShipperDashboardPageProps {
    isLoading: boolean;
}

const stats = [
    { title: 'Active Loads', value: '12', icon: Package, color: 'text-blue-500' },
    { title: 'Total Spent', value: '$42,500', icon: DollarSign, color: 'text-green-500' },
    { title: 'On-Time Delivery', value: '98.2%', icon: CheckCircle, color: 'text-yellow-500' },
    { title: 'Carriers Used', value: '8', icon: Truck, color: 'text-purple-500' },
];

export default function ShipperDashboardPage({ isLoading }: ShipperDashboardPageProps) {
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-6 w-6" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-32" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                 <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-headline">Shipper Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Recent activity will be displayed here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
