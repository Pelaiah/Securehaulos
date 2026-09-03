'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DriverBottomNavigation, DriverTabType } from './DriverBottomNavigation';
import { DriverHomeCockpit } from './DriverHomeCockpit';
import { DriverActiveTripMode } from './DriverActiveTripMode';
import { DriverPickupWorkflow } from './DriverPickupWorkflow';
import { DriverDeliveryWorkflow } from './DriverDeliveryWorkflow';
import { DriverMapLoadBoard } from './DriverMapLoadBoard';
import { DriverEarningsDashboard } from './DriverEarningsDashboard';
import { DriverVehicleStatus } from './DriverVehicleStatus';
import { DriverProfileDocuments } from './DriverProfileDocuments';
import { DriverDispatcherChat } from './DriverDispatcherChat';
import { DriverNotificationsModal } from './DriverNotificationsModal';
import {
  mockCurrentTrip,
  mockUpcomingLoads,
  mockCompletedLoads,
  mockVehicleHealth,
  mockDriverProfile,
  mockEarnings,
  mockInitialMessages,
} from './mockData';
import {
  DriverTrip,
  TripStatus,
  DriverOperationalStatus,
  DispatchMessage,
  VehicleHealth,
  DriverProfile,
  EarningsData,
} from './types';
import { useSupabaseAuth } from '@/components/providers/SupabaseAuthProvider';
import { useToast } from '@/hooks/use-toast';

