// src/components/layout/header.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import AuthModal from '../auth/AuthModal';
import { UserData } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface UserProfile {
  profile_image_url?: string;
  first_name?: string;
  last_name?: string;
}

export default function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'login' | 'register';
  }>({
    isOpen: false,
    mode: 'login',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user data
      fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: UserData | null) => {
          if (data) {
            setUser(data);
            // Fetch profile data to get headshot
            fetchProfile(token);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, [mounted]);

  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/profiles/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
    window.location.reload();
  };

  const openLoginModal = () => {
    setAuthModal({ isOpen: true, mode: 'login' });
  };

  if (!mounted) return null;

  return (
    <>
      <header className="bg-white border-b-2 border-gray-300 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-bold hover:opacity-80 transition-opacity flex items-center gap-1 flex-shrink-0"
            >
              <span className="text-2xl">✨</span>
              <span className="text-blue-600">m</span>
              <span className="text-green-600">a</span>
              <span className="text-cyan-600">g</span>
              <span className="text-purple-600">i</span>
              <span className="text-orange-500">c</span>
              <span className="text-red-600">S</span>
              <span className="text-blue-600">c</span>
              <span className="text-green-600">h</span>
              <span className="text-cyan-600">o</span>
              <span className="text-purple-600">l</span>
              <span className="text-orange-500">a</span>
              <span className="text-red-600">r</span>
              <span className="text-2xl">✨</span>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex items-center gap-0 absolute left-1/2 -translate-x-1/2">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors rounded flex items-center gap-1"
              >
                Schools
                <ChevronDown size={16} className="text-gray-500" />
              </Link>

              <Link
                href="/scholarships"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors rounded flex items-center gap-1"
              >
                Scholarships
                <ChevronDown size={16} className="text-gray-500" />
              </Link>

              {user && (
                <Link
                  href="/profile"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors rounded flex items-center gap-1"
                >
                  Profile
                  <ChevronDown size={16} className="text-gray-500" />
                </Link>
              )}
            </nav>

            {/* Right Side - Auth + Profile Photo + Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Auth - Desktop */}
              <div className="hidden md:flex items-center gap-3">
                {user ? (
                  <>
                    {/* User Info with Headshot */}
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {/* Profile Photo */}
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                        {profile?.profile_image_url ? (
                          <img
                            src={profile.profile_image_url}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      {/* Username */}
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">{user.username}</span>
                      </span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors rounded"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={openLoginModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    LOG IN
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="md:hidden p-2 text-gray-700 hover:text-gray-900"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-4 space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded font-medium"
              >
                Schools
              </Link>

              <Link
                href="/scholarships"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded font-medium"
              >
                Scholarships
              </Link>

              {user && (
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded font-medium"
                >
                  Profile
                </Link>
              )}

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    {/* User Profile Info with Headshot - Mobile */}
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 mb-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                        {profile?.profile_image_url ? (
                          <img
                            src={profile.profile_image_url}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {profile?.first_name && profile?.last_name
                            ? `${profile.first_name} ${profile.last_name}`
                            : user.username}
                        </div>
                        <div className="text-sm text-gray-600">View profile</div>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      openLoginModal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg font-medium"
                  >
                    Log in
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        defaultMode={authModal.mode}
        onSuccess={() => window.location.reload()}
      />
    </>
  );
}