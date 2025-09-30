// src/components/layout/header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { User, ChevronDown, ChevronUp } from 'lucide-react';
import AuthModal from '../auth/AuthModal';
import { UserData } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'login' as 'login' | 'register'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then((data: UserData | null) => {
          if (data) setUser(data);
        })
        .catch(() => localStorage.removeItem('token'));
    }
  }, [mounted]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.reload();
  };

  const openLoginModal = () => {
    setAuthModal({ isOpen: true, mode: 'login' });
    setIsDropdownOpen(false);
  };

  if (!mounted) return null;

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo + Nav */}
            <div className="flex items-center">
              <a href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
                <span className="mr-1">🪄</span>
                magic<span className="text-gray-900">Scholar</span>
              </a>

              {/* Dropdown */}
              <div className="relative ml-2">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg py-2 min-w-[160px] z-50">
                    <a href="/" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
                      Schools
                    </a>
                    <a href="/scholarships" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
                      Scholarships
                    </a>
                    {user && (
                      <a href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
                        Profile
                      </a>
                    )}
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
                  <div className="text-sm font-medium text-gray-900">
                    {user.first_name || user.username}
                  </div>
                </div>

                <a href="/profile" className="text-sm text-gray-700 hover:text-blue-600 font-medium">
                  Profile
                </a>
                <button onClick={handleLogout} className="text-sm text-gray-700 hover:text-red-600 font-medium">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={openLoginModal} className="text-sm font-medium text-gray-700 hover:text-blue-600">
                LOG IN
              </button>
            )}
          </div>
        </div>
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