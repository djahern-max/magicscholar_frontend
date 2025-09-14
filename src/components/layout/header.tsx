'use client';

import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

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

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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

  // Don't render user-specific content until mounted
  if (!mounted) {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MagicScholar
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-900 hover:text-blue-600 font-medium transition-colors">
                Discover
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Scholarships
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="w-20 h-8"></div> {/* Placeholder to prevent layout shift */}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MagicScholar
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-900 hover:text-blue-600 font-medium transition-colors">
              Discover
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Scholarships
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium">{user.first_name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={onLoginClick}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={onRegisterClick}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}