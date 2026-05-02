import { X } from 'lucide-react';
import { UserContext, Team, Seniority } from '@/types/kyo';
import { cn } from '@/lib/utils';

interface PopupHeaderProps {
  user: UserContext;
  onClose: () => void;
}

const teamLabels: Record<Team, string> = {
  marketing: 'Marketing',
  cx: 'Customer Experience',
  ops: 'Operations',
  product: 'Product',
  leadership: 'Leadership',
};

const seniorityLabels: Record<Seniority, string> = {
  entry: 'Associate',
  mid: 'Specialist',
  senior: 'Senior',
  manager: 'Senior Manager',
  'c-level': 'Executive',
};

export function PopupHeader({ user, onClose }: PopupHeaderProps) {
  const firstName = user.name.split(' ')[0];

  return (
    <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar with online indicator */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-card" />
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-card-foreground">
              Welcome, {firstName}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                `team-badge-${user.team}`
              )}>
                {teamLabels[user.team]}
              </span>
              <span className="text-[10px] text-muted-foreground">
                · {seniorityLabels[user.seniority]}
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
