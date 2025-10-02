// src/components/layout/header.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import AuthModal from '../auth/AuthModal';
import { UserData } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Header() {
  const [user, setUser] = useState<UserData | null>(null);
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
      fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: UserData | null) => {
          if (data) setUser(data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, [mounted]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // force a refresh so app-wide auth state resets
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
              className="text-xl font-bold hover:opacity-80 transition-opacity flex items-center gap-1"
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

            {/* Desktop Navigation */}
            {/* <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors rounded"
              >
                Schools
              </Link>

              <Link
                href="/scholarships"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors rounded"
              >
                Scholarships
              </Link>

              {user && (
                <Link
                  href="/profile"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors rounded"
                >
                  Profile
                </Link>
              )}
            </nav> */}

            {/* Right Side - Auth + Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Auth - Desktop */}
              <div className="hidden md:flex items-center gap-3">
                {user ? (
                  <>
                    <span className="text-sm text-gray-700">
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
                    <div className="px-4 py-2 text-sm text-gray-600">
                      Logged in as{' '}
                      <span className="font-medium text-gray-900">
                        {user.username}
                      </span>
                    </div>
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
