import { Home, Search, MessageSquare, BarChart3, Settings, HelpCircle, Users, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserContext, Team } from '@/types/kyo';

interface AppSidebarProps {
  user: UserContext;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'ask', label: 'Ask Kyo', icon: Search },
  { id: 'conversations', label: 'Conversations', icon: MessageSquare },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'sources', label: 'Data Sources', icon: Database },
];

const bottomItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
];

const teamColors: Record<Team, string> = {
  marketing: 'bg-team-marketing',
  cx: 'bg-team-cx',
  ops: 'bg-team-ops',
  product: 'bg-team-product',
  leadership: 'bg-team-leadership',
};

const teamLabels: Record<Team, string> = {
  marketing: 'Marketing',
  cx: 'Customer Experience',
  ops: 'Operations',
  product: 'Product',
  leadership: 'Leadership',
};

export function AppSidebar({ user, activeSection, onSectionChange }: AppSidebarProps) {
  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">K</span>
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-foreground">Ask Kyo</h1>
            <p className="text-xs text-muted-foreground">AI Copilot</p>
          </div>
        </div>
      </div>

      {/* User Context */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded font-medium text-primary-foreground',
                teamColors[user.team]
              )}>
                {teamLabels[user.team]}
              </span>
              <span className="text-[10px] text-muted-foreground capitalize">{user.seniority}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  activeSection === item.id
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Items */}
      <div className="p-2 border-t border-sidebar-border">
        <ul className="space-y-1">
          {bottomItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  activeSection === item.id
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
