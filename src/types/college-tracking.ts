// src/types/college-tracking.ts
/**
 * TypeScript types for College Application Tracking
 * Matches backend schemas from app/schemas/college_tracking.py
 */

// ===========================
// ENUMS
// ===========================

export type ApplicationStatus =
    | 'researching'
    | 'planning'
    | 'in_progress'
    | 'submitted'
    | 'accepted'
    | 'waitlisted'
    | 'rejected'
    | 'declined'
    | 'enrolled';

export type ApplicationType =
    | 'early_decision'
    | 'early_action'
    | 'regular_decision'
    | 'rolling';

// ===========================
// MODELS
// ===========================

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
    deadline: string | null; // ISO date string
    decision_date: string | null; // ISO date string
    actual_decision_date: string | null; // ISO date string
    saved_at: string; // ISO datetime string
    started_at: string | null; // ISO datetime string
    submitted_at: string | null; // ISO datetime string
    decided_at: string | null; // ISO datetime string
    notes: string | null;
    application_fee: number | null;
    fee_waiver_obtained: boolean;
    application_portal: string | null;
    portal_url: string | null;
    portal_username: string | null;
    institution: InstitutionBasicInfo | null;
}

export interface DashboardSummary {
    total_applications: number;
    researching: number;
    planning: number;
    in_progress: number;
    submitted: number;
    accepted: number;
    waitlisted: number;
    rejected: number;
    declined: number;
    enrolled: number;
}

export interface CollegeDashboard {
    summary: DashboardSummary;
    upcoming_deadlines: CollegeApplication[];
    overdue: CollegeApplication[];
    applications: CollegeApplication[];
}

// ===========================
// REQUEST TYPES
// ===========================

export interface CollegeApplicationCreate {
    institution_id: number;
    status?: ApplicationStatus;
    application_type?: ApplicationType;
    deadline?: string; // ISO date string
    notes?: string;
}

export interface CollegeApplicationUpdate {
    status?: ApplicationStatus;
    application_type?: ApplicationType;
    deadline?: string; // ISO date string
    decision_date?: string; // ISO date string
    actual_decision_date?: string; // ISO date string
    notes?: string;
    application_fee?: number;
    fee_waiver_obtained?: boolean;
    application_portal?: string;
    portal_url?: string;
    portal_username?: string;
}