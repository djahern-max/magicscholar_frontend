// src/types/scholarship-tracking.ts

export enum ApplicationStatus {
    INTERESTED = "interested",
    PLANNING = "planning",
    IN_PROGRESS = "in_progress",
    SUBMITTED = "submitted",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    NOT_PURSUING = "not_pursuing",
}

export interface ScholarshipBasicInfo {
    id: number;
    title: string;
    organization: string;
    amount_min: number | null;
    amount_max: number | null;
    deadline: string | null;
}

export interface ScholarshipApplication {
    id: number;
    user_id: number;
    scholarship_id: number;
    status: ApplicationStatus;
    saved_at: string;
    started_at: string | null;
    submitted_at: string | null;
    decision_date: string | null;
    notes: string | null;
    essay_draft: string | null;
    documents_needed: string | null;
    award_amount: number | null;
    scholarship: ScholarshipBasicInfo;
}

export interface DashboardSummary {
    total_applications: number;
    submitted: number;
    in_progress: number;
    accepted: number;
    total_potential_value: number;
    total_awarded_value: number;
}

export interface ScholarshipDashboard {
    summary: DashboardSummary;
    upcoming_deadlines: ScholarshipApplication[];
    overdue: ScholarshipApplication[];
    applications: ScholarshipApplication[];
}

export interface ScholarshipApplicationCreate {
    scholarship_id: number;
    status?: ApplicationStatus;
    notes?: string;
}

export interface ScholarshipApplicationUpdate {
    status?: ApplicationStatus;
    notes?: string;
    essay_draft?: string;
    documents_needed?: string;
    award_amount?: number;
}