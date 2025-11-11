// src/lib/collegeTrackingService.ts
/**
 * Service helper for College Application Tracking API calls
 * Matches pattern from scholarshipTrackingService.ts
 */

import { CollegeDashboard, CollegeApplication, CollegeApplicationCreate, CollegeApplicationUpdate } from '@/types/college-tracking';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Not authenticated');
    }
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
};

/**
 * Get user's college application dashboard
 */
export async function getCollegeDashboard(): Promise<CollegeDashboard> {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/college-tracking/dashboard`,
        {
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to load dashboard');
    }

    return response.json();
}

/**
 * Save a college to tracking
 */
export async function saveCollege(data: CollegeApplicationCreate): Promise<CollegeApplication> {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/college-tracking/applications`,
        {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to save college');
    }

    return response.json();
}

/**
 * Update a college application
 */
export async function updateCollegeApplication(
    applicationId: number,
    data: CollegeApplicationUpdate
): Promise<CollegeApplication> {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/college-tracking/applications/${applicationId}`,
        {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to update application');
    }

    return response.json();
}

/**
 * Delete a college application
 */
export async function deleteCollegeApplication(applicationId: number): Promise<void> {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/college-tracking/applications/${applicationId}`,
        {
            method: 'DELETE',
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to delete application');
    }
}

/**
 * Mark application as submitted
 */
export async function markAsSubmitted(applicationId: number): Promise<CollegeApplication> {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/college-tracking/applications/${applicationId}/mark-submitted`,
        {
            method: 'POST',
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to mark as submitted');
    }

    return response.json();
}

/**
 * Mark application as accepted
 */
export async function markAsAccepted(applicationId: number): Promise<CollegeApplication> {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/college-tracking/applications/${applicationId}/mark-accepted`,
        {
            method: 'POST',
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to mark as accepted');
    }

    return response.json();
}

/**
 * Mark application as rejected
 */
export async function markAsRejected(applicationId: number): Promise<CollegeApplication> {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/college-tracking/applications/${applicationId}/mark-rejected`,
        {
            method: 'POST',
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to mark as rejected');
    }

    return response.json();
}

/**
 * Mark application as waitlisted
 */
export async function markAsWaitlisted(applicationId: number): Promise<CollegeApplication> {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/college-tracking/applications/${applicationId}/mark-waitlisted`,
        {
            method: 'POST',
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to mark as waitlisted');
    }

    return response.json();
}