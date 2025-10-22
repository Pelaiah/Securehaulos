'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, CheckCircle, DollarSign } from "lucide-react";

export default function ShipperDashboardPage() {
  const stats = [
    { title: "Active Loads", value: "12", icon: Package, color: "text-blue-500" },
    { title: "Total Spending", value: "$45,231", icon: DollarSign, color: "text-green-500" },
    { title: "On-Time Deliveries", value: "98.5%", icon: CheckCircle, color: "text-yellow-500" },
    { title: "Trucks in Transit", value: "8", icon: Truck, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Shipper Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Add more shipper-specific components here */}
    </div>
  );
}
