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
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<UserSettings>({ confetti_enabled: true });
    const [isLoading, setIsLoading] = useState(true);

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
            if (token) {
                const userSettings = await profileService.getSettings(token);
                setSettings(userSettings);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            // Keep default settings if fetch fails
        } finally {
            setIsLoading(false);
        }
    };

    const updateSettings = async (newSettings: Partial<UserSettings>) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const response = await profileService.updateSettings(token, newSettings);
            setSettings(response.settings);
        } catch (error) {
            console.error('Failed to update settings:', error);
            throw error;
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
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