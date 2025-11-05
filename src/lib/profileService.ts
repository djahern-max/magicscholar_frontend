// src/lib/profileService.ts

import axios from 'axios';
import { UserProfile, ProfileUpdateData, ResumeUploadResponse } from '@/types/profile';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const profileService = {
    // Get current user's profile
    async getProfile(token: string): Promise<UserProfile> {
        const response = await axios.get(`${API_BASE_URL}/api/v1/profiles/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    // Update profile
    async updateProfile(token: string, data: ProfileUpdateData): Promise<UserProfile> {
        const response = await axios.put(`${API_BASE_URL}/api/v1/profiles/me`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    // Upload resume and auto-update profile
    async uploadResume(token: string, file: File): Promise<ResumeUploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(
            `${API_BASE_URL}/api/v1/profiles/me/upload-resume-and-update`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    // Upload profile image
    async uploadProfileImage(token: string, file: File): Promise<{ profile_image_url: string }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(
            `${API_BASE_URL}/api/v1/profiles/me/upload-headshot`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },
};