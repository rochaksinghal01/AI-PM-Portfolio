import { useState, useEffect } from 'react';
import { TimeGreeting } from '@/components/TimeGreeting';
import { MomentCard } from '@/components/MomentCard';
import { ActivityCard } from '@/components/ActivityCard';
import { BottomNav } from '@/components/BottomNav';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { getMomentForTime } from '@/data/moments';
import { getActivityForTime } from '@/data/activities';
import type { InterestCategory } from '@/types/marzi';
import { toast } from 'sonner';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'moments' | 'wellness'>('moments');
  const [isPlaying, setIsPlaying] = useState(false);
  const { timeOfDay, greeting, message } = useTimeOfDay();
  const { preferences, updateInterests, completeOnboarding } = useUserPreferences();
  
  // Get content based on time and interests
  const moment = getMomentForTime(timeOfDay, preferences.interests);
  const activity = getActivityForTime(timeOfDay);

  const handleOnboardingComplete = (interests: InterestCategory[]) => {
    updateInterests(interests);
    completeOnboarding();
    toast.success('Welcome to Marzi! 🌿', {
      description: 'Your calm space is ready.',
    });
  };

  const handleMomentComplete = () => {
    toast.success('Moment completed', {
      description: 'Come back anytime for more calm moments.',
    });
    setIsPlaying(false);
  };

  const handleActivityComplete = () => {
    toast.success('Well done! 🌸', {
      description: 'You took a beautiful step for your wellbeing.',
    });
  };

  // Show onboarding if not complete
  if (!preferences.onboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <TimeGreeting
          timeOfDay={timeOfDay}
          greeting={greeting}
          message={message}
        />
      </div>

      {/* Main Content */}
      <div className="px-6">
        {activeTab === 'moments' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-caption text-muted-foreground font-medium uppercase tracking-wide">
                Today's Moment
              </h2>
            </div>
            <MomentCard
              moment={moment}
              isPlaying={isPlaying}
              onPlay={() => setIsPlaying(!isPlaying)}
              onComplete={handleMomentComplete}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-caption text-muted-foreground font-medium uppercase tracking-wide">
                Gentle Wellness
              </h2>
            </div>
            <ActivityCard
              activity={activity}
              onComplete={handleActivityComplete}
              onSkip={() => {
                toast('No worries', {
                  description: 'The activity will be here when you\'re ready.',
                });
              }}
            />
            
            {/* Optional feeling selector */}
            <div className="bg-muted/30 rounded-2xl p-5 mt-6">
              <p className="text-sm text-muted-foreground text-center mb-4">
                How are you feeling?
              </p>
              <div className="flex justify-center gap-3">
                {['😌 Calm', '😊 Good', '😔 Low', '😰 Anxious'].map((feeling) => (
                  <button
                    key={feeling}
                    className="px-4 py-2 rounded-full bg-background border border-border/50 text-sm text-foreground hover:border-primary/30 transition-all duration-300"
                    onClick={() => {
                      toast('Thank you for sharing', {
                        description: 'We\'ll suggest something gentle for you.',
                      });
                    }}
                  >
                    {feeling}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
