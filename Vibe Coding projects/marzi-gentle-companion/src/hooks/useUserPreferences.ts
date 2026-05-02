import { useState, useEffect } from 'react';
import type { UserPreferences, InterestCategory } from '@/types/marzi';

const STORAGE_KEY = 'marzi-preferences';

const defaultPreferences: UserPreferences = {
  interests: [],
  onboardingComplete: false,
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window === 'undefined') return defaultPreferences;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const updateInterests = (interests: InterestCategory[]) => {
    setPreferences(prev => ({ ...prev, interests }));
  };

  const completeOnboarding = () => {
    setPreferences(prev => ({ ...prev, onboardingComplete: true }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    preferences,
    updateInterests,
    completeOnboarding,
    resetPreferences,
  };
}
