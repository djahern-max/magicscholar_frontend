// MagicScholar API TypeScript Interfaces
// Updated to match college-backend unified database architecture
// Last updated: December 2024

// ==========================================
// CORE INSTITUTION TYPES
// ==========================================

export interface Institution {
    // Core identification
    id: number;
    ipeds_id: number;
    name: string;
    city: string;
    state: string;

    // Institution type
    control_type: 'PUBLIC' | 'PRIVATE_NONPROFIT' | 'PRIVATE_FOR_PROFIT';
    level: string | null;
    control: string | null;

    // Contact & media
    website: string | null;
    primary_image_url: string | null;
    is_featured: boolean;

    // Student body characteristics
    student_faculty_ratio: number | null;
    size_category: string | null;
    locale: string | null;

    // Tuition & Costs
    tuition_in_state: number | null;
    tuition_out_of_state: number | null;
    tuition_private: number | null;
    tuition_in_district: number | null;
    room_cost: number | null;
    board_cost: number | null;
    room_and_board: number | null;
    application_fee_undergrad: number | null;
    application_fee_grad: number | null;

    // Admissions Statistics
    acceptance_rate: number | null;
    sat_reading_25th: number | null;
    sat_reading_75th: number | null;
    sat_math_25th: number | null;
    sat_math_75th: number | null;
    act_composite_25th: number | null;
    act_composite_75th: number | null;

    // Data Quality & Verification
    data_completeness_score: number | null;
    completeness_score: number | null;
    admin_verified: boolean;
    cost_data_verified: boolean;
    cost_data_verified_at: string | null;
    admissions_data_verified: boolean;
    admissions_data_verified_at: string | null;
    last_admin_update: string | null;
    data_quality_notes: string | null;  // Admin-only field
    data_last_updated: string | null;
    data_source: string | null;
    ipeds_year: number | null;

    // Timestamps
    created_at: string;
    updated_at: string;
}

// ==========================================
// PAGINATION WRAPPERS
// ==========================================

