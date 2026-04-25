import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

const AuthContext = createContext({});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  const signup = async (email, password, displayName, avatarUrl) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          ...(avatarUrl ? { custom_avatar_url: avatarUrl } : {})
        }
      }
    });

    if (error) throw error;
    return data;
  };

  // Login function
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  // Google Login
  const loginWithGoogle = async () => {
    const isNative = Capacitor.isNativePlatform();
    const redirectTo = isNative ? 'com.ali.ledger://login-callback' : window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo
      }
    });
    if (error) throw error;
  };

  // Logout function
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Password reset function
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) throw error;
  };

  // Update password function
  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  };

  // Update profile data (like avatar URL)
  const updateProfile = async (data) => {
    const { error } = await supabase.auth.updateUser({
      data: data
    });
    if (error) throw error;
  };

  // Listen for auth state changes
  useEffect(() => {
    // Timeout fallback: if Supabase doesn't respond in 3s, render the app anyway
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Get initial session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
        clearTimeout(timeout);
      })
      .catch((err) => {
        console.warn('Failed to get session:', err);
        setLoading(false);
        clearTimeout(timeout);
      });

    // Listen for deep links in native app
    let appUrlListener = null;
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener('appUrlOpen', (event) => {
        const urlParams = new URL(event.url);
        if (urlParams.hash) {
          const hashParams = new URLSearchParams(urlParams.hash.substring(1));
          const access_token = hashParams.get('access_token');
          const refresh_token = hashParams.get('refresh_token');
          if (access_token && refresh_token) {
            supabase.auth.setSession({ access_token, refresh_token });
          }
        }
      }).then(listener => {
        appUrlListener = listener;
      });
    }

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
      if (appUrlListener) {
        appUrlListener.remove();
      }
    };
  }, []);

  const value = {
    user,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updatePassword,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};