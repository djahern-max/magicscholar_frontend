// components/auth/AuthModal.tsx - Enhanced with Better User Communication
'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, Info } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultMode?: 'login' | 'register';
    onSuccess?: () => void;
}

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    first_name: string;
    last_name: string;
}

type MessageType = 'error' | 'info' | 'success';

interface Message {
    type: MessageType;
    content: string;
    action?: {
        text: string;
        onClick: () => void;
    };
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login', onSuccess }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form data
    const [loginData, setLoginData] = useState<LoginData>({
        email: '',
        password: ''
    });

    const [registerData, setRegisterData] = useState<RegisterData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: ''
    });

    React.useEffect(() => {
        if (isOpen) {
            setMode(defaultMode);
            setMessage(null);
            setLoginData({ email: '', password: '' });
            setRegisterData({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                first_name: '',
                last_name: ''
            });
        }
    }, [isOpen, defaultMode]);

    const clearMessage = () => setMessage(null);

    const setErrorMessage = (content: string, action?: Message['action']) => {
        setMessage({ type: 'error', content, action });
    };

    const setInfoMessage = (content: string, action?: Message['action']) => {
        setMessage({ type: 'info', content, action });
    };

    const setSuccessMessage = (content: string, action?: Message['action']) => {
        setMessage({ type: 'success', content, action });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!loginData.email || !loginData.password) {
            setErrorMessage('Please enter both your email address and password to sign in.');
            return;
        }

        setLoading(true);
        clearMessage();

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/login-json`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                setSuccessMessage('Welcome back! You have successfully signed in.');

                setTimeout(() => {
                    onSuccess?.();
                    onClose();
                    window.location.reload();
                }, 1000);
            } else {
                const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));

                if (response.status === 401) {
                    setErrorMessage(
                        'The email address or password you entered is incorrect. Please double-check your credentials and try again.',
                        {
                            text: 'Forgot your password?',
                            onClick: () => {
                                // TODO: Implement password reset flow
                                setInfoMessage('Password reset feature will be available soon. Please contact support if you need help accessing your account.');
                            }
                        }
                    );
                } else if (response.status === 400 && errorData.detail?.includes('Inactive user')) {
                    setErrorMessage('Your account has been deactivated. Please contact support for assistance reactivating your account.');
                } else {
                    setErrorMessage(errorData.detail || 'We encountered an issue signing you in. Please try again.');
                }
            }
        } catch (err) {
            console.error('Network error:', err);
            setErrorMessage(
                'Unable to connect to our servers. Please check your internet connection and try again.',
                {
                    text: 'Retry',
                    onClick: () => handleLogin(e)
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Enhanced validation with specific messaging
        if (!registerData.first_name.trim()) {
            setErrorMessage('Please enter your first name.');
            return;
        }
        if (!registerData.last_name.trim()) {
            setErrorMessage('Please enter your last name.');
            return;
        }
        if (!registerData.username.trim()) {
            setErrorMessage('Please choose a username for your account.');
            return;
        }
        if (!registerData.email.trim()) {
            setErrorMessage('Please enter your email address.');
            return;
        }
        if (!registerData.password) {
            setErrorMessage('Please create a password for your account.');
            return;
        }
        if (!registerData.confirmPassword) {
            setErrorMessage('Please confirm your password by entering it again.');
            return;
        }

        if (registerData.password.length < 6) {
            setErrorMessage('Your password must be at least 6 characters long for security purposes.');
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            setErrorMessage('The passwords you entered do not match. Please make sure both password fields contain the same password.');
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(registerData.email)) {
            setErrorMessage('Please enter a valid email address (e.g., name@example.com).');
            return;
        }

        // Username validation
        if (registerData.username.length < 3) {
            setErrorMessage('Your username must be at least 3 characters long.');
            return;
        }

        setLoading(true);
        clearMessage();

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: registerData.username,
                    email: registerData.email,
                    password: registerData.password,
                    first_name: registerData.first_name,
                    last_name: registerData.last_name
                }),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.access_token) {
                    localStorage.setItem('token', data.access_token);
                    setSuccessMessage(`Welcome to MagicScholar, ${registerData.first_name}! Your account has been created successfully.`);

                    setTimeout(() => {
                        onSuccess?.();
                        onClose();
                        window.location.reload();
                    }, 1500);
                } else {
                    setSuccessMessage(
                        'Your account has been created successfully! You can now sign in with your email and password.',
                        {
                            text: 'Sign in now',
                            onClick: () => {
                                setMode('login');
                                setLoginData({ email: registerData.email, password: '' });
                                clearMessage();
                            }
                        }
                    );
                }
            } else {
                const errorData = await response.json().catch(() => ({ detail: 'Registration failed' }));

                if (errorData.detail === 'Email already registered') {
                    setInfoMessage(
                        `An account with the email ${registerData.email} already exists. If this is your email, you can sign in instead.`,
                        {
                            text: 'Sign in with this email',
                            onClick: () => {
                                setMode('login');
                                setLoginData({ email: registerData.email, password: '' });
                                clearMessage();
                            }
                        }
                    );
                } else if (errorData.detail === 'Username already taken') {
                    setErrorMessage(`The username "${registerData.username}" is already taken. Please choose a different username.`);
                } else if (errorData.detail?.includes('email')) {
                    setErrorMessage('Please enter a valid email address.');
                } else if (errorData.detail?.includes('password')) {
                    setErrorMessage('Your password does not meet the security requirements. Please choose a stronger password.');
                } else {
                    setErrorMessage(
                        errorData.detail || 'We encountered an issue creating your account. Please try again.'
                    );
                }
            }
        } catch (err) {
            console.error('Network error:', err);
            setErrorMessage(
                'Unable to connect to our servers. Please check your internet connection and try again.',
                {
                    text: 'Retry',
                    onClick: () => handleRegister(e)
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            clearMessage();

            const response = await fetch(`${API_BASE_URL}/api/v1/oauth/google/url`);
            if (response.ok) {
                const data = await response.json();
                window.location.href = data.url;
            } else {
                setErrorMessage(
                    'Unable to connect to Google for sign-in. Please try again or use email/password instead.',
                    {
                        text: 'Try again',
                        onClick: handleGoogleLogin
                    }
                );
            }
        } catch (err) {
            console.error('Error getting Google OAuth URL:', err);
            setErrorMessage(
                'Unable to initialize Google sign-in. Please check your internet connection and try again.',
                {
                    text: 'Retry',
                    onClick: handleGoogleLogin
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLinkedInLogin = async () => {
        try {
            setLoading(true);
            clearMessage();

            const response = await fetch(`${API_BASE_URL}/api/v1/oauth/linkedin/url`);
            if (response.ok) {
                const data = await response.json();
                window.location.href = data.url;
            } else {
                setErrorMessage(
                    'Unable to connect to LinkedIn for sign-in. Please try again or use email/password instead.',
                    {
                        text: 'Try again',
                        onClick: handleLinkedInLogin
                    }
                );
            }
        } catch (err) {
            console.error('Error getting LinkedIn OAuth URL:', err);
            setErrorMessage(
                'Unable to initialize LinkedIn sign-in. Please check your internet connection and try again.',
                {
                    text: 'Retry',
                    onClick: handleLinkedInLogin
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = () => {
        if (!message) return null;

        const getMessageStyles = () => {
            switch (message.type) {
                case 'error':
                    return 'bg-red-50 border-red-200 text-red-700';
                case 'info':
                    return 'bg-blue-50 border-blue-200 text-blue-700';
                case 'success':
                    return 'bg-green-50 border-green-200 text-green-700';
                default:
                    return 'bg-gray-50 border-gray-200 text-gray-700';
            }
        };

        const getIcon = () => {
            switch (message.type) {
                case 'error':
                    return <AlertCircle size={18} className="text-red-500 flex-shrink-0" />;
                case 'info':
                    return <Info size={18} className="text-blue-500 flex-shrink-0" />;
                case 'success':
                    return <CheckCircle size={18} className="text-green-500 flex-shrink-0" />;
                default:
                    return null;
            }
        };

        return (
            <div className={`mb-4 p-4 border rounded-lg ${getMessageStyles()}`}>
                <div className="flex items-start gap-3">
                    {getIcon()}
                    <div className="flex-1">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        {message.action && (
                            <button
                                onClick={message.action.onClick}
                                className={`mt-2 inline-flex items-center text-sm font-medium underline hover:no-underline ${message.type === 'error' ? 'text-red-800' :
                                    message.type === 'info' ? 'text-blue-800' : 'text-green-800'
                                    }`}
                            >
                                {message.action.text}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {mode === 'login' ? 'Welcome back' : 'Create your account'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Message Display */}
                    {renderMessage()}

                    {/* OAuth Buttons */}
                    <div className="space-y-3 mb-6">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
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
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
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
                            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
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
                                        value={loginData.email}
                                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                        placeholder="Enter your email address"
                                        required
                                        disabled={loading}
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
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        disabled={loading}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                                        disabled={loading}
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
                                        disabled={loading}
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
                                        disabled={loading}
                                        minLength={3}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">At least 3 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                                        placeholder="Enter your email address"
                                        required
                                        disabled={loading}
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
                                        disabled={loading}
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        disabled={loading}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={registerData.confirmPassword}
                                        onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors ${registerData.confirmPassword && registerData.password !== registerData.confirmPassword
                                            ? 'border-red-300 focus:ring-red-500'
                                            : registerData.confirmPassword && registerData.password === registerData.confirmPassword
                                                ? 'border-green-300 focus:ring-green-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                            }`}
                                        placeholder="Confirm your password"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        disabled={loading}
                                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {registerData.confirmPassword && registerData.password !== registerData.confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                                )}
                                {registerData.confirmPassword && registerData.password === registerData.confirmPassword && (
                                    <p className="text-xs text-green-500 mt-1">Passwords match</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {loading ? 'Creating your account...' : 'Create account'}
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
                                clearMessage();
                            }}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                            disabled={loading}
                        >
                            {mode === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}