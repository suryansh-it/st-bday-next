
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { USER_NAME, PASSWORD_GATE_KEY } from '@/config/constants';
import { LogOut, Volume2, VolumeX, ShieldAlert } from 'lucide-react';

interface AppHeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ isMuted, onToggleMute }) => {
  const router = useRouter();

  const handleExit = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PASSWORD_GATE_KEY);
    }
    router.push('/');
  };

  return (
    <header className="p-4 bg-card/70 border-b-2 border-primary/40 shadow-lg flex items-center justify-between sticky top-0 z-40 vhs-overlay">
      <div className="flex items-center"> {/* Container for flex alignment */}
        <ShieldAlert size={28} className="mr-3 text-primary/80 animate-flicker shrink-0" />
        <h1 className="text-xl md:text-2xl font-benguiat-style text-primary">
          <span className="text-glitch">PROJECT UPSIDE DOWN - AGENT: Tanishka </span>
        </h1>
      </div>
      <div className="flex items-center space-x-2 md:space-x-3">
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleMute} 
            aria-label={isMuted ? "Unmute Audio" : "Mute Audio"} 
            className="text-accent hover:text-accent/80 button-thump hover:bg-transparent"
        >
          <span className="icon-hover-glow-accent">
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </span>
        </Button>
        <Button 
            variant="default" /* Changed from destructive to default for primary red */
            onClick={handleExit} 
            className="font-benguiat-style button-thump text-sm px-3 py-1.5 md:px-4 md:py-2 h-auto"
        >
          {/* Icon will inherit primary-foreground, glow will be primary red via CSS */}
          <span className="icon-hover-glow-destructive"><LogOut className="mr-1.5 h-4 w-4 md:h-5 md:w-5" /></span>
          <span className="text-hover-flicker">Evacuate Lab</span>
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;

