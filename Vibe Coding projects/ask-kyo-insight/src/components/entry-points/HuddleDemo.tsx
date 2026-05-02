import { motion } from 'framer-motion';
import { Mic, MicOff, Headphones, MoreHorizontal, Users, Sparkles } from 'lucide-react';

interface HuddleDemoProps {
  onFloatingClick: () => void;
}

export function HuddleDemo({ onFloatingClick }: HuddleDemoProps) {
  return (
    <div className="relative bg-[#292934] rounded-xl border border-border overflow-hidden shadow-lg">
      {/* Huddle Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-medium text-white">Quick Huddle</span>
          <span className="text-[10px] text-white/50">· 3:42</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded text-white/70 hover:bg-white/10">
            <Users className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded text-white/70 hover:bg-white/10">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Participants */}
      <div className="p-6 flex items-center justify-center gap-4">
        <motion.div 
          className="flex flex-col items-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-16 h-16 rounded-full bg-primary/30 border-2 border-success flex items-center justify-center mb-2">
            <span className="text-lg font-medium text-white">RK</span>
          </div>
          <span className="text-[10px] text-white/70">You (speaking)</span>
        </motion.div>
        
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-accent/30 flex items-center justify-center mb-2">
            <span className="text-sm font-medium text-white">AM</span>
          </div>
          <span className="text-[10px] text-white/50">Amit</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-2">
            <span className="text-sm font-medium text-white/70">PS</span>
          </div>
          <span className="text-[10px] text-white/50">Priya</span>
        </div>
      </div>
      
      {/* Kyo Live Insight */}
      <div className="mx-4 mb-4 p-3 rounded-xl bg-primary/10 border border-primary/30">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-medium text-primary">Kyo is listening...</span>
        </div>
        <p className="text-xs text-white/80">
          "Mentioned: ROAS drop, quality complaints, creative testing"
        </p>
        <div className="flex gap-1 mt-2">
          <span className="px-2 py-0.5 rounded text-[8px] bg-white/10 text-white/70">3 insights detected</span>
          <span className="px-2 py-0.5 rounded text-[8px] bg-white/10 text-white/70">2 action items</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="bg-[#1e1e26] px-4 py-3 flex items-center justify-center gap-3">
        <button className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center">
          <Mic className="w-4 h-4" />
        </button>
        <button className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
          <Headphones className="w-4 h-4" />
        </button>
        
        {/* Kyo Button */}
        <motion.button
          onClick={onFloatingClick}
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          K
        </motion.button>
        
        <button className="px-4 py-2 rounded-full bg-destructive text-white text-xs font-medium hover:bg-destructive/90">
          Leave
        </button>
      </div>
    </div>
  );
}
