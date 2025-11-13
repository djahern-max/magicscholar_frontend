// src/lib/confettiHelper.ts
import confetti from 'canvas-confetti';

/**
 * Global settings state for confetti
 * This is updated by the SettingsContext
 */
let confettiEnabled = true;

/**
 * Update the global confetti enabled state
 * Called by SettingsContext when settings change
 */
export function setConfettiEnabled(enabled: boolean) {
    confettiEnabled = enabled;
}

/**
 * Trigger confetti if user has it enabled
 * Drop-in replacement for confetti() that respects user preferences
 * 
 * @param options - Standard canvas-confetti options
 * @returns Promise that resolves when animation completes, or null if disabled
 */
export function triggerConfetti(options?: confetti.Options): Promise<void> | null {
    if (confettiEnabled) {
        return confetti(options);
    }
    return null;
}

/**
 * Check if confetti is currently enabled
 */
export function isConfettiEnabled(): boolean {
    return confettiEnabled;
}