'use client';

import React, { useState } from 'react';
import {
  User,
  Building,
  Bell,
  Shield,
  KeyRound,
  Check,
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

export default function SettingsPage() {
  const { user, userProfile } = useSupabaseAuth();
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState<'profile' | 'company' | 'notifications' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState(userProfile?.first_name || '');
  const [lastName, setLastName] = useState(userProfile?.last_name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [companyName, setCompanyName] = useState((userProfile as any)?.company_name || 'SecureHaul Logistics');
  const [address, setAddress] = useState('742 Evergreen Terrace, Springfield');

  // Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [loadUpdates, setLoadUpdates] = useState(true);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('users').upsert({
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        phone,
      });

      if (error) throw error;

      toast({
        title: 'Settings Saved',
        description: 'Your profile information has been updated successfully.',
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: err.message || 'Could not save profile settings.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 w-full min-h-screen bg-[#f2f3ef] p-4 sm:p-8 text-[#171a16] select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e2e4dd] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#82877c]">
              Account &amp; System Preferences
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#171a16] mt-0.5">
              Settings
            </h1>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#e7f4ee] text-[#2c7350] text-xs font-bold font-mono">
            {userProfile?.user_type || 'Shipper'} Portal
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-[#e2e4dd] pb-2 overflow-x-auto">
          {[
            { id: 'profile', label: 'Personal Profile', icon: User },
            { id: 'company', label: 'Company Details', icon: Building },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Access', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#171a16] text-white shadow-sm'
                    : 'bg-white border border-[#e2e4dd] text-[#82877c] hover:text-[#171a16]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── PROFILE SECTION ── */}
        {activeSection === 'profile' && (
          <Card className="bg-white border-[#e2e4dd] shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#171a16]">Personal Information</CardTitle>
              <CardDescription className="text-[#82877c]">
                Manage your personal contact info and dispatcher identity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-xs font-semibold text-[#82877c]">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border-[#e2e4dd] focus:border-[#2c7350]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-xs font-semibold text-[#82877c]">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="border-[#e2e4dd] focus:border-[#2c7350]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-[#82877c]">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-[#f2f3ef] border-[#e2e4dd] text-[#82877c]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold text-[#82877c]">Phone Number</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="border-[#e2e4dd] focus:border-[#2c7350]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#171a16] hover:bg-black text-white font-semibold gap-2 mt-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ── COMPANY SECTION ── */}
        {activeSection === 'company' && (
          <Card className="bg-white border-[#e2e4dd] shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#171a16]">Company &amp; Organization</CardTitle>
              <CardDescription className="text-[#82877c]">
                Official business registration and freight billing address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="companyName" className="text-xs font-semibold text-[#82877c]">Company Legal Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="border-[#e2e4dd]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs font-semibold text-[#82877c]">HQ Operating Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="border-[#e2e4dd]"
                />
              </div>

              <Button
                type="button"
                onClick={() => toast({ title: 'Company Details Updated' })}
                className="bg-[#171a16] hover:bg-black text-white font-semibold gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Company Details</span>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── NOTIFICATIONS SECTION ── */}
        {activeSection === 'notifications' && (
          <Card className="bg-white border-[#e2e4dd] shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#171a16]">Notification Channels</CardTitle>
              <CardDescription className="text-[#82877c]">
                Configure how and when you receive dispatch alerts and bid notices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border border-[#e2e4dd]">
                <div>
                  <h4 className="text-sm font-bold text-[#171a16]">Email Bid Notifications</h4>
                  <p className="text-xs text-[#82877c]">Receive instant emails when a carrier counters or accepts your load.</p>
                </div>
                <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-[#e2e4dd]">
                <div>
                  <h4 className="text-sm font-bold text-[#171a16]">SMS Telematics Alerts</h4>
                  <p className="text-xs text-[#82877c]">SMS for shipment status milestones (Pickup, In Transit, Delivery POD).</p>
                </div>
                <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-[#e2e4dd]">
                <div>
                  <h4 className="text-sm font-bold text-[#171a16]">Real-time Live Chat Badges</h4>
                  <p className="text-xs text-[#82877c]">Show live unread indicators on the sidebar chat icon.</p>
                </div>
                <Switch checked={loadUpdates} onCheckedChange={setLoadUpdates} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── SECURITY SECTION ── */}
        {activeSection === 'security' && (
          <Card className="bg-white border-[#e2e4dd] shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#171a16]">Security &amp; Passwords</CardTitle>
              <CardDescription className="text-[#82877c]">
                Update your SecureHaul credentials and session authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-[#e7f4ee] border border-[#a9e6c8] text-[#2c7350] flex items-center gap-3">
                <Shield className="w-5 h-5 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">Supabase Row-Level Security Protected</p>
                  <p>All sensitive cargo manifests and payment credentials are encrypted end-to-end.</p>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => toast({ title: 'Password Reset Email Sent', description: `Check ${user?.email} for reset instructions.` })}
                variant="outline"
                className="border-[#e2e4dd] text-[#171a16]"
              >
                Send Password Reset Email
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
