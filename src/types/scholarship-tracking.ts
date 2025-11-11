// src/types/scholarship-tracking.ts

export type ApplicationStatus =
    | 'interested'
    | 'planning'
    | 'in_progress'
    | 'submitted'
    | 'accepted'
    | 'rejected'
    | 'not_pursuing';

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
    scholarship: ScholarshipBasicInfo;  // CHANGED: Removed Optional - always present in dashboard responses
}

export interface DashboardSummary {
    total_applications: number;
    interested: number;  // NEW
    planning: number;  // NEW
    in_progress: number;
    submitted: number;
    accepted: number;
    rejected: number;  // NEW
    not_pursuing: number;  // NEW
    total_potential_value: number;
    total_awarded_value: number;
}

export interface ScholarshipDashboard {
    summary: DashboardSummary;
    upcoming_deadlines: ScholarshipApplication[];
    overdue: ScholarshipApplication[];
    applications: ScholarshipApplication[];
}