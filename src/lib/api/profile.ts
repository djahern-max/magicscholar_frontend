// src/lib/api/profile.ts
// Profile API client - matches validated backend endpoints

import { 
  Profile, 
  ProfileUpdate, 
  MatchingInstitutionsResponse, 
  ResumeUploadResponse, 
  UserSettings,
  SettingsUpdateResponse,
  HeadshotUploadResponse
} from '@/lib/types/profile';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    // Token expired or invalid - redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Authentication expired');
  }

  return response;
}

/**
 * GET /api/v1/profiles/me
 * Gets current user's profile (auto-creates if missing)
 */
export async function getProfile(): Promise<Profile> {
  const response = await fetchWithAuth(`${API_URL}/api/v1/profiles/me`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
}

/**
 * PUT /api/v1/profiles/me
 * Updates current user's profile (partial updates supported)
 */
export async function updateProfile(data: ProfileUpdate): Promise<Profile> {
  const response = await fetchWithAuth(`${API_URL}/api/v1/profiles/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update profile');
  }
  
  return response.json();
}

/**
 * GET /api/v1/profiles/me/matching-institutions
 * Gets colleges matching user's location preference
 */
export async function getMatchingInstitutions(
  limit = 50
): Promise<MatchingInstitutionsResponse> {
  const response = await fetchWithAuth(
    `${API_URL}/api/v1/profiles/me/matching-institutions?limit=${limit}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch matching institutions');
  }
  
  return response.json();
}

/**
 * GET /api/v1/profiles/me/settings
 * Gets user settings
 */
export async function getSettings(): Promise<UserSettings> {
  const response = await fetchWithAuth(`${API_URL}/api/v1/profiles/me/settings`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  
  return response.json();
}

/**
 * PATCH /api/v1/profiles/me/settings
 * Updates user settings (partial updates supported)
 */
export async function updateSettings(
  settings: Partial<UserSettings>
): Promise<SettingsUpdateResponse> {
  const response = await fetchWithAuth(`${API_URL}/api/v1/profiles/me/settings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update settings');
  }
  
  return response.json();
}

/**
 * POST /api/v1/profiles/me/upload-headshot
 * Uploads profile image
 * Constraints: JPG/PNG/WEBP, 5MB max
 */
export async function uploadHeadshot(file: File): Promise<HeadshotUploadResponse> {
  // Validate file type client-side
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
  }

  // Validate file size (5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 5MB.');
  }

  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetchWithAuth(
    `${API_URL}/api/v1/profiles/me/upload-headshot`,
    {
      method: 'POST',
      body: formData,
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to upload headshot');
  }
  
  return response.json();
}

/**
 * POST /api/v1/profiles/me/upload-resume-and-update
 * Uploads resume, parses with AI, and auto-updates profile
 * Constraints: PDF/DOCX, 10MB max
 * Cost: ~$0.02 per resume, ~94% accuracy
 */
export async function uploadResumeAndUpdate(file: File): Promise<ResumeUploadResponse> {
  // Validate file type client-side
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a PDF or DOCX file.');
  }

  // Validate file size (10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 10MB.');
  }

  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetchWithAuth(
    `${API_URL}/api/v1/profiles/me/upload-resume-and-update`,
    {
      method: 'POST',
      body: formData,
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to upload resume');
  }
  
  return response.json();
}
