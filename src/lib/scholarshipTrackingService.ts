// src/lib/scholarshipTrackingService.ts

import {
    ScholarshipDashboard,
    ScholarshipApplication,
    ScholarshipApplicationCreate,
    ScholarshipApplicationUpdate,
    ApplicationStatus,
} from '@/types/scholarship-tracking';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const scholarshipTrackingService = {
    /**
     * Get user's scholarship dashboard
     */
    async getDashboard(token: string): Promise<ScholarshipDashboard> {
        const response = await fetch(`${API_BASE_URL}/api/v1/scholarship-tracking/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to load dashboard');
        }

        return response.json();
    },

    /**
     * Save a scholarship to tracking
     */
    async saveScholarship(
        token: string,
        data: ScholarshipApplicationCreate
    ): Promise<ScholarshipApplication> {
        const response = await fetch(`${API_BASE_URL}/api/v1/scholarship-tracking/applications`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to save scholarship');
        }

        return response.json();
    },

    /**
     * Get all applications with filters
     */
    async getApplications(
        token: string,
        options?: {
            status?: ApplicationStatus;
            sort_by?: 'deadline' | 'amount' | 'saved_at' | 'status';
            sort_order?: 'asc' | 'desc';
        }
    ): Promise<ScholarshipApplication[]> {
        const params = new URLSearchParams();
        if (options?.status) params.append('status', options.status);
        if (options?.sort_by) params.append('sort_by', options.sort_by);
        if (options?.sort_order) params.append('sort_order', options.sort_order);

        const response = await fetch(
            `${API_BASE_URL}/api/v1/scholarship-tracking/applications?${params}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to load applications');
        }

        return response.json();
    },

    /**
     * Update an application
     */
    async updateApplication(
        token: string,
        applicationId: number,
        updates: ScholarshipApplicationUpdate
    ): Promise<ScholarshipApplication> {
        const response = await fetch(
            `${API_BASE_URL}/api/v1/scholarship-tracking/applications/${applicationId}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to update application');
        }

        return response.json();
    },

    /**
     * Delete an application
     */
    async deleteApplication(token: string, applicationId: number): Promise<void> {
        const response = await fetch(
            `${API_BASE_URL}/api/v1/scholarship-tracking/applications/${applicationId}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to delete application');
        }
    },

    /**
     * Mark application as submitted
     */
    async markAsSubmitted(
        token: string,
        applicationId: number
    ): Promise<ScholarshipApplication> {
        const response = await fetch(
            `${API_BASE_URL}/api/v1/scholarship-tracking/applications/${applicationId}/mark-submitted`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to mark as submitted');
        }

        return response.json();
    },

    /**
     * Mark application as accepted
     */
    async markAsAccepted(
        token: string,
        applicationId: number,
        awardAmount?: number
    ): Promise<ScholarshipApplication> {
        const params = new URLSearchParams();
        if (awardAmount) params.append('award_amount', awardAmount.toString());

        const response = await fetch(
            `${API_BASE_URL}/api/v1/scholarship-tracking/applications/${applicationId}/mark-accepted?${params}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to mark as accepted');
        }

        return response.json();
    },

    /**
     * Mark application as rejected
     */
    async markAsRejected(
        token: string,
        applicationId: number
    ): Promise<ScholarshipApplication> {
        const response = await fetch(
            `${API_BASE_URL}/api/v1/scholarship-tracking/applications/${applicationId}/mark-rejected`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to mark as rejected');
        }

        return response.json();
    },
};