// src/types/scholarship.ts - UPDATED FOR SIMPLIFIED SCHEMA
export interface Scholarship {
    // Core
    id: number;
    title: string;
    organization: string;

    // Classification
    scholarship_type: string;
    status: 'active' | 'inactive' | 'expired' | 'draft' | 'pending_review';
    difficulty_level: 'easy' | 'moderate' | 'hard' | 'very_hard';

    // Financial - SIMPLIFIED
    amount_exact: number;
    is_renewable: boolean;

    // Images
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
    renewable_only?: boolean;
    sort_by?: 'created_at' | 'amount_exact' | 'title' | 'views_count';
    sort_order?: 'asc' | 'desc';
}