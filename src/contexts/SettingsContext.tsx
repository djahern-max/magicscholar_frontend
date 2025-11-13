// src/contexts/SettingsContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { profileService } from '@/lib/profileService';
import { UserSettings } from '@/types/profile';
import { setConfettiEnabled } from '@/lib/confettiHelper';

interface SettingsContextType {
    settings: UserSettings;
    updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const DEFAULT_SETTINGS: UserSettings = { confetti_enabled: true };

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    // Sync confetti helper whenever settings change
    useEffect(() => {
        setConfettiEnabled(settings.confetti_enabled);
    }, [settings.confetti_enabled]);

    const loadSettings = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                // No token - user not authenticated, use defaults
                setIsAuthenticated(false);
                setSettings(DEFAULT_SETTINGS);
                setIsLoading(false);
                return;
            }

            // Token exists - try to fetch user settings
            setIsAuthenticated(true);
            const userSettings = await profileService.getSettings(token);
            setSettings(userSettings);
        } catch (error) {
            console.error('Failed to load settings:', error);
            // If fetch fails (401, network error, etc.), fall back to defaults
            setIsAuthenticated(false);
            setSettings(DEFAULT_SETTINGS);
        } finally {
            setIsLoading(false);
        }
    };

    const updateSettings = async (newSettings: Partial<UserSettings>) => {
        // Update local state immediately for responsive UI
        setSettings(prev => ({ ...prev, ...newSettings }));

        if (!isAuthenticated) {
            // For unauthenticated users, only update local state
            console.log('Settings updated locally (not authenticated)');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn('Token missing, cannot save settings');
                return;
            }

            const response = await profileService.updateSettings(token, newSettings);
            setSettings(response.settings);
        } catch (error) {
            console.error('Failed to update settings:', error);
            // Revert to previous settings on error
            loadSettings();
            throw error;
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, isLoading, isAuthenticated }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}