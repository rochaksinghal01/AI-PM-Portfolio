import { motion } from 'framer-motion';
import { Mic, MicOff, Video, Monitor, MoreHorizontal, Hand, MessageSquare, Users } from 'lucide-react';

interface MeetingDemoProps {
  onFloatingClick: () => void;
}

export function MeetingDemo({ onFloatingClick }: MeetingDemoProps) {
  return (
    <div className="relative bg-[#1a1a2e] rounded-xl border border-border overflow-hidden shadow-lg">
      {/* Meeting Stage */}
      <div className="h-[220px] flex items-center justify-center relative">
        {/* Participant grid */}
        <div className="grid grid-cols-2 gap-2 p-4">
          <div className="w-28 h-20 rounded-lg bg-[#2a2a4e] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">RK</span>
            </div>
          </div>
          <div className="w-28 h-20 rounded-lg bg-[#2a2a4e] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center">
              <span className="text-xs font-medium text-white">AM</span>
            </div>
          </div>
          <div className="w-28 h-20 rounded-lg bg-[#2a2a4e] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-success/30 flex items-center justify-center">
              <span className="text-xs font-medium text-white">PS</span>
            </div>
          </div>
          <div className="w-28 h-20 rounded-lg bg-[#2a2a4e] flex items-center justify-center border border-dashed border-muted-foreground/20">
            <span className="text-[10px] text-muted-foreground">+2</span>
          </div>
        </div>
        
        {/* Meeting title */}
        <div className="absolute top-3 left-3">
          <p className="text-xs font-medium text-white/80">Weekly Marketing Sync</p>
          <p className="text-[10px] text-white/50">5 participants · 15:34</p>
        </div>
      </div>
      
      {/* Controls Bar */}
      <div className="bg-[#252545] px-4 py-3 flex items-center justify-center gap-3">
        <button className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
          <Mic className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
          <Video className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
          <Monitor className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
          <Hand className="w-4 h-4" />
        </button>
        
        {/* Kyo Button in controls */}
        <motion.button
          onClick={onFloatingClick}
          className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            boxShadow: ['0 0 0 0 rgba(37, 99, 235, 0)', '0 0 0 8px rgba(37, 99, 235, 0.2)', '0 0 0 0 rgba(37, 99, 235, 0)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          K
        </motion.button>
        
        <button className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
          <MessageSquare className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
          <Users className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90">
          <span className="text-[10px] font-medium">Leave</span>
        </button>
      </div>
    </div>
  );
}
