// src/components/profile/ResumeUpload.tsx
'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Sparkles, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';

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
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
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
        const validTypes = ['.pdf', '.doc', '.docx'];
        const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();

        if (!validTypes.includes(fileExtension)) {
            onUploadError('Invalid file type. Please upload a PDF or Word document.');
            return;
        }
        if (selectedFile.size > 10 * 1024 * 1024) {
            onUploadError('File too large. Maximum size is 10MB.');
            return;
        }
        setFile(selectedFile);
    };

    // 🎉 Confetti when AI finishes parsing/creating the profile
    const celebrateAnalysisComplete = () => {
        const count = 120;
        const defaults = {
            origin: { y: 0.7 },
            zIndex: 9999,
        };
        const colors = ['#22c55e', '#60a5fa', '#a78bfa']; // green/blue/purple to match your AI theme

        function burst(ratio: number, opts: any) {
            confetti({ ...defaults, ...opts, particleCount: Math.floor(count * ratio) });
        }

        burst(0.25, { spread: 26, startVelocity: 45, colors });
        burst(0.2, { spread: 60, colors });
        burst(0.35, { spread: 100, decay: 0.92, scalar: 0.9, colors });
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

            // ✅ Confetti celebrates completion of AI analysis
            celebrateAnalysisComplete();

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
                        <p className="text-sm text-gray-500 mb-4">PDF or Word document (max 10MB)</p>
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
            w-full py-4 px-6 rounded-lg font-medium transition-all duration-200
            ${uploading
                            ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white cursor-not-allowed animate-gradient'
                            : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02]'}
          `}
                >
                    {uploading ? (
                        <span className="flex items-center justify-center gap-3">
                            <div className="relative">
                                <Brain className="h-6 w-6 animate-pulse" />
                                <Sparkles className="h-4 w-4 absolute -top-1 -right-1 animate-ping" />
                            </div>
                            <span className="flex flex-col items-start text-left">
                                <span className="text-lg font-bold text-white">✨ Analyzing with Claude AI...</span>
                                <span className="text-sm font-medium text-white/90">
                                    Extracting your achievements and qualifications
                                </span>
                            </span>
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            <span>Upload Resume & Create Profile with AI</span>
                        </span>
                    )}
                </button>
            )}

            {/* Info Text */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                        <div className="relative">
                            <Brain className="h-6 w-6 text-blue-600" />
                            <Sparkles className="h-3 w-3 text-purple-600 absolute -top-1 -right-1" />
                        </div>
                    </div>
                    <div className="text-sm">
                        <p className="font-bold text-blue-900 mb-2 text-base">🚀 Powered by Claude AI</p>
                        <ul className="space-y-1.5 text-blue-800">
                            <li className="flex items-start">
                                <span className="text-green-600 font-bold mr-2">✓</span>
                                <span><strong>90%+ accuracy</strong> - Advanced AI analyzes your resume</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 font-bold mr-2">✓</span>
                                <span><strong>Auto-extracts</strong> academics, activities, and achievements</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 font-bold mr-2">✓</span>
                                <span><strong>Instant matching</strong> with relevant scholarships</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 font-bold mr-2">✓</span>
                                <span><strong>Review & refine</strong> your AI-generated profile</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