export function DriverPortalContainer() {
  const router = useRouter();
  const { user, userProfile, signOut } = useSupabaseAuth();
  const { toast } = useToast();

  // Master Active Navigation / Sub-screen Mode
  const [activeTab, setActiveTab] = useState<DriverTabType>('home');
  const [activeSubView, setActiveSubView] = useState<'pickup_flow' | 'delivery_flow' | 'dispatcher_chat' | 'vehicle_health' | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Core Driver State
  const [currentTrip, setCurrentTrip] = useState<DriverTrip>(mockCurrentTrip);
  const [driverStatus, setDriverStatus] = useState<DriverOperationalStatus>('online');
  const [messages, setMessages] = useState<DispatchMessage[]>(mockInitialMessages);
  const [vehicle, setVehicle] = useState<VehicleHealth>(mockVehicleHealth);
  const [profile, setProfile] = useState<DriverProfile>({
    ...mockDriverProfile,
    name: user?.user_metadata?.full_name || (userProfile ? `${userProfile.first_name} ${userProfile.last_name}`.trim() : mockDriverProfile.name),
  });
  const [earnings, setEarnings] = useState<EarningsData>(mockEarnings);

  // Status Stepper Updater
  const handleUpdateTripStatus = (
    newStatus: TripStatus,
    metadata?: { sealNumber?: string; podSignature?: string; podNotes?: string }
  ) => {
    setCurrentTrip((prev) => ({
      ...prev,
      status: newStatus,
      sealNumber: metadata?.sealNumber || prev.sealNumber,
      podSignature: metadata?.podSignature || prev.podSignature,
      podNotes: metadata?.podNotes || prev.podNotes,
    }));

    if (newStatus === 'COMPLETED') {
      // Add trip earnings to today amount
      setEarnings((prev) => ({
        ...prev,
        todayAmount: prev.todayAmount + (currentTrip.metrics.payout || 1420.0),
      }));
    }
  };

  // Status Toggle (Online / On Break)
  const handleToggleDriverStatus = () => {
    setDriverStatus((prev) => (prev === 'online' ? 'on_break' : 'online'));
  };

  // Dispatcher Messages
  const handleSendMessage = (text: string, isQuickAction?: boolean) => {
    const newMsg: DispatchMessage = {
      id: `msg-${Date.now()}`,
      sender: 'driver',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isQuickAction,
    };
    setMessages((prev) => [...prev, newMsg]);

    // Dispatcher auto-acknowledgement simulation
    setTimeout(() => {
      const ackMsg: DispatchMessage = {
        id: `msg-ack-${Date.now()}`,
        sender: 'dispatcher',
        text: `Roger that Steven. Logged: "${text}". Dispatch is tracking your progress.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, ackMsg]);
    }, 1200);
  };

  // Emergency SOS Trigger
  const handleTriggerEmergency = () => {
    handleSendMessage('EMERGENCY SOS ACTIVATED: GPS Transmitted to Fleet Safety & 911 Dispatch.');
    toast?.({
      title: '🚨 EMERGENCY SOS TRANSMITTED',
      description: 'Fleet Dispatch and local emergency responders have received your live GPS coordinates.',
    });
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F8F6] text-[#1C1E21] flex flex-col items-center justify-start antialiased selection:bg-[#34785D] selection:text-white">
      {/* Mobile Device Viewport Shell Container */}
      <div className="w-full max-w-lg min-h-screen flex flex-col relative bg-[#F7F8F6] overflow-x-hidden">
        {/* Active View Routing */}
        {activeSubView === 'pickup_flow' ? (
          <DriverPickupWorkflow
            trip={currentTrip}
            onBack={() => setActiveSubView(null)}
            onUpdateStatus={handleUpdateTripStatus}
            onCompletePickup={() => {
              setActiveSubView(null);
              setActiveTab('navigate');
            }}
          />
        ) : activeSubView === 'delivery_flow' ? (
          <DriverDeliveryWorkflow
            trip={currentTrip}
            onBack={() => setActiveSubView(null)}
            onUpdateStatus={handleUpdateTripStatus}
            onViewNextLoad={() => {
              setActiveSubView(null);
              setActiveTab('loads');
            }}
          />
        ) : activeSubView === 'dispatcher_chat' ? (
          <DriverDispatcherChat
            messages={messages}
            onSendMessage={handleSendMessage}
            onBack={() => setActiveSubView(null)}
            activeTrip={currentTrip}
          />
        ) : activeSubView === 'vehicle_health' ? (
          <div className="flex flex-col">
            <div className="p-3">
              <button
                type="button"
                onClick={() => setActiveSubView(null)}
                className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#E8F4EE] hover:text-[#34785D] text-xs font-bold text-[#1C1E21] mb-2 border border-[#E1E6E2] shadow-sm transition-colors"
              >
                ← Back to Cockpit
              </button>
            </div>
            <DriverVehicleStatus
              vehicle={vehicle}
              onReportIssue={() => {
                setActiveSubView('dispatcher_chat');
                handleSendMessage('Reporting Vehicle Issue: Pre-trip sensor check or mechanical alert.', true);
              }}
            />
          </div>
        ) : (
          <>
            {/* Primary Tab Navigation Views */}
            {activeTab === 'home' && (
              <DriverHomeCockpit
                trip={currentTrip}
                profile={profile}
                driverStatus={driverStatus}
                onToggleStatus={handleToggleDriverStatus}
                onStartTrip={() => setActiveTab('navigate')}
                onOpenPickupFlow={() => setActiveSubView('pickup_flow')}
                onOpenDeliveryFlow={() => setActiveSubView('delivery_flow')}
                onOpenVehicleHealth={() => setActiveSubView('vehicle_health')}
                onOpenDispatcherChat={() => setActiveSubView('dispatcher_chat')}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
              />
            )}

            {activeTab === 'navigate' && (
              <DriverActiveTripMode
                trip={currentTrip}
                onExitNav={() => setActiveTab('home')}
                onProceedToPickup={() => setActiveSubView('pickup_flow')}
                onProceedToDelivery={() => setActiveSubView('delivery_flow')}
                onOpenDispatcherChat={() => setActiveSubView('dispatcher_chat')}
                onTriggerEmergency={handleTriggerEmergency}
              />
            )}

            {activeTab === 'loads' && (
              <DriverMapLoadBoard
                onOpenControls={() => setActiveTab('navigate')}
              />
            )}

            {activeTab === 'earnings' && (
              <DriverEarningsDashboard earnings={earnings} />
            )}

            {activeTab === 'profile' && (
              <DriverProfileDocuments
                profile={profile}
                onLogout={handleLogout}
              />
            )}
          </>
        )}

        {/* Global Notifications Modal */}
        <DriverNotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onNotificationAction={(n) => {
            setIsNotificationsOpen(false);
            if (n.type === 'load') setActiveTab('loads');
            if (n.type === 'reminder') setActiveSubView('pickup_flow');
          }}
        />

        {/* Floating Master Bottom Bar (hidden only during fullscreen subviews if desired) */}
        {!activeSubView && (
          <DriverBottomNavigation
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveSubView(null);
              setActiveTab(tab);
            }}
            isTripActive={currentTrip.status !== 'COMPLETED'}
          />
        )}
      </div>
    </div>
  );
}
