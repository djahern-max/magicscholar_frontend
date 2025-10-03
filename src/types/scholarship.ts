// src/types/scholarship.ts - NEW FILE
// Matches simplified backend scholarship model

export interface Scholarship {
    // Core
    id: number;
    title: string;
    organization: string;

    // Classification
    scholarship_type: string;
    status: 'active' | 'inactive' | 'expired' | 'draft' | 'pending_review';
    difficulty_level: 'easy' | 'moderate' | 'hard' | 'very_hard';

    // Financial
    amount_exact: number;
    is_renewable: boolean;

    // Eligibility flags
    need_based_required: boolean;
    international_students_eligible: boolean;
    leadership_required: boolean;
    work_experience_required: boolean;
    military_affiliation_required: boolean;

    // Application requirements
    essay_required: boolean;
    transcript_required: boolean;
    recommendation_letters_required: number;
    portfolio_required: boolean;
    interview_required: boolean;

    // Essay requirements
    personal_statement_required: boolean;
    leadership_essay_required: boolean;
    community_service_essay_required: boolean;

    // Deadline
    is_rolling_deadline: boolean;

    // Display
    primary_image_url?: string;

    // Admin
    verified: boolean;
    featured: boolean;
    views_count: number;
    applications_count: number;

    // Timestamps
    created_at: string;
    updated_at?: string;
}

export interface ScholarshipFilters {
    page?: number;
    limit?: number;
    scholarship_type?: string;
    active_only?: boolean;
    verified_only?: boolean;
    featured_only?: boolean;
    search_query?: string;
    min_amount?: number;
    max_amount?: number;
    requires_essay?: boolean;
    requires_interview?: boolean;
    renewable_only?: boolean;
    sort_by?: 'created_at' | 'amount_exact' | 'title' | 'views_count';
    sort_order?: 'asc' | 'desc';
}


// src/types/institution.ts - NEW FILE
// Matches simplified backend institution model

export interface Institution {
    id: number;
    ipeds_id: number;
    name: string;
    city: string;
    state: string;
    control_type: 'public' | 'private_nonprofit' | 'private_for_profit';
    primary_image_url?: string;
    created_at: string;
    updated_at: string;
}

export interface InstitutionFilters {
    page?: number;
    limit?: number;
    state?: string;
    control_type?: string;
    search_query?: string;
    sort_by?: 'name' | 'city' | 'state' | 'created_at';
    sort_order?: 'asc' | 'desc';
}


// src/types/profile.ts - NEW FILE
// Matches simplified backend profile model

export interface UserProfile {
    id: number;
    user_id: number;

    // Location
    state?: string;
    city?: string;
    zip_code?: string;

    // Academic
    high_school_name?: string;
    graduation_year?: number;
    gpa?: number;
    gpa_scale?: string;
    sat_score?: number;
    act_score?: number;
    intended_major?: string;

    // Timestamps
    created_at: string;
    updated_at?: string;
}

export interface ProfileUpdate {
    state?: string;
    city?: string;
    zip_code?: string;
    high_school_name?: string;
    graduation_year?: number;
    gpa?: number;
    gpa_scale?: string;
    sat_score?: number;
    act_score?: number;
    intended_major?: string;
}


// src/types/user.ts - UPDATED
// Remove references to dropped fields

export interface UserData {
    id: number;
    email: string;
    username: string;
    first_name?: string;
    last_name?: string;
    is_active: boolean;
    created_at?: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: UserData;
}