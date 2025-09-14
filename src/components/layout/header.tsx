'use client';

import React, { useState, useEffect } from 'react';
import { User, Search, Bell, Settings, LogOut, ChevronDown, Menu, X } from 'lucide-react';

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then((data: UserData | null) => setUser(data))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.reload();
  };

  // Get user initials for avatar
  const getUserInitials = (user: UserData) => {
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="text-blue-600">magic</span>scholar
              </h1>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${isSearchFocused ? 'text-blue-500' : 'text-gray-400'
                }`}>
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search for anything"
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg text-sm placeholder-gray-500 transition-all duration-200 ${isSearchFocused
                    ? 'border-blue-500 ring-2 ring-blue-100 bg-white'
                    : 'border-gray-300 bg-gray-50 hover:bg-white hover:border-gray-400'
                  }`}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="h-5 w-5" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {getUserInitials(user)}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <a href="/dashboard/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </a>
                      <a href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings className="h-4 w-4 mr-2" />
                        Dashboard
                      </a>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={onLoginClick}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={onRegisterClick}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
              className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for anything"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            {user ? (
              <>
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {getUserInitials(user)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <a href="/dashboard/profile" className="flex items-center space-x-3 text-gray-700 hover:text-gray-900">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </a>
                <a href="/dashboard" className="flex items-center space-x-3 text-gray-700 hover:text-gray-900">
                  <Settings className="h-5 w-5" />
                  <span>Dashboard</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 text-red-600 hover:text-red-700 w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <a href="/" className="block text-gray-700 hover:text-blue-600 font-medium">
                  Schools
                </a>
                <a href="/scholarships" className="block text-gray-700 hover:text-blue-600 font-medium">
                  Scholarships
                </a>
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-600 hover:text-gray-900 font-medium"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    onRegisterClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside handler for profile menu */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
    </header>
  );
}