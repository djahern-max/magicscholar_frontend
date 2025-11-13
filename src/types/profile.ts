// src/types/profile.ts

export interface ExtracurricularActivity {
    name: string;
    role?: string;
    description?: string;
    years_active?: string;
}

export interface WorkExperience {
    title: string;
    organization: string;
    dates?: string;
    description?: string;
}

export interface UserSettings {
    confetti_enabled: boolean;
}

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

    // Career & Activities
    career_goals?: string;
    volunteer_hours?: number;
    extracurriculars?: ExtracurricularActivity[];
    work_experience?: WorkExperience[];
    honors_awards?: string[];
    skills?: string[];

    // Matching
    location_preference?: string;

    // Files
    profile_image_url?: string;
    resume_url?: string;

    // Timestamps
    created_at: string;
    updated_at?: string;

    // Settings
    settings: UserSettings;
}

export interface ProfileUpdateData {
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
    career_goals?: string;
    volunteer_hours?: number;
    location_preference?: string;

    // NEW: Allow updating extracurriculars
    extracurriculars?: ExtracurricularActivity[];
    work_experience?: WorkExperience[];
    honors_awards?: string[];
    skills?: string[];
}

export interface ParsedResumeData {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    high_school_name?: string;
    graduation_year?: number;
    gpa?: number;
    gpa_scale?: string;
    sat_score?: number;
    act_score?: number;
    intended_major?: string;
    career_goals?: string;
    extracurriculars?: ExtracurricularActivity[];
    work_experience?: WorkExperience[];
    honors_awards?: string[];
    skills?: string[];
    volunteer_hours?: number;
}

export interface ResumeUploadResponse {
    status: string;
    message: string;
    profile: UserProfile;
    resume_url: string;
    parsed_data: ParsedResumeData;
    metadata: {
        confidence_score: number;
        fields_extracted: number;
        extraction_notes: string[];
    };
    needs_gpa: boolean;
    scholarship_matches: Array<{
        id: number;
        title: string;
        organization: string;
        amount_min: number;
        amount_max: number;
        deadline?: string;
        min_gpa?: number;
    }>;
}