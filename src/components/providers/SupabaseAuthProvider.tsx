'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile, CarrierProfile } from '@/lib/supabase/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  carrierProfile: CarrierProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userProfile: null,
  carrierProfile: null,
  isLoading: true,
  signOut: async () => {},
});

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [carrierProfile, setCarrierProfile] = useState<CarrierProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfiles(session.user.id);
        }
      } catch (err) {
        console.error('Error fetching initial session:', err);
      } finally {
        setIsLoading(false);
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfiles(session.user.id);
      } else {
        setUserProfile(null);
        setCarrierProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfiles(userId: string) {
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile) {
        setUserProfile(profile as UserProfile);

        if (profile.user_type === 'Carrier') {
          const { data: carrier } = await supabase
            .from('carriers')
            .select('*')
            .eq('id', userId)
            .single();
          if (carrier) {
            setCarrierProfile(carrier as CarrierProfile);
          }
        }
      }
    } catch (err) {
      console.warn('Profile fetch warning (may be using mock data):', err);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserProfile(null);
    setCarrierProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, session, userProfile, carrierProfile, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useSupabaseAuth = () => useContext(AuthContext);

export const useUser = () => {
  const context = useContext(AuthContext);
  return {
    ...context,
    isUserLoading: context.isLoading,
    profile: context.userProfile,
    role: context.userProfile?.user_type,
  };
};

export const useAuth = useSupabaseAuth;
