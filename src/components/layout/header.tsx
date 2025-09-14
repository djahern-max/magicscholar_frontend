'use client';

import React, { useState, useEffect } from 'react';
import { User, Menu, X } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Define the user type based on your API response
interface UserData {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at?: string;
}

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export default function Header({ onLoginClick, onRegisterClick }: HeaderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const token = typeof window !== 'undefined' ?
      localStorage.getItem('token') : null;
    if (token) {
      fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then((data: UserData | null) => setUser(data))
        .catch(() => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
        });
    }
  }, [mounted]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    window.location.reload();
  };

  // Get current path to determine navigation
  const getCurrentPath = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  };

  const getNavigationUrl = () => {
    const currentPath = getCurrentPath();
    // If on scholarships page, go to home. Otherwise go to scholarships
    return currentPath === '/scholarships' ? '/' : '/scholarships';
  };

  const getNavigationText = () => {
    const currentPath = getCurrentPath();
    return currentPath === '/scholarships' ? 'Discover' : 'Scholarships';
  };

  // Don't render user-specific content until mounted
  if (!mounted) {
    return (
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
                <span className="text-blue-600">magic</span>
                <span className="text-gray-900">scholar</span>
              </a>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center">
              <a
                href={getNavigationUrl()}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {getNavigationText()}
              </a>
            </div>

            {/* Navigation & Auth - Skeleton */}
            <div className="flex items-center space-x-1">
              <div className="w-20 h-8 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity flex items-center gap-2">
              <span className="text-blue-600">magic</span>
              <span className="text-gray-900">Scholar</span>
              <span className="text-2xl">🪄</span>
            </a>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center">
            <a
              href={getNavigationUrl()}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {getNavigationText()}
            </a>
          </div>

          {/* Desktop Navigation & Auth */}
          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 rounded-full px-3 py-2 transition-colors cursor-pointer">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {user.first_name || user.username}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={onRegisterClick}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3">
            {/* Navigation Link */}
            <div className="px-3 py-2">
              <a
                href={getNavigationUrl()}
                className="block text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded transition-colors"
              >
                {getNavigationText()}
              </a>
            </div>

            {user ? (
              <div className="space-y-3 border-t border-gray-100 pt-3">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.first_name || user.username}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <button
                  onClick={onLoginClick}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={onRegisterClick}
                  className="w-full text-left px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}