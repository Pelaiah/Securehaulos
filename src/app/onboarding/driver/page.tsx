'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase/client';

export default function DriverOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ownAuthority, setOwnAuthority] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // TODO: Handle actual file uploads
      const placeholderUrl = 'placeholder_url'; 

      const { error: insertError } = await supabase
        .from('driver_applications')
        .upsert({
          id: user.id,
          full_legal_name: data.full_legal_name,
          cdl_number: data.cdl_number,
          cdl_doc_url: placeholderUrl,
          truck_make: data.truck_make,
          truck_model: data.truck_model,
          truck_year: data.truck_year,
          truck_vin: data.truck_vin,
          own_authority: ownAuthority,
          mc_number: ownAuthority ? data.mc_number : null,
          dot_number: ownAuthority ? data.dot_number : null,
          insurance_doc_url: placeholderUrl,
          medical_card_url: placeholderUrl
        }, { onConflict: 'id' });

      if (insertError) throw insertError;

      // Assign to the SecureHaul Direct firm eventually, but for now just pending
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'driver', status: 'pending' })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update the users table (used by auth provider for routing)
      const { error: userError } = await supabase
        .from('users')
        .update({ user_type: 'Driver' })
        .eq('id', user.id);

      if (userError) throw userError;

      await supabase.auth.refreshSession();
      router.replace('/dashboard/driver');
    } catch (error) {
      console.error('Error in onboarding:', JSON.stringify(error, null, 2), error);
      alert('An error occurred during onboarding: ' + JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
        <p className="text-gray-600">Your driver application is now pending admin review. We will notify you once it's approved.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Driver Verification</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_legal_name">Full Legal Name *</Label>
            <Input id="full_legal_name" name="full_legal_name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cdl_number">CDL Number *</Label>
            <Input id="cdl_number" name="cdl_number" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cdl_doc">CDL Document Upload *</Label>
          <Input id="cdl_doc" name="cdl_doc" type="file" required />
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-medium mb-4">Truck Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="truck_make">Make *</Label>
              <Input id="truck_make" name="truck_make" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="truck_model">Model *</Label>
              <Input id="truck_model" name="truck_model" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="truck_year">Year *</Label>
              <Input id="truck_year" name="truck_year" type="number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="truck_vin">VIN *</Label>
              <Input id="truck_vin" name="truck_vin" required />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="own_authority" checked={ownAuthority} onCheckedChange={(c) => setOwnAuthority(c as boolean)} />
            <Label htmlFor="own_authority">I have my own operating authority (MC/DOT)</Label>
          </div>

          {ownAuthority && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mc_number">MC Number *</Label>
                <Input id="mc_number" name="mc_number" required={ownAuthority} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dot_number">DOT Number *</Label>
                <Input id="dot_number" name="dot_number" required={ownAuthority} />
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="medical_card">Medical Certificate Upload *</Label>
            <Input id="medical_card" name="medical_card" type="file" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="insurance_doc">Insurance Document Upload *</Label>
            <Input id="insurance_doc" name="insurance_doc" type="file" required />
          </div>
        </div>

        <Button type="submit" className="w-full mt-6" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </div>
  );
}
