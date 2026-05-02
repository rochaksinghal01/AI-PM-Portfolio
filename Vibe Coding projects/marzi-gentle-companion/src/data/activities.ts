import type { WellnessActivity } from '@/types/marzi';

export const activities: WellnessActivity[] = [
  {
    id: 'breathing-1',
    type: 'breathing',
    title: 'Calming Breath',
    description: 'A simple 4-7-8 breathing technique to help you feel centered and calm.',
    duration: '2 min',
    instructions: [
      'Find a comfortable seated position',
      'Breathe in slowly through your nose for 4 counts',
      'Hold your breath gently for 7 counts',
      'Exhale slowly through your mouth for 8 counts',
      'Repeat 3-4 times, or as long as feels comfortable',
    ],
  },
  {
    id: 'breathing-2',
    type: 'breathing',
    title: 'Ocean Breath',
    description: 'Ujjayi breathing creates a soothing ocean-like sound that calms the mind.',
    duration: '3 min',
    instructions: [
      'Sit comfortably with your spine straight',
      'Breathe in deeply through your nose',
      'As you exhale, slightly constrict the back of your throat',
      'Listen to the gentle ocean-like sound',
      'Continue for 2-3 minutes at your own pace',
    ],
  },
  {
    id: 'meditation-1',
    type: 'meditation',
    title: 'Moment of Stillness',
    description: 'A brief guided pause to find peace in the present moment.',
    duration: '3 min',
    instructions: [
      'Close your eyes or soften your gaze',
      'Notice the sounds around you without judgment',
      'Feel your body supported by your chair or cushion',
      'Let thoughts come and go like clouds',
      'Rest in this quiet space for a few breaths',
    ],
  },
  {
    id: 'meditation-2',
    type: 'meditation',
    title: 'Gratitude Meditation',
    description: 'A gentle practice to cultivate thankfulness and inner peace.',
    duration: '4 min',
    instructions: [
      'Settle into a comfortable position',
      'Take three deep, slow breaths',
      'Think of someone who has shown you kindness',
      'Feel gratitude in your heart for this person',
      'Extend this warmth to yourself and others',
    ],
  },
  {
    id: 'stretching-1',
    type: 'stretching',
    title: 'Gentle Neck Release',
    description: 'Simple movements to release tension in your neck and shoulders.',
    duration: '2 min',
    instructions: [
      'Sit tall in your chair',
      'Slowly lower your right ear toward your right shoulder',
      'Hold for 3-4 breaths',
      'Return to center and repeat on the left side',
      'Roll your shoulders back gently 3 times',
    ],
  },
  {
    id: 'stretching-2',
    type: 'stretching',
    title: 'Seated Side Stretch',
    description: 'A refreshing stretch for your spine and sides while staying seated.',
    duration: '2 min',
    instructions: [
      'Sit at the edge of your chair',
      'Raise your right arm overhead',
      'Lean gently to the left, feeling a stretch on your right side',
      'Take 3-4 slow breaths',
      'Return to center and repeat on the other side',
    ],
  },
  {
    id: 'movement-1',
    type: 'movement',
    title: 'Gentle Sway',
    description: 'Light, rhythmic movement to lift your spirits and energize gently.',
    duration: '3 min',
    instructions: [
      'Stand with feet hip-width apart (or sit comfortably)',
      'Shift your weight slowly from side to side',
      'Let your arms swing naturally',
      'Imagine you are swaying like a tree in a gentle breeze',
      'Continue for 2-3 minutes, or as long as feels good',
    ],
  },
  {
    id: 'movement-2',
    type: 'movement',
    title: 'Morning Wake-Up',
    description: 'Gentle movements to awaken your body and welcome the day.',
    duration: '3 min',
    instructions: [
      'Stand or sit comfortably',
      'Reach your arms up overhead and stretch tall',
      'Circle your wrists and ankles gently',
      'March in place slowly for 30 seconds',
      'Finish with 3 deep breaths',
    ],
  },
];

export function getActivityForTime(timeOfDay: string): WellnessActivity {
  // Morning: energizing activities
  if (timeOfDay === 'morning') {
    const morningActivities = activities.filter(a => 
      a.type === 'movement' || a.type === 'stretching'
    );
    return morningActivities[Math.floor(Math.random() * morningActivities.length)];
  }
  
  // Evening/Night: calming activities
  if (timeOfDay === 'evening' || timeOfDay === 'night') {
    const calmingActivities = activities.filter(a => 
      a.type === 'breathing' || a.type === 'meditation'
    );
    return calmingActivities[Math.floor(Math.random() * calmingActivities.length)];
  }
  
  // Afternoon: any activity
  return activities[Math.floor(Math.random() * activities.length)];
}
