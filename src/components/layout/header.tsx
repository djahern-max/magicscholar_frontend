// src/components/layout/header.tsx - Updated with profile-aware navigation
'use client';

import React, { useState, useEffect } from 'react';
import { User, ChevronDown, ChevronUp } from 'lucide-react';
import AuthModal from '../auth/AuthModal';
import { UserData } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface UserProfile {
  id: number;
  user_id: number;
  profile_completed: boolean;
  completion_percentage: number;
  // Add other profile fields as needed
}

export default function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'login' | 'register';
  }>({
    isOpen: false,
    mode: 'login'
  });

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for user authentication
  useEffect(() => {
    if (!mounted) return;

    const token = typeof window !== 'undefined' ?
      localStorage.getItem('token') : null;

    if (token) {
      fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then((data: UserData | null) => {
          if (data) {
            setUser(data);
            // Once we have user data, check for their profile
            checkUserProfile(token);
          }
        })
        .catch(() => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
        });
    }
  }, [mounted]);

  // Check if user has a profile
  const checkUserProfile = async (token: string) => {
    setProfileLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/profiles/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const profileData = await response.json();
        setUserProfile(profileData);
      } else {
        // No profile found
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
      setUserProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    setUserProfile(null);
    window.location.reload();
  };

  const openLoginModal = () => {
    setAuthModal({ isOpen: true, mode: 'login' });
    setIsDropdownOpen(false);
  };

  const openRegisterModal = () => {
    setAuthModal({ isOpen: true, mode: 'register' });
    setIsDropdownOpen(false);
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleAuthSuccess = () => {
    // The AuthModal handles token storage and page reload
    window.location.reload();
  };

  // Handle Profile/Dashboard navigation
  const handleProfileDashboardClick = () => {
    if (!user) {
      openLoginModal();
      return;
    }

    if (profileLoading) {
      return; // Wait for profile check to complete
    }

    if (!userProfile || !userProfile.profile_completed) {
      // No profile or incomplete profile - redirect to setup
      window.location.href = '/profile/setup';
    } else {
      // Profile exists - redirect to dashboard
      window.location.href = '/dashboard';
    }
    setIsDropdownOpen(false);
  };

  const getProfileDashboardText = () => {
    if (!user) return 'Profile';
    if (profileLoading) return 'Loading...';
    if (!userProfile || !userProfile.profile_completed) return 'Complete Profile';
    return 'Dashboard';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('navigation-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo with Dropdown */}
            <div className="flex items-center relative">
              <a href="/" className="flex items-center text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                <span className="mr-1">🪄</span>
                magic<span className="text-gray-900">Scholar</span>
              </a>

              {/* Navigation Dropdown */}
              <div className="relative ml-2" id="navigation-dropdown">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-gray-500 hover:text-gray-700 transition-colors p-1"
                  aria-label="Navigation menu"
                >
                  {isDropdownOpen ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[160px] z-50">
                    <a
                      href="/"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Schools
                    </a>
                    <a
                      href="/scholarships"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Scholarships
                    </a>
                    <button
                      onClick={handleProfileDashboardClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      disabled={profileLoading}
                    >
                      {getProfileDashboardText()}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {user.first_name || user.username}
                    </div>
                    {userProfile && (
                      <div className="text-xs text-gray-500">
                        Profile: {userProfile.completion_percentage}% complete
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleProfileDashboardClick}
                    className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    disabled={profileLoading}
                  >
                    {getProfileDashboardText()}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-700 hover:text-red-600 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <button
                  onClick={openLoginModal}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  LOG IN
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        defaultMode={authModal.mode}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}