import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  getProfile: () => Promise<{
    id: string;
    full_name: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    province: string | null;
  } | null>;
  updateProfile: (profile: {
    full_name?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    province?: string | null;
  }) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updatePreferences: (preferences: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const getProfile = async () => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone, address, city, province')
      .eq('id', user.id)
      .maybeSingle();
    if (error) throw error;
    return data;
  };

  const updateProfile = async (profile: {
    full_name?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    province?: string | null;
  }) => {
    if (!user) throw new Error('No user logged in');

    const upsertPayload = {
      id: user.id,
      full_name: profile.full_name ?? null,
      phone: profile.phone ?? null,
      address: profile.address ?? null,
      city: profile.city ?? null,
      province: profile.province ?? null,
    };

    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert(upsertPayload, { onConflict: 'id' });

    if (upsertError) throw upsertError;

    // Also mirror basic fields in auth user metadata for quick access
    const { error: metaError } = await supabase.auth.updateUser({
      data: {
        full_name: upsertPayload.full_name,
        address: upsertPayload.address,
        city: upsertPayload.city,
        province: upsertPayload.province,
      }
    });
    if (metaError) throw metaError;
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('No user logged in');

    // First verify the current password
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (verifyError) throw new Error('Current password is incorrect');

    // Then update to the new password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  };

  const updatePreferences = async (preferences: any) => {
    if (!user) throw new Error('No user logged in');

    // Store preferences in user metadata
    const { error } = await supabase.auth.updateUser({
      data: {
        preferences: {
          ...(user.user_metadata?.preferences || {}),
          ...preferences
        }
      }
    });

    if (error) throw error;
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    getProfile,
    updateProfile,
    updatePassword,
    updatePreferences,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
