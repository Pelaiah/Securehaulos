'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, Circle, Truck, Package } from 'lucide-react';
import Image from 'next/image';
import { Progress } from '../ui/progress';

const tripPoints = [
    { type: 'Receipt', time: '10:07 AM', status: 'completed' },
    { type: 'Preparation', time: '13:18 PM', status: 'completed' },
    { type: 'Dispatch', time: '14:33 PM', status: 'active' },
    { type: 'Receiving', time: '16:13 PM', status: 'pending' },
];

export function OrderInfoCard({ trip }: { trip: any }) {
    if (!trip) return null;
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Order Info</CardTitle>
                    <CardDescription className="hover:underline cursor-pointer">View more</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10">
                    <div className='font-bold text-lg'>NYC</div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                             <Truck className="w-5 h-5 text-muted-foreground" />
                             <div className="h-px w-10 bg-border"></div>
                             <span className="text-xs text-muted-foreground">1:40</span>
                             <div className="h-px w-10 bg-border"></div>
                             <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                         <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <span>14:33 PM</span>
                            <div className="w-20 h-px bg-border mx-2"></div>
                            <span>16:13 PM</span>
                        </div>
                    </div>
                     <div className='font-bold text-lg'>PHI</div>
                </div>

                <div className="font-semibold text-center my-4">#PTRG4523</div>

                <div className="relative pl-6 space-y-6">
                    {/* Vertical line */}
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
                    
                    {tripPoints.map((point, index) => {
                        const isCompleted = point.status === 'completed';
                        const isActive = point.status === 'active';

                        return (
                            <div key={index} className="flex items-start gap-6 relative">
                                <div className="z-10 flex-shrink-0 -ml-1 mt-1">
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-6 h-6 text-primary bg-background" />
                                    ) : (
                                        <div className="relative flex items-center justify-center">
                                            <Circle className={`w-4 h-4 fill-current ${isActive ? 'text-primary' : 'text-muted-foreground/50'} bg-background`} />
                                            {isActive && <Circle className="w-6 h-6 text-primary absolute animate-pulse" />}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow flex justify-between items-center">
                                    <p className="font-semibold text-sm">{point.type}</p>
                                    <p className="text-muted-foreground text-sm">{point.time}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-6">
                    <Progress value={60} />
                    <p className="text-sm text-muted-foreground text-center mt-2">60% Completed</p>
                </div>
            </CardContent>
        </Card>
    )
}
