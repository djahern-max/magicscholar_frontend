'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginRequest, RegisterRequest } from '@/lib/types/auth';
import * as authApi from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            authApi.getCurrentUser(storedToken)
                .then(setUser)
                .catch(() => {
                    localStorage.removeItem('token');
                    setToken(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (data: LoginRequest) => {
        const response = await authApi.login(data);
        setToken(response.access_token);
        setUser(response.user);
        localStorage.setItem('token', response.access_token);
    };

    const register = async (data: RegisterRequest) => {
        const newUser = await authApi.register(data);
        // After registration, automatically log in
        await login({ username: data.email, password: data.password });
    };

    const logout = async () => {
        if (token) {
            try {
                await authApi.logout(token);
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}