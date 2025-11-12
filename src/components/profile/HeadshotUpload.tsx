// src/components/profile/HeadshotUpload.tsx
'use client';

import React, { useState } from 'react';
import { Camera, User, AlertCircle } from 'lucide-react';
import { profileService } from '@/lib/profileService';

interface HeadshotUploadProps {
    currentImageUrl?: string;
    onUploadSuccess: (imageUrl: string) => void;
}

export default function HeadshotUpload({ currentImageUrl, onUploadSuccess }: HeadshotUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log('📁 File selected:', {
            name: file.name,
            type: file.type,
            size: file.size,
            sizeInMB: (file.size / (1024 * 1024)).toFixed(2)
        });

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            const errorMsg = `Please upload a JPG, PNG, or WEBP image. You uploaded: ${file.type}`;
            console.error('❌ Invalid file type:', errorMsg);
            setError(errorMsg);
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            const errorMsg = `Image too large. Size: ${(file.size / (1024 * 1024)).toFixed(2)}MB, Maximum: 5MB`;
            console.error('❌ File too large:', errorMsg);
            setError(errorMsg);
            return;
        }

        setError('');

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
            console.log('✅ Preview loaded');
        };
        reader.onerror = () => {
            console.error('❌ Error reading file for preview');
        };
        reader.readAsDataURL(file);

        // Upload
        setUploading(true);
        const token = localStorage.getItem('token');

        if (!token) {
            const errorMsg = 'Please log in to upload your photo';
            console.error('❌ No auth token found');
            setError(errorMsg);
            setUploading(false);
            return;
        }

        console.log('🚀 Starting upload to API...');

        try {
            const result = await profileService.uploadProfileImage(token, file);
            console.log('✅ Upload successful:', result);
            onUploadSuccess(result.profile_image_url);
            setError('');
        } catch (err: any) {
            console.error('❌ Upload error:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                statusText: err.response?.statusText,
                fullError: err
            });

            // Detailed error message
            let errorMsg = 'Failed to upload image';

            if (err.response?.data?.detail) {
                errorMsg = err.response.data.detail;
            } else if (err.response?.status === 413) {
                errorMsg = 'File too large for server';
            } else if (err.response?.status === 401) {
                errorMsg = 'Not authenticated. Please log in again';
            } else if (err.response?.status === 500) {
                errorMsg = 'Server error. Please try again';
            } else if (err.message) {
                errorMsg = err.message;
            }

            setError(errorMsg);
            setPreview(currentImageUrl || null);
        } finally {
            setUploading(false);
            console.log('🏁 Upload process complete');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Profile Photo
            </h3>

            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                {/* Photo Preview - Centered on mobile */}
                <div className="relative w-full sm:w-auto flex justify-center sm:justify-start">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-gray-200 flex-shrink-0">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                        )}
                    </div>

                    {uploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    )}
                </div>

                {/* Upload Section */}
                <div className="flex-1 w-full">
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 text-center sm:text-left">
                        Upload a professional headshot to personalize your profile
                    </p>

                    {error && (
                        <div className="mb-3 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start">
                                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs sm:text-sm text-red-800 font-medium">{error}</p>
                                    <p className="text-xs text-red-600 mt-1">Check browser console (F12) for details</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            capture="user"
                            onChange={handleFileSelect}
                            disabled={uploading}
                            className="hidden"
                            id="headshot-upload"
                        />
                        <label
                            htmlFor="headshot-upload"
                            className={`
                                w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors cursor-pointer text-sm sm:text-base
                                ${uploading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }
                            `}
                        >
                            <Camera className="h-4 w-4 flex-shrink-0" />
                            <span>{uploading ? 'Uploading...' : preview ? 'Change Photo' : 'Upload Photo'}</span>
                        </label>
                    </div>

                    <p className="text-xs text-gray-500 mt-2 text-center sm:text-left">
                        Take a photo or choose from gallery • Max 5MB
                    </p>
                </div>
            </div>
        </div>
    );
}