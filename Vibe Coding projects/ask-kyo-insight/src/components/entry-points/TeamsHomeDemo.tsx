import { motion } from 'framer-motion';
import { Home, MessageSquare, Calendar, Phone, Settings, MoreHorizontal, Search, Plus } from 'lucide-react';

interface TeamsHomeDemoProps {
  onFloatingClick: () => void;
}

export function TeamsHomeDemo({ onFloatingClick }: TeamsHomeDemoProps) {
  return (
    <div className="relative bg-card rounded-xl border border-border overflow-hidden shadow-lg">
      {/* Teams Header */}
      <div className="bg-[hsl(252,59%,50%)] text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center">
            <span className="text-xs font-bold">T</span>
          </div>
          <span className="font-medium text-sm">Microsoft Teams</span>
        </div>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 opacity-70" />
          <Settings className="w-4 h-4 opacity-70" />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex h-[280px]">
        {/* Sidebar */}
        <div className="w-14 bg-muted/30 border-r border-border py-3 flex flex-col items-center gap-4">
          <button className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Home className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </button>
          <div className="flex-1" />
          <button className="w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-4">
          <h2 className="text-base font-semibold text-foreground mb-1">Good morning!</h2>
          <p className="text-xs text-muted-foreground mb-4">Here's what's happening today</p>
          
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">Upcoming meeting</span>
              </div>
              <p className="text-xs text-muted-foreground">Weekly Marketing Sync · 10:00 AM</p>
            </div>
            
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">3 new messages</span>
              </div>
              <p className="text-xs text-muted-foreground">From: Design Team, Sales...</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Kyo Button */}
      <motion.button
        onClick={onFloatingClick}
        className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center font-bold text-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          boxShadow: ['0 4px 20px rgba(37, 99, 235, 0.3)', '0 4px 30px rgba(37, 99, 235, 0.5)', '0 4px 20px rgba(37, 99, 235, 0.3)']
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        K
      </motion.button>
    </div>
  );
}
