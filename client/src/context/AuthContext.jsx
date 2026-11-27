import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(isSupabaseConfigured);
  const [profileFor, setProfileFor] = useState(null);
  const [recovering, setRecovering] = useState(false);

  // Session: restored from Supabase's own storage on load, then kept in sync.
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoading(false);
    });

    // Keep this callback synchronous: Supabase recommends not awaiting other
    // Supabase calls inside it.
    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      if (event === 'PASSWORD_RECOVERY') setRecovering(true);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id;

  // `forUserId` lets the login page load the profile immediately after sign-in,
  // before the new session has reached this component's state.
  const loadProfile = useCallback(async (forUserId) => {
    const id = typeof forUserId === 'string' ? forUserId : userId;
    if (!id) {
      setProfile(null);
      setProfileFor(null);
      return null;
    }
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
    if (error) console.error('[Kontinue] profile', error);
    setProfile(error ? null : data);
    setProfileFor(id);
    return error ? null : data;
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
    setProfile(null);
    try {
      sessionStorage.removeItem('kontinue:contact-draft');
      sessionStorage.removeItem('kontinue:consultation-draft');
    } catch {
      // storage may be unavailable; nothing to clear
    }
  }, []);

  const value = useMemo(() => ({
    configured: isSupabaseConfigured,
    session,
    user: session?.user ?? null,
    profile,
    role: profile?.is_active ? profile.role : null,
    loading: sessionLoading || (Boolean(userId) && profileFor !== userId),
    recovering,
    setRecovering,
    refreshProfile: loadProfile,
    signOut,
  }), [session, profile, sessionLoading, profileFor, userId, recovering, loadProfile, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

// Where each role lands after logging in without a specific destination.
export const homeForRole = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'service') return '/service';
  return '/my-portfolio';
};
