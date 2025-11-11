// src/lib/scholarshipTrackingService.ts
// Helper functions for scholarship tracking API calls

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface SaveScholarshipParams {
    scholarship_id: number;
    status?: "interested" | "planning" | "in_progress" | "submitted" | "accepted" | "rejected" | "not_pursuing";
    notes?: string | null;
}

interface UpdateScholarshipParams {
    status?: "interested" | "planning" | "in_progress" | "submitted" | "accepted" | "rejected" | "not_pursuing";
    notes?: string | null;
    essay_draft?: string | null;
    documents_needed?: string | null;
    award_amount?: number | null;
}

/**
 * Get authentication token from localStorage
 */
function getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token"); // CHANGED from "access_token" to "token"
}

/**
 * Save/bookmark a scholarship to user's dashboard
 */
export async function saveScholarship(params: SaveScholarshipParams) {
    const token = getAuthToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(
        `${API_URL}/api/v1/scholarship-tracking/applications`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                scholarship_id: params.scholarship_id,
                status: params.status || "interested",
                notes: params.notes || null,
            }),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to save scholarship");
    }

    return response.json();
}

/**
 * Get user's scholarship dashboard
 */
export async function getScholarshipDashboard() {
    const token = getAuthToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(
        `${API_URL}/api/v1/scholarship-tracking/dashboard`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch dashboard");
    }

    return response.json();
}

/**
 * Get all user's scholarship applications with optional filtering
 */
export async function getScholarshipApplications(
    status?: string,
    sortBy: string = "deadline",
    sortOrder: string = "asc"
) {
    const token = getAuthToken();
    if (!token) throw new Error("Not authenticated");

    const params = new URLSearchParams();
    if (status) params.append("status", status);
    params.append("sort_by", sortBy);
    params.append("sort_order", sortOrder);

    const response = await fetch(
        `${API_URL}/api/v1/scholarship-tracking/applications?${params}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch applications");
    }

    return response.json();
}

/**
 * Update a scholarship application
 */
export async function updateScholarshipApplication(
    applicationId: number,
    updates: UpdateScholarshipParams
) {
    const token = getAuthToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(
        `${API_URL}/api/v1/scholarship-tracking/applications/${applicationId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updates),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to update application");
    }

    return response.json();
}

/**
 * Delete a scholarship application
 */
export async function deleteScholarshipApplication(applicationId: number) {
    const token = getAuthToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(
        `${API_URL}/api/v1/scholarship-tracking/applications/${applicationId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete application");
    }

    return true;
}

/**
 * Quick action: Mark scholarship as submitted
 */
export async function markScholarshipAsSubmitted(applicationId: number) {
    const token = getAuthToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(
        `${API_URL}/api/v1/scholarship-tracking/applications/${applicationId}/mark-submitted`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to mark as submitted");
    }

    return response.json();
}

/**
 * Quick action: Mark scholarship as accepted
 */
export async function markScholarshipAsAccepted(
    applicationId: number,
    awardAmount?: number
) {
    const token = getAuthToken();
    if (!token) throw new Error("Not authenticated");

    const url = new URL(
        `${API_URL}/api/v1/scholarship-tracking/applications/${applicationId}/mark-accepted`
    );
    if (awardAmount) {
        url.searchParams.append("award_amount", awardAmount.toString());
    }

    const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to mark as accepted");
    }

    return response.json();
}

/**
 * Quick action: Mark scholarship as rejected
 */
export async function markScholarshipAsRejected(applicationId: number) {
    const token = getAuthToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(
        `${API_URL}/api/v1/scholarship-tracking/applications/${applicationId}/mark-rejected`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to mark as rejected");
    }

    return response.json();
}