export interface InstitutionListResponse {
    institutions: Institution[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

// ==========================================
// ENTITY IMAGES (Shared between institutions & scholarships)
// ==========================================

export interface EntityImage {
    id: number;
    entity_type: 'institution' | 'scholarship';
    entity_id: number;
    image_url: string;
    cdn_url: string;
    filename: string;
    caption: string | null;
    display_order: number;
    is_featured: boolean;
    image_type: string | null;
    created_at: string;
    updated_at: string | null;
}

// Backwards compatibility alias
export type InstitutionImage = EntityImage;

export interface ImageReorderRequest {
    image_ids: number[];
}

export interface SetFeaturedImageRequest {
    image_id: number;
}

// ==========================================
// SCHOLARSHIP TYPES
// ==========================================

export interface Scholarship {
    id: number;
    title: string;
    organization: string;
    scholarship_type: string;
    status: string;
    difficulty_level: string;
    amount_min: number;
    amount_max: number;
    is_renewable: boolean;
    number_of_awards: number | null;
    deadline: string | null;
    application_opens: string | null;
    for_academic_year: string | null;
    description: string | null;
    website_url: string | null;
    min_gpa: number | null;
    primary_image_url: string | null;
    verified: boolean;
    featured: boolean;
    views_count: number;
    applications_count: number;
    created_at: string;
    updated_at: string | null;
}

export interface ScholarshipListResponse {
    scholarships: Scholarship[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

// ==========================================
// USER & AUTHENTICATION
// ==========================================

export interface User {
    id: number;
    email: string;
    username: string;
    is_active: boolean;
    created_at: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
}

// ==========================================
// STUDENT PROFILE & TRACKING
// ==========================================

export interface UserProfile {
    id: number;
    user_id: number;
    first_name: string | null;
    last_name: string | null;
    high_school: string | null;
    graduation_year: number | null;
    gpa: number | null;
    sat_score: number | null;
    act_score: number | null;
    intended_major: string | null;
    location_state: string | null;
    location_city: string | null;
    created_at: string;
    updated_at: string | null;
}

export interface CollegeApplication {
    id: number;
    user_id: number;
    ipeds_id: number;
    institution_name: string;
    application_status: 'planning' | 'in_progress' | 'submitted' | 'accepted' | 'rejected' | 'deferred' | 'waitlisted';
    application_type: string | null;
    deadline: string | null;
    decision_date: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string | null;
}

export interface ScholarshipApplication {
    id: number;
    user_id: number;
    scholarship_id: number;
    scholarship_title: string;
    application_status: 'planning' | 'in_progress' | 'submitted' | 'awarded' | 'denied';
    deadline: string | null;
    amount_applied_for: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string | null;
}

// ==========================================
// ADMIN TYPES (Read-only for students)
// ==========================================

export interface AdminUser {
    id: number;
    email: string;
    entity_type: 'institution' | 'scholarship';
    entity_id: number;
    role: string;
    is_active: boolean;
    created_at: string;
    last_login: string | null;
}

// ==========================================
// SEARCH & FILTER PARAMS
// ==========================================

export interface InstitutionSearchParams {
    page?: number;
    limit?: number;
    state?: string;
    control_type?: 'PUBLIC' | 'PRIVATE_NONPROFIT' | 'PRIVATE_FOR_PROFIT';
    min_acceptance_rate?: number;
    max_acceptance_rate?: number;
    max_tuition?: number;
    min_completeness_score?: number;
    featured_only?: boolean;
    verified_only?: boolean;
}

export interface ScholarshipSearchParams {
    page?: number;
    limit?: number;
    scholarship_type?: string;
    min_amount?: number;
    max_amount?: number;
    min_gpa?: number;
    featured_only?: boolean;
    verified_only?: boolean;
}

// ==========================================
// ERROR RESPONSES
// ==========================================

export interface ErrorResponse {
    error: string;
    type?: string;
    detail?: string;
}

// ==========================================
// API RESPONSE HELPERS
// ==========================================

export interface ApiResponse<T> {
    data?: T;
    error?: ErrorResponse;
    success: boolean;
}

// ==========================================
// UTILITY TYPES
// ==========================================

export type ControlType = 'PUBLIC' | 'PRIVATE_NONPROFIT' | 'PRIVATE_FOR_PROFIT';
export type ApplicationStatus = 'planning' | 'in_progress' | 'submitted' | 'accepted' | 'rejected' | 'deferred' | 'waitlisted';
export type ScholarshipApplicationStatus = 'planning' | 'in_progress' | 'submitted' | 'awarded' | 'denied';
export type EntityType = 'institution' | 'scholarship';

// ==========================================
// HELPER FUNCTIONS FOR TYPE GUARDS
// ==========================================

export function isInstitution(entity: Institution | Scholarship): entity is Institution {
    return 'ipeds_id' in entity;
}

export function isScholarship(entity: Institution | Scholarship): entity is Scholarship {
    return 'amount_min' in entity;
}

export function isEntityImage(image: any): image is EntityImage {
    return 'entity_type' in image && 'entity_id' in image;
}

// ==========================================
// CONSTANTS
// ==========================================

export const CONTROL_TYPES: ControlType[] = ['PUBLIC', 'PRIVATE_NONPROFIT', 'PRIVATE_FOR_PROFIT'];

export const APPLICATION_STATUSES: ApplicationStatus[] = [
    'planning',
    'in_progress',
    'submitted',
    'accepted',
    'rejected',
    'deferred',
    'waitlisted'
];

export const SCHOLARSHIP_APPLICATION_STATUSES: ScholarshipApplicationStatus[] = [
    'planning',
    'in_progress',
    'submitted',
    'awarded',
    'denied'
];

export const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
] as const;

export type USState = typeof US_STATES[number];