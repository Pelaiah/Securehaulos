'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, MapPin, Truck } from 'lucide-react';

const tripPoints = [
    { type: 'Start Point', time: '9:01 AM', location: 'Bald Hill Street, Jackson Heights, Manhattan', status: 'completed' },
    { type: 'Stop Point', time: '9:48 AM', location: 'West Griffin Street, Staten Island, Manhattan', status: 'completed' },
    { type: 'Stop Point', time: '10:10 AM', location: 'Carpenter Ave, Brooklyn', status: 'active' },
    { type: 'Finish Point', time: '11:32 AM', location: 'St. Bay Shore, Manhattan', status: 'pending' },
];

export function TripInfoCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Trip Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative pl-6">
                    {/* Vertical line */}
                    <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
                    
                    {tripPoints.map((point, index) => {
                        const isCompleted = point.status === 'completed';
                        const isActive = point.status === 'active';

                        return (
                            <div key={index} className="flex items-start gap-6 relative pb-8">
                                <div className="z-10 flex-shrink-0">
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-6 h-6 text-primary bg-background" />
                                    ) : (
                                        <Circle className={`w-6 h-6 ${isActive ? 'text-primary animate-pulse' : 'text-muted-foreground'} bg-background`} />
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-sm">{point.time}</p>
                                    <p className="text-muted-foreground text-sm">{point.type}</p>
                                    <p className="font-medium">{point.location}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
