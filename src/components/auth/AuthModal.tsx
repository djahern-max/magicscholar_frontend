https://accounts.google.com/o/oauth2/v2/auth?client_id=341182696930-aaqj098tdtunueqdf6rto5nhb9ht60kf.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fwww.magicscholar.com%2Fapi%2Fv1%2Foauth%2Fgoogle%2Fcallback&scope=openid+email+profile&response_type=code&access_type=offline&prompt=consent&state=sZGJBsRxOeFOPcIkEwoFdp00mgz0zFdKmXlQpF_12QU","state":"sZGJBsRxOeFOPcIkEwoFdp00mgz0zFdKmXlQpF_12QU// components/auth/AuthModal.tsx - FIXED VERSION
'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultMode?: 'login' | 'register';
    onSuccess?: () => void;
}

interface LoginData {
    email: string;  // CHANGED: Use email instead of username
    password: string;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login', onSuccess }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Form data
    const [loginData, setLoginData] = useState<LoginData>({
        email: '',  // CHANGED: Use email
        password: ''
    });

    const [registerData, setRegisterData] = useState<RegisterData>({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });

    React.useEffect(() => {
        if (isOpen) {
            setMode(defaultMode);
            setError('');
            setLoginData({ email: '', password: '' });  // CHANGED: Reset email field
            setRegisterData({ username: '', email: '', password: '', first_name: '', last_name: '' });
        }
    }, [isOpen, defaultMode]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginData.email || !loginData.password) {  // CHANGED: Check email
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Create form data for OAuth2 login
            const formData = new FormData();
            formData.append('username', loginData.email);  // FIXED: Use email as username for OAuth2
            formData.append('password', loginData.password);

            console.log('Attempting login with email:', loginData.email); // DEBUG

            const response = await fetch(`${API_BASE_URL}/api/v1/auth/login-json`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data); // DEBUG
                localStorage.setItem('token', data.access_token);
                onSuccess?.();
                onClose();
                window.location.reload(); // Refresh to update header
            } else {
                const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
                console.error('Login failed:', errorData); // DEBUG
                setError(errorData.detail || 'Invalid email or password');
            }
        } catch (err) {
            console.error('Network error:', err); // DEBUG
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!registerData.username || !registerData.email || !registerData.password ||
            !registerData.first_name || !registerData.last_name) {
            setError('Please fill in all fields');
            return;
        }

        if (registerData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Attempting registration:', { ...registerData, password: '[HIDDEN]' }); // DEBUG

            const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Registration successful:', data); // DEBUG

                // FIXED: Check if registration returns a token
                if (data.access_token) {
                    localStorage.setItem('token', data.access_token);
                    onSuccess?.();
                    onClose();
                    window.location.reload();
                } else {
                    // If no token returned, switch to login mode
                    setError('Registration successful! Please log in.');
                    setMode('login');
                    setLoginData({ email: registerData.email, password: '' });
                }
            } else {
                const errorData = await response.json().catch(() => ({ detail: 'Registration failed' }));
                console.error('Registration failed:', errorData); // DEBUG
                setError(errorData.detail || 'Registration failed');
            }
        } catch (err) {
            console.error('Network error:', err); // DEBUG
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            console.log('Fetching Google OAuth URL...'); // DEBUG

            const response = await fetch(`${API_BASE_URL}/api/v1/oauth/google/url`);
            if (response.ok) {
                const data = await response.json();
                console.log('Google OAuth URL received:', data.url); // DEBUG

                // Redirect to the actual Google OAuth URL
                window.location.href = data.url;
            } else {
                console.error('Failed to get Google OAuth URL:', response.status);
                setError('Failed to initialize Google login');
            }
        } catch (err) {
            console.error('Error getting Google OAuth URL:', err);
            setError('Failed to initialize Google login');
        } finally {
            setLoading(false);
        }
    };

    const handleLinkedInLogin = async () => {
        try {
            setLoading(true);
            console.log('Fetching LinkedIn OAuth URL...'); // DEBUG

            const response = await fetch(`${API_BASE_URL}/api/v1/oauth/linkedin/url`);
            if (response.ok) {
                const data = await response.json();
                console.log('LinkedIn OAuth URL received:', data.url); // DEBUG

                // Redirect to the actual LinkedIn OAuth URL
                window.location.href = data.url;
            } else {
                console.error('Failed to get LinkedIn OAuth URL:', response.status);
                setError('Failed to initialize LinkedIn login');
            }
        } catch (err) {
            console.error('Error getting LinkedIn OAuth URL:', err);
            setError('Failed to initialize LinkedIn login');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {mode === 'login' ? 'Welcome back' : 'Create account'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* OAuth Buttons */}
                    <div className="space-y-3 mb-6">
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        <button
                            onClick={handleLinkedInLogin}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="#0077B5" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            Continue with LinkedIn
                        </button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or</span>
                        </div>
                    </div>

                    {/* Login Form */}
                    {mode === 'login' ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={loginData.email}  // CHANGED: Use email field
                                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}  // CHANGED
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                        placeholder="Enter your email address"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={loginData.password}
                                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>
                    ) : (
                        /* Register Form */
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={registerData.first_name}
                                        onChange={(e) => setRegisterData(prev => ({ ...prev, first_name: e.target.value }))}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                        placeholder="First name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={registerData.last_name}
                                        onChange={(e) => setRegisterData(prev => ({ ...prev, last_name: e.target.value }))}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                        placeholder="Last name"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={registerData.username}
                                        onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                        placeholder="Choose a username"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                        placeholder="Create a password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {loading ? 'Creating account...' : 'Create account'}
                            </button>
                        </form>
                    )}

                    {/* Switch Mode */}
                    <div className="mt-6 text-center">
                        <span className="text-gray-600">
                            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <button
                            onClick={() => {
                                setMode(mode === 'login' ? 'register' : 'login');
                                setError('');
                            }}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {mode === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}