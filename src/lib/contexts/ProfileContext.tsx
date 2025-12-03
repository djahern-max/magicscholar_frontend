// src/lib/contexts/ProfileContext.tsx
// Profile state management context

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, ProfileUpdate } from '@/lib/types/profile';
import * as profileApi from '@/lib/api/profile';
import { useAuth } from './AuthContext';

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: ProfileUpdate) => Promise<void>;
  uploadHeadshot: (file: File) => Promise<void>;
  uploadResume: (file: File) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    if (!user || !token) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await profileApi.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Load profile when user/token changes
  useEffect(() => {
    refreshProfile();
  }, [user, token]);

  const updateProfile = async (data: ProfileUpdate) => {
    try {
      const updated = await profileApi.updateProfile(data);
      setProfile(updated);
    } catch (err) {
      throw err;
    }
  };

  const uploadHeadshot = async (file: File) => {
    try {
      const result = await profileApi.uploadHeadshot(file);
      if (profile) {
        setProfile({ ...profile, profile_image_url: result.profile_image_url });
      }
    } catch (err) {
      throw err;
    }
  };

  const uploadResume = async (file: File) => {
    try {
      const result = await profileApi.uploadResumeAndUpdate(file);
      setProfile(result.profile);
      
      // If confetti is enabled, trigger celebration for successful parse
      if (result.profile.settings.confetti_enabled && result.metadata.fields_extracted > 10) {
        // Trigger confetti animation (implement in component)
        window.dispatchEvent(new CustomEvent('celebrate', { 
          detail: { 
            message: `Successfully extracted ${result.metadata.fields_extracted} fields!`,
            confidence: result.metadata.confidence_score 
          } 
        }));
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      loading,
      error,
      refreshProfile,
      updateProfile,
      uploadHeadshot,
      uploadResume,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}
