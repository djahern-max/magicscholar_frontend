// src/app/profile/page.tsx
// Main profile view page

'use client';

import React from 'react';
import { useProfile } from '@/lib/contexts/ProfileContext';
import ProfileDisplay from '@/components/profile/ProfileDisplay';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { profile, loading, error } = useProfile();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <div className="mx-auto h-10 w-10 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
          <p className="text-sm text-gray-700">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-lg border border-red-200 bg-red-50 px-6 py-5 space-y-3">
          <h2 className="text-base font-semibold text-red-900">
            We couldn&apos;t load your profile
          </h2>
          <p className="text-sm text-red-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Set up your profile
          </h1>
          <p className="text-sm text-gray-600">
            Upload your resume and we&apos;ll use it to fill in your profile.
            You can review and edit everything before you share it.
          </p>
          <button
            onClick={() => router.push('/profile/onboarding')}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Upload resume
          </button>
        </div>
      </div>
    );
  }

  return <ProfileDisplay profile={profile} />;
}
