// src/components/layout/header.tsx - Improved layout
'use client';

import React, { useState, useEffect } from 'react';
import { User, Menu, X } from 'lucide-react';
import AuthModal from '../auth/AuthModal';
import { UserData } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const openLoginModal = () => {
    setAuthModal({ isOpen: true, mode: 'login' });
    setIsMobileMenuOpen(false);
  };

  const openRegisterModal = () => {
    setAuthModal({ isOpen: true, mode: 'register' });
    setIsMobileMenuOpen(false);
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleAuthSuccess = () => {
    // The AuthModal handles token storage and page reload
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
    return currentPath === '/scholarships' ? '/' : '/scholarships';
  };

  const getNavigationText = () => {
    const currentPath = getCurrentPath();
    return currentPath === '/scholarships' ? 'Home' : 'Find Scholarships';
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                magic<span className="text-gray-900">Scholar</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Navigation Links */}
              <nav className="flex items-center space-x-6">
                <a
                  href={getNavigationUrl()}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  {getNavigationText()}
                </a>
              </nav>

              {/* Auth Section */}
              {user ? (
                <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {user.first_name || user.username}
                      </div>
                      <div className="text-gray-500 text-xs">{user.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => window.location.href = '/dashboard'}
                      className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Dashboard
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
                <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
                  <button
                    onClick={openLoginModal}
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Log in
                  </button>
                  <button
                    onClick={openRegisterModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
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
                className="text-gray-700 hover:text-blue-600 transition-colors p-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 bg-white">
              <div className="space-y-1">
                <a
                  href={getNavigationUrl()}
                  className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {getNavigationText()}
                </a>

                {user ? (
                  <div className="space-y-1 pt-4 border-t border-gray-100 mt-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 px-3 py-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <User size={18} className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name || user.username}
                        </div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>

                    {/* User Actions */}
                    <button
                      onClick={() => {
                        window.location.href = '/dashboard';
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-3 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-4 border-t border-gray-100 mt-4">
                    <button
                      onClick={openLoginModal}
                      className="w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Log in
                    </button>
                    <button
                      onClick={openRegisterModal}
                      className="w-full bg-blue-600 text-white px-3 py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors shadow-sm mx-3"
                    >
                      Sign up
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
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