// src/components/layout/header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import AuthModal from '../auth/AuthModal';
import { UserData } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);
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
  };

  if (!mounted) return null;

  return (
    <>
      <header className="bg-white border-b-2 border-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">

            {/* Logo + Nav */}
            <div className="flex items-center gap-8">
              <a
                href="/"
                className="text-xl font-bold hover:opacity-80 transition-opacity"
              >
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
              </a>

              <nav className="hidden md:flex items-center gap-2">
                <a
                  href="/"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors rounded"
                >
                  Schools
                </a>
                <a
                  href="/scholarships"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors rounded"
                >
                  Scholarships
                </a>
                {user && (
                  <a
                    href="/profile"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors rounded"
                  >
                    Profile
                  </a>
                )}
              </nav>
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span className="hidden sm:inline text-sm text-gray-700">
                    <span className="font-medium">{user.username}</span>
                  </span>
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
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-full"
                >
                  Log in
                </button>
              )}
            </div>
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