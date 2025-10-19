'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export function PaymentInfoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          INFORMATION
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <div className="bg-card-alt p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
                 <div className="w-10 h-7 bg-muted rounded-sm flex items-center justify-center">
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
      </CardContent>
    </Card>
  );
}
