// Create this file: src/types/user.ts
export interface UserProfile {
    profile_completed: boolean;
    completion_percentage: number;
    profile_tier: 'BASIC' | 'ENHANCED' | 'COMPLETE';
}

export interface UserData {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    created_at?: string;
    profile?: UserProfile;
}

// For authentication responses
export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: UserData;
}