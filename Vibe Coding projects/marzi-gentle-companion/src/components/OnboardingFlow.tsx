import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InterestSelector } from '@/components/InterestSelector';
import type { InterestCategory } from '@/types/marzi';
import { ArrowRight, Heart } from 'lucide-react';
import { marziBackground } from '@/components/MarziLogo';

interface OnboardingFlowProps {
  onComplete: (interests: InterestCategory[]) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<InterestCategory[]>([]);

  const handleContinue = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete(selectedInterests);
    }
  };

  const handleSkip = () => {
    onComplete([]);
  };

  return (
    <div 
      className="min-h-screen bg-background flex flex-col relative"
      style={{
        backgroundImage: step === 0 ? `url(${marziBackground})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {step === 0 && <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />}
      
      {/* Progress dots */}
      <div className="px-6 pt-8 relative z-10">
        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === step ? 'w-8 bg-primary' : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12 relative z-10">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="animate-fade-up text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center animate-breathe">
                <Heart className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-display font-serif text-foreground mb-4">
                Welcome to Marzi
              </h1>
              <p className="text-body-lg text-muted-foreground max-w-md mx-auto">
                We're here to bring you calm, joy, and gentle wellbeing every day.
              </p>
            </div>

            <Button
              variant="marzi"
              size="xl"
              onClick={handleContinue}
              className="w-full max-w-sm mx-auto"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Step 1: Interest Selection */}
        {step === 1 && (
          <div className="animate-fade-up">
            <div className="text-center mb-8">
              <h1 className="text-heading font-serif text-foreground mb-3">
                What brings you joy?
              </h1>
              <p className="text-body text-muted-foreground">
                Choose up to 5 topics you'd like to hear more of
              </p>
            </div>

            <div className="max-w-lg mx-auto mb-8">
              <InterestSelector
                selectedInterests={selectedInterests}
                onSelect={setSelectedInterests}
              />
            </div>

            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <Button
                variant="marzi"
                size="xl"
                onClick={handleContinue}
                className="w-full"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="marzi-ghost"
                size="lg"
                onClick={handleSkip}
                className="w-full"
              >
                Skip for now
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Set Expectations */}
        {step === 2 && (
          <div className="animate-fade-up text-center">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/10 flex items-center justify-center animate-float">
                <span className="text-4xl">🌿</span>
              </div>
              <h1 className="text-heading font-serif text-foreground mb-4">
                Your calm space awaits
              </h1>
              <p className="text-body-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                Whenever you open Marzi, you'll find one calm moment waiting for you. 
                <span className="block mt-2 text-secondary font-medium">
                  No pressure. No noise.
                </span>
              </p>
            </div>

            <Button
              variant="marzi"
              size="xl"
              onClick={handleContinue}
              className="w-full max-w-sm mx-auto"
            >
              <span>Enter Marzi</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
