'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';

const tripPoints = [
    { type: 'Start Point', time: '9:01 AM', location: 'Bald Hill Street, Jackson Heights, Manhattan', status: 'completed' },
    { type: 'Stop Point', time: '9:48 AM', location: 'West Griffin Street, Staten Island, Manhattan', status: 'completed' },
    { type: 'Stop Point', time: '10:10 AM', location: 'Carpenter Ave, Brooklyn', status: 'active' },
    { type: 'Finish Point', time: '11:32 AM', location: 'St. Bay Shore, Manhattan', status: 'pending' },
];

export function TripInfoCard() {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="relative pl-6">
                    {/* Vertical line */}
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
                    
                    {tripPoints.map((point, index) => {
                        const isCompleted = point.status === 'completed';
                        const isActive = point.status === 'active';

                        return (
                            <div key={index} className="flex items-start gap-6 relative pb-8 last:pb-0">
                                <div className="z-10 flex-shrink-0 -ml-1">
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-6 h-6 text-primary bg-background" />
                                    ) : (
                                        <div className="relative flex items-center justify-center">
                                            <Circle className={`w-4 h-4 fill-current ${isActive ? 'text-primary' : 'text-muted-foreground/50'} bg-background`} />
                                            {isActive && <Circle className="w-6 h-6 text-primary absolute animate-pulse" />}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow -mt-1.5">
                                    <p className="font-semibold text-sm">{point.time} <span className='text-xs text-muted-foreground'>{point.type}</span></p>
                                    <p className="text-muted-foreground text-sm">{point.location}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
