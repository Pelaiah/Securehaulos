import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function PendingApprovalPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#fafbf9] p-4">
      <Card className="w-full max-w-lg border-[#e2e4dd] shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-[#e7f4ee] rounded-full flex items-center justify-center mb-4 border border-green-500/20">
            <ShieldCheck className="w-8 h-8 text-[#2c7350]" />
          </div>
          <CardTitle className="text-2xl font-headline font-bold text-[#171a16]">
            Application Under Review
          </CardTitle>
          <CardDescription className="text-[#82877c] pt-2">
            Your application to join SecureHaul is currently being reviewed by our compliance team.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pt-4 pb-6 space-y-6">
          <p className="text-sm text-[#171a16]">
            We are verifying your credentials and documentation. This process usually takes 24-48 hours. We will notify you via email once your account has been approved and you can access the platform.
          </p>
          <div className="bg-[#f0f2eb] p-4 rounded-lg border border-[#e2e4dd]">
            <p className="text-xs font-semibold text-[#82877c] uppercase tracking-wider mb-1">Status</p>
            <p className="text-[#2c7350] font-medium flex items-center justify-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2c7350] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2c7350]"></span>
              </span>
              Pending Approval
            </p>
          </div>
          <div className="pt-2">
            <Button asChild variant="outline" className="w-full h-11 text-[#171a16] border-[#e2e4dd] hover:bg-[#f0f2eb]">
              <Link href="/">
                <LogOut className="w-4 h-4 mr-2" />
                Return to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
