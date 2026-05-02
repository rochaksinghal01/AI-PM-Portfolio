import { useMemo } from 'react';
import type { TimeOfDay } from '@/types/marzi';

interface TimeInfo {
  timeOfDay: TimeOfDay;
  greeting: string;
  message: string;
}

export function useTimeOfDay(): TimeInfo {
  return useMemo(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return {
        timeOfDay: 'morning',
        greeting: 'Good Morning',
        message: 'Start your day with a moment of calm',
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        timeOfDay: 'afternoon',
        greeting: 'Good Afternoon',
        message: 'Take a peaceful pause in your day',
      };
    } else if (hour >= 17 && hour < 21) {
      return {
        timeOfDay: 'evening',
        greeting: 'Good Evening',
        message: 'Unwind with a gentle moment',
      };
    } else {
      return {
        timeOfDay: 'night',
        greeting: 'Good Night',
        message: 'Settle into peaceful rest',
      };
    }
  }, []);
}
