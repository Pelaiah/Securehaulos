'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';

export default function CarrierOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // TODO: Handle actual file upload to Supabase Storage and get URL
      // For now, using a placeholder URL to test the flow
      const insuranceDocUrl = 'placeholder_url'; 

      const { error: insertError } = await supabase
        .from('carrier_applications')
        .upsert({
          id: user.id,
          company_name: data.company_name,
          mc_number: data.mc_number,
          dot_number: data.dot_number,
          fleet_size: parseInt(data.fleet_size as string, 10),
          insurance_doc_url: insuranceDocUrl
        }, { onConflict: 'id' });

      if (insertError) throw insertError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'carrier', status: 'pending' })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update the users table (used by auth provider for routing)
      const { error: userError } = await supabase
        .from('users')
        .update({ user_type: 'Carrier' })
        .eq('id', user.id);

      if (userError) throw userError;

      await supabase.auth.refreshSession();
      router.replace('/dashboard/carrier');
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
        <p className="text-gray-600">Your carrier application is now pending admin review. We will notify you once it's approved.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Carrier Verification</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name *</Label>
          <Input id="company_name" name="company_name" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mc_number">MC Number *</Label>
            <Input id="mc_number" name="mc_number" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dot_number">DOT Number *</Label>
            <Input id="dot_number" name="dot_number" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fleet_size">Fleet Size (Number of Trucks) *</Label>
          <Input id="fleet_size" name="fleet_size" type="number" min="1" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="insurance_doc">Insurance Document Upload *</Label>
          <Input id="insurance_doc" name="insurance_doc" type="file" required />
        </div>

        <Button type="submit" className="w-full mt-6" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </div>
  );
}
