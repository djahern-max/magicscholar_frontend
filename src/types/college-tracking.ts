// src/types/college-tracking.ts

export enum ApplicationStatus {
    RESEARCHING = "researching",
    PLANNING = "planning",
    IN_PROGRESS = "in_progress",
    SUBMITTED = "submitted",
    ACCEPTED = "accepted",
    WAITLISTED = "waitlisted",
    REJECTED = "rejected",
    DECLINED = "declined",
    ENROLLED = "enrolled",
}

export enum ApplicationType {
    EARLY_DECISION = "early_decision",
    EARLY_ACTION = "early_action",
    REGULAR_DECISION = "regular_decision",
    ROLLING = "rolling",
}

export interface InstitutionBasicInfo {
    id: number;
    ipeds_id: number;
    name: string;
    city: string;
    state: string;
    control_type: string;
    primary_image_url: string | null;
}

export interface CollegeApplication {
    id: number;
    user_id: number;
    institution_id: number;
    status: ApplicationStatus;
    application_type: ApplicationType | null;
    deadline: string | null;
    decision_date: string | null;
    actual_decision_date: string | null;
    saved_at: string;
    started_at: string | null;
    submitted_at: string | null;
    decided_at: string | null;
    notes: string | null;
    application_fee: number | null;
    fee_waiver_obtained: boolean;
    application_portal: string | null;
    portal_url: string | null;
    portal_username: string | null;
    institution: InstitutionBasicInfo;
}

export interface CollegeDashboardSummary {
    total_applications: number;
    submitted: number;
    in_progress: number;
    accepted: number;
    waitlisted: number;
    rejected: number;
    awaiting_decision: number;
}

export interface CollegeDashboard {
    summary: CollegeDashboardSummary;
    upcoming_deadlines: CollegeApplication[];
    overdue: CollegeApplication[];
    applications: CollegeApplication[];
}

export interface CollegeApplicationCreate {
    institution_id: number;
    status?: ApplicationStatus;
    application_type?: ApplicationType;
    deadline?: string;
    notes?: string;
}

export interface CollegeApplicationUpdate {
    status?: ApplicationStatus;
    application_type?: ApplicationType;
    deadline?: string;
    decision_date?: string;
    actual_decision_date?: string;
    notes?: string;
    application_fee?: number;
    fee_waiver_obtained?: boolean;
    application_portal?: string;
    portal_url?: string;
    portal_username?: string;
}