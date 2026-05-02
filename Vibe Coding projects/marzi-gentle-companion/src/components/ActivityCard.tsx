import { useState } from 'react';
import { Play, Pause, SkipForward, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WellnessActivity } from '@/types/marzi';

interface ActivityCardProps {
  activity: WellnessActivity;
  onComplete?: () => void;
  onSkip?: () => void;
}

export function ActivityCard({ activity, onComplete, onSkip }: ActivityCardProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const getTypeIcon = () => {
    switch (activity.type) {
      case 'breathing': return '🌬️';
      case 'meditation': return '🧘';
      case 'stretching': return '🌸';
      case 'movement': return '🌊';
    }
  };

  const getTypeLabel = () => {
    switch (activity.type) {
      case 'breathing': return 'Breathing';
      case 'meditation': return 'Meditation';
      case 'stretching': return 'Stretching';
      case 'movement': return 'Movement';
    }
  };

  const handleStart = () => {
    setIsStarted(true);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (currentStep < activity.instructions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete?.();
    }
  };

  if (!isStarted) {
    return (
      <div className="bg-card rounded-3xl shadow-elevated overflow-hidden animate-fade-up">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-secondary/10 text-secondary">
              {getTypeIcon()} {getTypeLabel()}
            </span>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{activity.duration}</span>
            </div>
          </div>

          <h2 className="text-title font-serif text-foreground mb-3">
            {activity.title}
          </h2>

          <p className="text-body text-muted-foreground leading-relaxed mb-6">
            {activity.description}
          </p>

          <div className="flex gap-4">
            <Button
              variant="marzi-secondary"
              size="lg"
              className="flex-1"
              onClick={handleStart}
            >
              <Play className="w-5 h-5" />
              <span>Begin</span>
            </Button>

            <Button
              variant="marzi-ghost"
              size="lg"
              onClick={onSkip}
            >
              Not now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Active activity view
  return (
    <div className="bg-card rounded-3xl shadow-elevated overflow-hidden animate-fade-up">
      {/* Breathing animation circle */}
      {activity.type === 'breathing' && (
        <div className="flex items-center justify-center py-8 gradient-calm">
          <div className="w-32 h-32 rounded-full bg-secondary/20 animate-breathe flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center">
              <span className="text-4xl">🌬️</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Progress indicator */}
        <div className="flex gap-2 mb-6">
          {activity.instructions.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                index <= currentStep ? 'bg-secondary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Current instruction */}
        <div className="text-center mb-8">
          <p className="text-title font-serif text-foreground leading-relaxed">
            {activity.instructions[currentStep]}
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Step {currentStep + 1} of {activity.instructions.length}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="marzi-secondary"
            size="lg"
            className="flex-1"
            onClick={handleNextStep}
          >
            {currentStep < activity.instructions.length - 1 ? (
              <>
                <SkipForward className="w-5 h-5" />
                <span>Next</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Complete</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
