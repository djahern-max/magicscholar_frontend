// src/components/profile/ResumeUpload.tsx
'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface ResumeUploadProps {
    onUploadSuccess: (data: any) => void;
    onUploadError: (error: string) => void;
}

export default function ResumeUpload({ onUploadSuccess, onUploadError }: ResumeUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

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
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (selectedFile: File) => {
        // Validate file type
        const validTypes = ['.pdf', '.doc', '.docx'];
        const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();

        if (!validTypes.includes(fileExtension)) {
            onUploadError('Invalid file type. Please upload a PDF or Word document.');
            return;
        }

        // Validate file size (10MB)
        if (selectedFile.size > 10 * 1024 * 1024) {
            onUploadError('File too large. Maximum size is 10MB.');
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const token = localStorage.getItem('token');

        if (!token) {
            onUploadError('Please log in to upload your resume.');
            setUploading(false);
            return;
        }

        try {
            const { profileService } = await import('@/lib/profileService');
            const result = await profileService.uploadResume(token, file);
            onUploadSuccess(result);
        } catch (error: any) {
            console.error('Upload error:', error);
            onUploadError(error.response?.data?.detail || 'Failed to upload resume. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Drag & Drop Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${file ? 'bg-green-50 border-green-500' : ''}
        `}
            >
                {!file ? (
                    <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-2">
                            Drop your resume here, or click to browse
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            PDF or Word document (max 10MB)
                        </p>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                            className="hidden"
                            id="resume-upload"
                        />
                        <label
                            htmlFor="resume-upload"
                            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                        >
                            Choose File
                        </label>
                    </>
                ) : (
                    <>
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-2">
                            <FileText className="inline h-5 w-5 mr-2" />
                            {file.name}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                            onClick={() => setFile(null)}
                            className="text-sm text-gray-600 hover:text-gray-800 underline"
                        >
                            Choose a different file
                        </button>
                    </>
                )}
            </div>

            {/* Upload Button */}
            {file && (
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className={`
            w-full py-3 px-6 rounded-lg font-medium text-white transition-colors
            ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
          `}
                >
                    {uploading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span className="flex flex-col items-start">
                                <span className="font-semibold">Analyzing with Claude AI...</span>
                                <span className="text-sm text-gray-100">Extracting your achievements and qualifications</span>
                            </span>
                        </span>
                    ) : (
                        'Upload Resume & Create Profile'
                    )}
                </button>
            )}

            {/* Info Text */}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Powered by Claude AI:</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-700">
                            <li>Advanced AI analyzes your resume with 90%+ accuracy</li>
                            <li>Automatically extracts academics, activities, and achievements</li>
                            <li>Instantly matches you with relevant scholarships</li>
                            <li>Review and refine your AI-generated profile</li>
                        </ul>
                    </div>
                </div>
            </div>


        </div>
    );
}