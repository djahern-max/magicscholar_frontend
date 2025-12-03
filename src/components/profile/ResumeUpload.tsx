// src/components/profile/ResumeUpload.tsx
// Resume upload component

'use client';

import React, { useState, useRef } from 'react';
import { useProfile } from '@/lib/contexts/ProfileContext';
import { useRouter } from 'next/navigation';

export default function ResumeUpload() {
  const { uploadResume } = useProfile();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [parseResults, setParseResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setSuccess(false);
    setParseResults(null);

    // Validate file type
    if (!file.type.includes('pdf') && !file.type.includes('wordprocessingml')) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    try {
      setUploading(true);

      const result = await uploadResume(file);

      setSuccess(true);
      setParseResults(result);

      // Redirect to profile after 3 seconds
      setTimeout(() => {
        router.push('/profile');
      }, 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to upload resume. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Upload your resume
          </h1>
          <p className="text-sm text-gray-600">
            Upload a PDF or Word document. We&apos;ll read it and use the
            information to help fill out your profile.
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={!uploading ? handleButtonClick : undefined}
          className={`
            rounded-lg border-2 border-dashed p-10 text-center text-sm transition-colors
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
            ${uploading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleChange}
            disabled={uploading}
            className="hidden"
          />

          {uploading ? (
            <div className="space-y-3">
              <div className="mx-auto h-10 w-10 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
              <p className="text-gray-800 font-medium">
                Uploading and reading your resume…
              </p>
              <p className="text-xs text-gray-500">
                This usually takes only a few seconds.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-800 font-medium">
                {dragActive ? 'Drop your resume here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500">
                PDF or DOCX, up to 10MB.
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs text-red-700 underline hover:text-red-900"
            >
              Clear message
            </button>
          </div>
        )}

        {/* Success Message with Parse Results */}
        {success && parseResults && (
          <div className="space-y-3 rounded-md border border-green-200 bg-green-50 px-4 py-3">
            <h2 className="text-sm font-medium text-green-900">
              Resume uploaded successfully.
            </h2>

            <div className="text-xs text-green-800 space-y-1.5">
              {typeof parseResults.metadata?.fields_extracted === 'number' && (
                <p>Details found: {parseResults.metadata.fields_extracted}</p>
              )}
              {typeof parseResults.metadata?.confidence_score === 'number' && (
                <p>
                  Approximate confidence:{' '}
                  {(parseResults.metadata.confidence_score * 100).toFixed(0)}%
                </p>
              )}
              {Array.isArray(parseResults.scholarship_matches) &&
                parseResults.scholarship_matches.length > 0 && (
                  <p>
                    Matching scholarships found:{' '}
                    {parseResults.scholarship_matches.length}
                  </p>
                )}
            </div>

            {Array.isArray(parseResults.metadata?.extraction_notes) &&
              parseResults.metadata.extraction_notes.length > 0 && (
                <div className="pt-2 border-t border-green-200">
                  <p className="text-xs font-semibold text-green-900 mb-1">
                    Notes:
                  </p>
                  <ul className="text-xs text-green-800 space-y-1 list-disc list-inside">
                    {parseResults.metadata.extraction_notes.map(
                      (note: string, index: number) => (
                        <li key={index}>{note}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

            <div className="pt-2 border-t border-green-200 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-green-800">
                You&apos;ll be sent to your profile in a few seconds.
              </p>
              <button
                onClick={() => router.push('/profile')}
                className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
              >
                Go to profile now
              </button>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            What we do with your resume
          </h3>
          <ul className="text-xs text-gray-700 space-y-1.5">
            <li>We read your resume and pull out key details.</li>
            <li>We use those details to help fill in your profile.</li>
            <li>We look for activities, work experience, and academics.</li>
            <li>You can review everything on your profile page.</li>
          </ul>
        </div>

        {/* Manual entry option */}
        <div className="pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Prefer to fill out your profile yourself?
          </p>
          <button
            onClick={() => router.push('/profile/edit')}
            className="text-sm font-medium text-blue-600 underline hover:text-blue-800"
          >
            Skip resume upload and enter details manually
          </button>
        </div>
      </div>
    </div>
  );
}
