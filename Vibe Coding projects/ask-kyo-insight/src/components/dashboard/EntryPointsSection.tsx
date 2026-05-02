import { Layout, MessageSquare, Video, Users, Mail, Mic, Type, Image, FileUp } from 'lucide-react';
import { EntryPoint } from '@/types/kyo';
import { cn } from '@/lib/utils';

interface EntryPointsSectionProps {
  entryPoints: EntryPoint[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Layout,
  MessageSquare,
  Video,
  Users,
  Mail,
};

const inputTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  text: Type,
  voice: Mic,
  screenshot: Image,
  file: FileUp,
};

const inputTypeLabels: Record<string, string> = {
  text: 'Text',
  voice: 'Voice',
  screenshot: 'Screenshot',
  file: 'File',
};

export function EntryPointsSection({ entryPoints }: EntryPointsSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Entry Points</h2>
        <p className="text-sm text-muted-foreground">How Ask Kyo works in different contexts</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entryPoints.map((entry) => {
          const Icon = iconMap[entry.icon] || Layout;
          return (
            <div
              key={entry.id}
              className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-soft transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-card-foreground">{entry.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{entry.description}</p>
                </div>
              </div>
              
              {/* Input Types */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Inputs:</span>
                <div className="flex items-center gap-1.5">
                  {entry.inputTypes.map((type) => {
                    const InputIcon = inputTypeIcons[type];
                    return (
                      <div
                        key={type}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-muted text-muted-foreground"
                        title={inputTypeLabels[type]}
                      >
                        <InputIcon className="w-3 h-3" />
                        <span className="text-[10px]">{inputTypeLabels[type]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Features */}
              <div className="mt-3 pt-3 border-t border-border">
                <ul className="space-y-1">
                  {entry.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                  {entry.features.length > 3 && (
                    <li className="text-xs text-primary">+{entry.features.length - 3} more</li>
                  )}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
