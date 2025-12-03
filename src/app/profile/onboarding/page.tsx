// src/app/profile/onboarding/page.tsx
'use client';

import React from 'react';
import ResumeUpload from '@/components/profile/ResumeUpload';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">

        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            Set up your profile
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your resume and we’ll use it to fill in your profile.
            You can review everything afterward.
          </p>
        </div>

        {/* Resume Upload Component */}
        <ResumeUpload />

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Fast Setup</h3>
            <p className="text-sm text-gray-600">
              Create your profile in a few seconds instead of entering everything manually.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Accurate Details</h3>
            <p className="text-sm text-gray-600">
              Key information such as academics and activities is automatically read from your resume.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Easy Editing</h3>
            <p className="text-sm text-gray-600">
              You can review and edit your profile at any time.
            </p>
          </div>
        </div>

        {/* Skip Option */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-3">Prefer not to upload a resume?</p>
          <a
            href="/profile/edit"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            Fill out your profile manually
          </a>
        </div>
      </div>
    </div>
  );
}
