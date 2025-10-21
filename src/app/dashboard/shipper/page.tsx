'use client';
import { useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { InformationCard } from '@/components/dashboard/InformationCard';
import { Map } from '@/components/dashboard/Map';
import { ShipmentList } from '@/components/dashboard/ShipmentList';
import { TripInfoCard } from '@/components/dashboard/TripInfoCard';
import { VehicleInfoCard } from '@/components/dashboard/VehicleInfoCard';
import { tripData } from '@/lib/data';
import { trucks } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';


export default function ShipperDashboardPage() {
    const [selectedDriver, setSelectedDriver] = useState(tripData[2]);

    return (
        <div className="flex flex-col h-screen bg-background">
            <Header title={selectedDriver.name} onLogout={() => {}} />

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-6 p-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-lg font-bold">hell shipper</p>
                            </CardContent>
                        </Card>
                        <VehicleInfoCard />
                        <div className="grid grid-cols-3 gap-6">
                            <Card>
                                <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground">Trip Time</p>
                                    <p className="text-lg font-bold">1h 10m</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground">Fuel consumption</p>
                                    <p className="text-lg font-bold">12 liters</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground">Passenger number</p>
                                    <p className="text-lg font-bold">4 persons</p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="h-96">
                            <Map trucks={trucks} selectedTruckId={trucks[4].id} />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <InformationCard driver={selectedDriver} />
                        <TripInfoCard />
                    </div>
                </div>

                <div className="hidden lg:block">
                    <ShipmentList onDriverSelect={setSelectedDriver} title="Trips" />
                </div>
            </div>
        </div>
    )
}
