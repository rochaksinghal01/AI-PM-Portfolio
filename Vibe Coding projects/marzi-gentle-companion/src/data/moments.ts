import type { MomentContent } from '@/types/marzi';

export const moments: MomentContent[] = [
  // Morning content
  {
    id: 'morning-recipe-1',
    type: 'recipe',
    title: 'A Perfect Cup of Masala Chai',
    description: 'Start your morning with the warm, comforting aroma of freshly brewed chai with cardamom, ginger, and cinnamon.',
    duration: '2 min',
    timeOfDay: ['morning'],
    interests: ['food'],
  },
  {
    id: 'morning-fact-1',
    type: 'fact',
    title: 'The Healing Power of Morning Light',
    description: 'Did you know? Just 10 minutes of morning sunlight helps your body produce vitamin D and sets your natural sleep rhythm for better rest tonight.',
    duration: '1 min',
    timeOfDay: ['morning'],
    interests: ['health', 'learning'],
  },
  {
    id: 'morning-reflection-1',
    type: 'reflection',
    title: 'A Thought for the Day',
    description: '"The morning breeze has secrets to tell you. Do not go back to sleep." — Rumi. Take a moment to breathe and welcome this new day.',
    duration: '1 min',
    timeOfDay: ['morning'],
    interests: ['devotion', 'health'],
  },
  
  // Afternoon content
  {
    id: 'afternoon-fact-1',
    type: 'fact',
    title: 'The Wonder of the Banyan Tree',
    description: 'India\'s national tree, the Banyan, can cover over 4 acres with a single tree. Some are over 250 years old and still growing!',
    duration: '1 min',
    timeOfDay: ['afternoon'],
    interests: ['learning'],
  },
  {
    id: 'afternoon-story-1',
    type: 'story',
    title: 'The Village Well',
    description: 'A short tale about how a small act of kindness at a village well created ripples of generosity that lasted for generations.',
    duration: '3 min',
    timeOfDay: ['afternoon'],
    interests: ['stories'],
  },
  {
    id: 'afternoon-recipe-1',
    type: 'recipe',
    title: 'Refreshing Nimbu Pani',
    description: 'Beat the afternoon heat with this simple lemon water recipe with a hint of black salt and cumin for extra refreshment.',
    duration: '2 min',
    timeOfDay: ['afternoon'],
    interests: ['food', 'health'],
  },
  
  // Evening content
  {
    id: 'evening-music-1',
    type: 'music',
    title: 'Evening Raag Yaman',
    description: 'Listen to the soothing notes of Raag Yaman, traditionally played at dusk, to ease into a peaceful evening.',
    duration: '5 min',
    timeOfDay: ['evening'],
    interests: ['music', 'devotion'],
  },
  {
    id: 'evening-story-1',
    type: 'story',
    title: 'Letters from the Past',
    description: 'A nostalgic reflection on the lost art of letter writing and the joy of receiving handwritten notes from loved ones.',
    duration: '3 min',
    timeOfDay: ['evening'],
    interests: ['stories'],
  },
  {
    id: 'evening-bhajan-1',
    type: 'music',
    title: 'Om Jai Jagdish Hare',
    description: 'The beloved evening aarti that has brought families together for generations. A moment of devotion and gratitude.',
    duration: '4 min',
    timeOfDay: ['evening'],
    interests: ['devotion', 'music'],
  },
  
  // Night content
  {
    id: 'night-reflection-1',
    type: 'reflection',
    title: 'Gratitude Before Sleep',
    description: 'As the day ends, take a moment to think of three small things that brought you joy today. Even the smallest blessing counts.',
    duration: '2 min',
    timeOfDay: ['night'],
    interests: ['devotion', 'health'],
  },
  {
    id: 'night-story-1',
    type: 'story',
    title: 'The Moonlit Garden',
    description: 'A gentle bedtime story about an elderly gardener who discovers magic in his night-blooming jasmine.',
    duration: '4 min',
    timeOfDay: ['night'],
    interests: ['stories'],
  },
  {
    id: 'night-music-1',
    type: 'music',
    title: 'Peaceful Night Melody',
    description: 'Soft instrumental music to help you drift into restful sleep. Let the gentle notes carry away the day\'s thoughts.',
    duration: '5 min',
    timeOfDay: ['night'],
    interests: ['music', 'health'],
  },
];

export function getMomentForTime(
  timeOfDay: string,
  userInterests: string[]
): MomentContent {
  // Filter moments by time of day
  let availableMoments = moments.filter(m => 
    m.timeOfDay.includes(timeOfDay as any)
  );
  
  // If user has interests, prefer matching content
  if (userInterests.length > 0) {
    const matchingMoments = availableMoments.filter(m =>
      m.interests.some(i => userInterests.includes(i))
    );
    if (matchingMoments.length > 0) {
      availableMoments = matchingMoments;
    }
  }
  
  // Return a random moment from available ones
  const randomIndex = Math.floor(Math.random() * availableMoments.length);
  return availableMoments[randomIndex] || moments[0];
}
