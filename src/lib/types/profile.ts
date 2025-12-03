// src/lib/types/profile.ts
// Profile system types - validated by backend tests (41/41 passing)

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

export interface Profile {
  id: number;
  user_id: number;
  
  // Location fields
  state?: string;
  city?: string;
  zip_code?: string;
  
  // Academic fields
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
  
  // Settings
  settings: UserSettings;
  
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
  career_goals?: string;
  volunteer_hours?: number;
  extracurriculars?: ExtracurricularActivity[];
  work_experience?: WorkExperience[];
  honors_awards?: string[];
  skills?: string[];
  location_preference?: string;
}

export interface Institution {
  id: number;
  ipeds_id: number;
  name: string;
  state: string;
  city: string;
  control_type: string;
  primary_image_url?: string;
  website?: string;
  student_faculty_ratio?: number;
  tuition_in_state?: number;
  tuition_out_of_state?: number;
  tuition_private?: number;
}

export interface MatchingInstitutionsResponse {
  institutions: Institution[];
  total: number;
  location_preference?: string;
}

export interface ResumeParseMetadata {
  confidence_score: number;
  fields_extracted: number;
  extraction_notes: string[];
}

export interface ScholarshipMatch {
  id: number;
  title: string;
  organization: string;
  amount_min: number;
  amount_max: number;
  deadline: string;
  min_gpa?: number;
}

export interface ResumeUploadResponse {
  status: string;
  message: string;
  profile: Profile;
  resume_url: string;
  parsed_data: Partial<Profile>;
  metadata: ResumeParseMetadata;
  needs_gpa: boolean;
  scholarship_matches: ScholarshipMatch[];
}

export interface SettingsUpdateResponse {
  message: string;
  settings: UserSettings;
}

export interface HeadshotUploadResponse {
  status: string;
  profile_image_url: string;
  message: string;
}
