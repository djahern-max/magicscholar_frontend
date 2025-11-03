// src/types/admissions.ts

export interface AdmissionsData {
    id: number;
    ipeds_id: number;
    academic_year: string;
    applications_total?: number | null;
    admissions_total?: number | null;
    enrolled_total?: number | null;
    acceptance_rate?: number | null;
    yield_rate?: number | null;
    sat_reading_25th?: number | null;
    sat_reading_50th?: number | null;
    sat_reading_75th?: number | null;
    sat_math_25th?: number | null;
    sat_math_50th?: number | null;
    sat_math_75th?: number | null;
    percent_submitting_sat?: number | null;
    created_at?: string;
}

export interface AdmissionsStats {
    has_data: boolean;
    academic_year?: string;
    acceptance_rate?: number | null;
    yield_rate?: number | null;
    total_applicants?: number | null;
    total_admitted?: number | null;
    total_enrolled?: number | null;
    sat_math_range?: {
        percentile_25: number;
        percentile_50: number;
        percentile_75: number;
    } | null;
    sat_reading_range?: {
        percentile_25: number;
        percentile_50: number;
        percentile_75: number;
    } | null;
    percent_submitting_sat?: number | null;
}