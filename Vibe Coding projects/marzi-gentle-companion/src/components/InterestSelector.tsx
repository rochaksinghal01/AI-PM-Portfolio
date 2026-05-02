import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { InterestCategory } from '@/types/marzi';
import { interests } from '@/data/interests';
import { cn } from '@/lib/utils';

interface InterestSelectorProps {
  selectedInterests: InterestCategory[];
  onSelect: (interests: InterestCategory[]) => void;
  maxSelections?: number;
}

export function InterestSelector({ 
  selectedInterests, 
  onSelect, 
  maxSelections = 5 
}: InterestSelectorProps) {
  const toggleInterest = (interestId: InterestCategory) => {
    if (selectedInterests.includes(interestId)) {
      onSelect(selectedInterests.filter(i => i !== interestId));
    } else if (selectedInterests.length < maxSelections) {
      onSelect([...selectedInterests, interestId]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {interests.map((interest) => {
        const isSelected = selectedInterests.includes(interest.id);
        return (
          <button
            key={interest.id}
            onClick={() => toggleInterest(interest.id)}
            className={cn(
              "flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300",
              "hover:shadow-elevated",
              isSelected
                ? "border-primary bg-primary/5 shadow-soft"
                : "border-border/50 bg-card hover:border-primary/30"
            )}
          >
            <span className="text-4xl mb-3">{interest.icon}</span>
            <span className="font-medium text-foreground text-lg text-center">
              {interest.label}
            </span>
            <span className="text-muted-foreground text-sm text-center mt-1">
              {interest.description}
            </span>
            {isSelected && (
              <div className="mt-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
