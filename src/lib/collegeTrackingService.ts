// src/lib/collegeTrackingService.ts

import axios from 'axios';
import {
    CollegeDashboard,
    CollegeApplication,
    CollegeApplicationCreate,
    CollegeApplicationUpdate,
    ApplicationStatus,
} from '@/types/college-tracking';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const collegeTrackingService = {
    /**
     * Get user's college dashboard with summary stats
     */
    getDashboard: async (token: string): Promise<CollegeDashboard> => {
        const response = await axios.get(`${API_BASE_URL}/api/v1/college-tracking/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    /**
     * Get all college applications with optional filtering
     */
    getApplications: async (
        token: string,
        params?: {
            status?: ApplicationStatus;
            sort_by?: 'deadline' | 'saved_at' | 'status';
            sort_order?: 'asc' | 'desc';
        }
    ): Promise<CollegeApplication[]> => {
        const response = await axios.get(`${API_BASE_URL}/api/v1/college-tracking/applications`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });
        return response.data;
    },

    /**
     * Get a specific college application
     */
    getApplication: async (token: string, applicationId: number): Promise<CollegeApplication> => {
        const response = await axios.get(
            `${API_BASE_URL}/api/v1/college-tracking/applications/${applicationId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    },

    /**
     * Save/bookmark a college to tracking
     */
    saveCollege: async (
        token: string,
        data: CollegeApplicationCreate
    ): Promise<CollegeApplication> => {
        const response = await axios.post(
            `${API_BASE_URL}/api/v1/college-tracking/applications`,
            data,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    },

    /**
     * Update a college application
     */
    updateApplication: async (
        token: string,
        applicationId: number,
        data: CollegeApplicationUpdate
    ): Promise<CollegeApplication> => {
        const response = await axios.put(
            `${API_BASE_URL}/api/v1/college-tracking/applications/${applicationId}`,
            data,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    },

    /**
     * Delete a college application
     */
    deleteApplication: async (token: string, applicationId: number): Promise<void> => {
        await axios.delete(
            `${API_BASE_URL}/api/v1/college-tracking/applications/${applicationId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },

    /**
     * Quick action: Mark as submitted
     */
    markSubmitted: async (token: string, applicationId: number): Promise<CollegeApplication> => {
        const response = await axios.post(
            `${API_BASE_URL}/api/v1/college-tracking/applications/${applicationId}/mark-submitted`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    },

    /**
     * Quick action: Mark as accepted
     */
    markAccepted: async (token: string, applicationId: number): Promise<CollegeApplication> => {
        const response = await axios.post(
            `${API_BASE_URL}/api/v1/college-tracking/applications/${applicationId}/mark-accepted`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    },

    /**
     * Quick action: Mark as rejected
     */
    markRejected: async (token: string, applicationId: number): Promise<CollegeApplication> => {
        const response = await axios.post(
            `${API_BASE_URL}/api/v1/college-tracking/applications/${applicationId}/mark-rejected`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    },

    /**
     * Quick action: Mark as waitlisted
     */
    markWaitlisted: async (token: string, applicationId: number): Promise<CollegeApplication> => {
        const response = await axios.post(
            `${API_BASE_URL}/api/v1/college-tracking/applications/${applicationId}/mark-waitlisted`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    },
};