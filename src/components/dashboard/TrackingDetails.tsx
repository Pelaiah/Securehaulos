'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Map } from "@/components/dashboard/Map";
import { Phone, MessageSquare, Cog, PlusCircle, MapPin, ArrowRight } from "lucide-react";
import type { Truck } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';

interface TrackingDetailsProps {
    truck: Truck;
}

const statusColors = {
    'On-time': 'text-green-400 border-green-400/50 bg-green-500/10',
    'On Route': 'text-green-400 border-green-400/50 bg-green-500/10',
    Delayed: 'text-yellow-400 border-yellow-400/50 bg-yellow-500/10',
    Idle: 'text-gray-400 border-gray-400/50 bg-gray-500/10',
    Alert: 'text-red-400 border-red-400/50 bg-red-500/10',
};

const getStatusForDisplay = (truck: Truck) => {
    if (truck.status === 'On-time') return 'On Route';
    return truck.status;
}

const MAX_LOAD_WEIGHT = 22000; // Assume max weight in kg

export function TrackingDetails({ truck }: TrackingDetailsProps) {
    const [activeTab, setActiveTab] = useState("shipping-info");

    const capacityPercentage = (truck.loadWeight / MAX_LOAD_WEIGHT) * 100;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        {truck.id} 
                        <Badge variant="outline" className={cn(statusColors[truck.status === 'On-time' ? 'On Route' : truck.status])}>
                            {getStatusForDisplay(truck)}
                        </Badge>
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline"><Phone className="mr-2"/> Call Driver</Button>
                    <Button><MessageSquare className="mr-2"/> Chat with Driver</Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="shipping-info">Shipping Info</TabsTrigger>
                    <TabsTrigger value="vehicle-info">Vehicle Info</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="company">Company</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>
                <TabsContent value="shipping-info" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Truck Capacity</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="relative w-full h-24">
                                <Image src={truck.imageUrl} alt="Truck capacity illustration" fill style={{ objectFit: 'contain' }} data-ai-hint="truck illustration"/>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-[65%] h-[55%] ml-1.5 mt-1.5 rounded-sm overflow-hidden">
                                        <Progress value={capacityPercentage} className="h-full bg-primary/20" />
                                         <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-white text-2xl font-bold">{Math.round(capacityPercentage)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle>Route</CardTitle>
                            <div className="text-sm text-muted-foreground flex items-center gap-4">
                                <span>01:23:55</span>
                                <span>38 mi left</span>
                                <Button variant="ghost" size="sm"><Cog className="mr-2" /> Change Route</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 rounded-lg overflow-hidden">
                                <Map trucks={[truck]} selectedTruckId={truck.id} />
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle>Cargo Photo Reports</CardTitle>
                             <Button variant="outline" size="sm"><PlusCircle className="mr-2" /> Request Photo</Button>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="space-y-2">
                                     <Image src={`https://picsum.photos/seed/${truck.id}-cargo${i}/200/150`} alt={`Cargo photo ${i} for truck ${truck.id}`} width={200} height={150} className="rounded-lg object-cover w-full aspect-[4/3]" data-ai-hint="cargo container"/>
                                     <div className="text-xs">
                                         <p className="font-semibold">Point #{i} Cargo Photo</p>
                                         <p className="text-muted-foreground">08:23 AM, 06.27</p>
                                     </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Route Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Placeholder for route requests */}
                            <div className="text-center py-8 text-muted-foreground">
                                No active route requests.
                            </div>
                        </CardContent>
                    </Card>

                </TabsContent>
                 <TabsContent value="vehicle-info">
                    {/* Content for Vehicle Info */}
                     <div className="text-center py-8 text-muted-foreground">Vehicle Information will be shown here.</div>
                </TabsContent>
                 <TabsContent value="documents">
                      {/* Content for Documents */}
                     <div className="text-center py-8 text-muted-foreground">Documents will be shown here.</div>
                </TabsContent>
                 <TabsContent value="company">
                      {/* Content for Company */}
                     <div className="text-center py-8 text-muted-foreground">Company details will be shown here.</div>
                </TabsContent>
                 <TabsContent value="billing">
                      {/* Content for Billing */}
                     <div className="text-center py-8 text-muted-foreground">Billing information will be shown here.</div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
