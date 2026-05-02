import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { TimeRange } from '@/types/kyo';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

const options: { value: TimeRange; label: string }[] = [
  { value: '24h', label: '24h' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: 'custom', label: 'Custom' },
];

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'relative flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors',
            value === option.value
              ? 'text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {value === option.value && (
            <motion.div
              layoutId="timeRange"
              className="absolute inset-0 bg-primary rounded-md"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center justify-center gap-1">
            {option.value === 'custom' && <Calendar className="w-3 h-3" />}
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}
