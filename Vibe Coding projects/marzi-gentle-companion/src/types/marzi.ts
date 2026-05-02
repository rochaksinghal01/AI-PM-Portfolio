export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type InterestCategory = 
  | 'food'
  | 'music'
  | 'stories'
  | 'health'
  | 'learning'
  | 'devotion';

export interface UserPreferences {
  interests: InterestCategory[];
  onboardingComplete: boolean;
}

export interface MomentContent {
  id: string;
  type: 'recipe' | 'news' | 'fact' | 'story' | 'music' | 'reflection';
  title: string;
  description: string;
  duration: string; // e.g., "2 min"
  timeOfDay: TimeOfDay[];
  interests: InterestCategory[];
  audioUrl?: string;
  imageUrl?: string;
}

export interface WellnessActivity {
  id: string;
  type: 'breathing' | 'meditation' | 'stretching' | 'movement';
  title: string;
  description: string;
  duration: string;
  instructions: string[];
  imageUrl?: string;
}

export interface Interest {
  id: InterestCategory;
  icon: string;
  label: string;
  description: string;
}
