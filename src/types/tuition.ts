// src/types/tuition.ts
export interface TuitionData {
    id: number;
    ipeds_id: number;
    academic_year: string;
    data_source: string;
    tuition_in_state?: number;
    tuition_out_state?: number;
    required_fees_in_state?: number;
    required_fees_out_state?: number;
    tuition_fees_in_state?: number;
    tuition_fees_out_state?: number;
    room_board_on_campus?: number;
    room_board_off_campus?: number;
    books_supplies?: number;
    personal_expenses?: number;
    transportation?: number;
    has_tuition_data: boolean;
    has_fees_data: boolean;
    has_living_data: boolean;
    data_completeness_score: number;
    validation_status: 'PENDING' | 'VALIDATED' | 'NEEDS_REVIEW' | 'FAILED';
    total_cost_in_state?: number;
    total_cost_out_state?: number;
    affordability_category: 'VERY_AFFORDABLE' | 'AFFORDABLE' | 'MODERATE' | 'EXPENSIVE' | 'VERY_EXPENSIVE' | 'UNKNOWN';
    has_comprehensive_data: boolean;
    cost_breakdown: CostBreakdown;
    created_at: string;
    updated_at: string;
}

export interface CostBreakdown {
    tuition_in_state?: number;
    tuition_out_state?: number;
    required_fees_in_state?: number;
    required_fees_out_state?: number;
    tuition_fees_in_state?: number;
    tuition_fees_out_state?: number;
    room_board_on_campus?: number;
    room_board_off_campus?: number;
    books_supplies?: number;
    personal_expenses?: number;
    transportation?: number;
}

export interface TuitionProjection {
    academic_year: string;
    projected_in_state_tuition: number;
    projected_out_state_tuition: number;
    projected_room_board: number;
    projected_books_supplies: number;
    projected_personal_expenses: number;
    projected_total_cost_in_state: number;
    projected_total_cost_out_state: number;
    inflation_rate_used: number;
    confidence_level: 'high' | 'medium' | 'low';
}

export interface TuitionProjectionsResponse {
    ipeds_id: number;
    projections: TuitionProjection[];
    projection_methodology: string;
    base_year: string;
    custom_inflation_rate?: number;
}

export interface AffordabilityRequest {
    family_income: number;
    residency_status: 'in_state' | 'out_of_state';
}

export interface AffordabilityAnalysis {
    total_institutions: number;
    affordable_institutions: number;
    affordability_rate: number;
    max_affordable_annual_cost: number;
    residency_status: string;
    family_income: number;
    price_distribution: {
        under_10k: { count: number; percentage: number };
        '10k_to_25k': { count: number; percentage: number };
        '25k_to_40k': { count: number; percentage: number };
        '40k_to_55k': { count: number; percentage: number };
        over_55k: { count: number; percentage: number };
    };
    recommendation: string;
}

export interface TuitionSearchFilters {
    min_tuition_in_state?: number;
    max_tuition_in_state?: number;
    min_tuition_out_state?: number;
    max_tuition_out_state?: number;
    min_total_cost?: number;
    max_total_cost?: number;
    affordability_category?: string;
    has_comprehensive_data?: boolean;
    state?: string;
}