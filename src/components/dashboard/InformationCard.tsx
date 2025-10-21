'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Cog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '../ui/skeleton';

interface InformationCardProps {
    driver?: {
        name: string;
        avatar: string;
    }
}

export function InformationCard({ driver }: InformationCardProps) {

    if (!driver) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                    INFORMATION
                    </CardTitle>
                    <Button variant="ghost" size="icon">
                        <Cog className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-3/4" />
                           <Skeleton className="h-4 w-1/2" />
                           <Skeleton className="h-4 w-2/3" />
                        </div>
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <div className="flex flex-col items-center text-center space-y-3">
                        <Skeleton className="w-16 h-16 rounded-full" />
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-32" />
                        <div className="flex justify-around w-full my-4">
                            <div className='flex flex-col items-center gap-1'>
                                <Skeleton className="h-3 w-8" />
                                <Skeleton className="h-5 w-10" />
                            </div>
                            <div className='flex flex-col items-center gap-1'>
                               <Skeleton className="h-3 w-20" />
                               <Skeleton className="h-5 w-12" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                INFORMATION
                </CardTitle>
                <Button variant="ghost" size="icon">
                    <Cog className="h-5 w-5 text-muted-foreground" />
                </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                 {/* Left Side */}
                <div className="space-y-4">
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Rent</span>
                        <span className="font-semibold">$156.50</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Fines</span>
                        <span className="font-semibold">$0</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Deposit</span>
                        <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10">
                            Returned
                        </Badge>
                        </div>
                    </div>
                     <div className="bg-muted p-3 rounded-lg flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-7 bg-background rounded-sm flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 12C2 7.28594 2 4.92891 3.46447 3.46447C4.92891 2 7.28594 2 12 2C16.7141 2 19.0711 2 20.5355 3.46447C22 4.92891 22 7.28594 22 12C22 16.7141 22 19.0711 20.5355 20.5355C19.0711 22 16.7141 22 12 22C7.28594 22 4.92891 22 3.46447 20.5355C2 19.0711 2 16.7141 2 12Z" stroke="hsl(var(--muted-foreground))" strokeWidth="2"/>
                                    <path d="M6 7H18" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Bank 360</p>
                                <p className="text-xs text-muted-foreground">**** 1458</p>
                            </div>
                        </div>
                        <Image src="https://i.imgur.com/eY4d36D.png" alt="Mastercard" width={32} height={20} data-ai-hint="credit card logo" />
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col items-center text-center">
                    <Avatar className="w-16 h-16 mb-3">
                        <AvatarImage src={driver.avatar} alt={driver.name} />
                        <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{driver.name}</p>
                    <p className="text-xs text-muted-foreground">{driver.name.toLowerCase().replace(' ','.')}@gmail.com</p>
                    
                    <div className="flex justify-around w-full my-4">
                        <div>
                            <p className="text-xs text-muted-foreground">Rate</p>
                             <div className="flex items-center justify-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="font-bold">4.8</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Driver Experience</p>
                            <p className="font-bold">7 years</p>
                        </div>
                    </div>

                    <Button className="w-full">Start a chat</Button>
                </div>
            </CardContent>
        </Card>
    );
}
