'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';

export default function ShipperOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 1. Insert company details
      const { error: insertError } = await supabase
        .from('shipper_company_details')
        .upsert({
          id: user.id,
          company_name: data.company_name,
          dba: data.dba || null,
          address: data.address,
          commodity_type: data.commodity_type,
          monthly_volume: data.monthly_volume,
          billing_contact_name: data.billing_contact_name,
          billing_contact_email: data.billing_contact_email,
          billing_contact_phone: data.billing_contact_phone,
        }, { onConflict: 'id' });

      if (insertError) throw insertError;

      // 2. Update profile to 'active' shipper
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'shipper', status: 'active' })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 3. Update the users table (used by auth provider for routing)
      const { error: userError } = await supabase
        .from('users')
        .update({ user_type: 'Shipper' })
        .eq('id', user.id);

      if (userError) throw userError;

      // 4. Force token refresh to pick up new claims
      await supabase.auth.refreshSession();
      
      router.replace('/dashboard/shipper');
    } catch (error) {
      console.error('Error in onboarding:', JSON.stringify(error, null, 2), error);
      alert('An error occurred during onboarding: ' + JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Shipper Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name *</Label>
            <Input id="company_name" name="company_name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dba">DBA (Optional)</Label>
            <Input id="dba" name="dba" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Business Address *</Label>
          <Input id="address" name="address" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="commodity_type">Industry / Commodity Type *</Label>
            <Input id="commodity_type" name="commodity_type" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthly_volume">Monthly Shipment Volume *</Label>
            <Input id="monthly_volume" name="monthly_volume" type="number" required />
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-medium mb-4">Billing Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billing_contact_name">Name *</Label>
              <Input id="billing_contact_name" name="billing_contact_name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing_contact_email">Email *</Label>
              <Input id="billing_contact_email" name="billing_contact_email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing_contact_phone">Phone *</Label>
              <Input id="billing_contact_phone" name="billing_contact_phone" required />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full mt-6" disabled={loading}>
          {loading ? 'Saving...' : 'Complete Setup'}
        </Button>
      </form>
    </div>
  );
}
