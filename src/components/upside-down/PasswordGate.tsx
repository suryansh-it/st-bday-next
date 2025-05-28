
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

interface PasswordGateProps {
  onUnlock: () => void;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    setSecretCode(`eleven${dd}${mm}`);
    // Auto-focus the input when the component mounts
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (password.toLowerCase() === secretCode) {
        toast({ title: "SYSTEM ONLINE", description: "Access credentials verified. Welcome to the Program.", variant: "default" });
        onUnlock();
      } else {
        toast({ title: "ACCESS DENIED", description: "Invalid code. System breach detected. Alerting authorities.", variant: "destructive" });
        setPassword('');
        inputRef.current?.focus(); // Re-focus on error
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleGateClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={handleGateClick}>
<Image
  src="/assets/lab.jpg"
  alt="Dark, grainy lab interior"
  fill
  style={{ objectFit: 'cover' }}
  className="opacity-10 animate-flicker"
/>
      <div 
        className="relative z-10 p-6 md:p-8 bg-card/90 border-2 border-accent/30 rounded-none shadow-2xl w-full max-w-md text-center vhs-overlay"
        onClick={(e) => e.stopPropagation()} // Prevent click on content from bubbling to outer div if needed
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-accent/50 via-destructive/50 to-accent/50 rounded-none blur opacity-20 animate-pulse group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        <h2 className="text-2xl md:text-3xl font-benguiat-style text-glitch text-accent mb-2 tracking-wider">
          HAWKINS NATIONAL LABORATORY
        </h2>
        <p className="text-sm text-muted-foreground mb-6 uppercase tracking-widest">Restricted Access Terminal</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="access-code-input" className="block text-xs font-digital text-accent/70 tracking-wider text-left sr-only">
              ENTER LEVEL ELEVEN ACCESS CODE:
            </label>
            <Input
              ref={inputRef}
              id="access-code-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER ACCESS CODE"
              className="font-digital text-3xl text-center bg-black/70 border-2 border-accent/60 text-accent focus:border-accent placeholder-accent/40 py-3 tracking-[0.2em] rounded-none"
              aria-label="Access Code"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full font-benguiat-style text-lg bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-none animate-pulse-glow button-thump transition-all duration-300 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                VALIDATING...
              </>
            ) : 'INITIATE ACCESS'}
          </Button>
        </form>
        <p className="mt-6 text-xs text-muted-foreground/70 animate-flicker">
          Unauthorized access is strictly prohibited. System integrity is monitored.
        </p>
      </div>
    </div>
  );
};

export default PasswordGate;
