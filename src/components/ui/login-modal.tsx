'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        onClose();
        window.location.reload();
      } else {
        alert('Login failed');
      }
    } catch (error) {
      alert('Login error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Log in</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-gray-500 text-sm mb-3">Or continue with</div>
          <div className="space-y-2">
            <button
              onClick={() => window.location.href = `${API_BASE_URL}/api/v1/oauth/google/url`}
              className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue with Google
            </button>
            <button
              onClick={() => window.location.href = `${API_BASE_URL}/api/v1/oauth/linkedin/url`}
              className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue with LinkedIn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
