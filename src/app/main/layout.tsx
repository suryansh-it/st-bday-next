"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PASSWORD_GATE_KEY, BIRTHDAY_DATE_STRING } from '@/config/constants';
import AppHeader from '@/components/upside-down/AppHeader';
import BackgroundAudio from '@/components/upside-down/BackgroundAudio';
import SimpleConfetti from '@/components/upside-down/SimpleConfetti';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted due to autoplay policies
  const [isBirthday, setIsBirthday] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem(PASSWORD_GATE_KEY) !== 'true') {
        router.replace('/');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [router]);

  useEffect(() => {
    const today = new Date();
    const birthday = new Date(BIRTHDAY_DATE_STRING);
    // Normalize dates to compare day, month, year only
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const birthdayNormalized = new Date(birthday.getFullYear(), birthday.getMonth(), birthday.getDate());

    if (todayNormalized.getTime() === birthdayNormalized.getTime()) {
      setIsBirthday(true);
    }
  }, []);
  
  const handleToggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleInitialPlayFailed = () => {
    setIsMuted(true); // Ensure UI reflects muted state if autoplay fails
    toast({
      title: "Audio Muted",
      description: "Background music is muted. Click the speaker icon to unmute.",
      variant: "default",
    });
  };

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
        <p className="mt-4 font-benguiat-style text-xl text-accent">Verifying Clearance...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader isMuted={isMuted} onToggleMute={handleToggleMute} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="text-center p-4 text-xs text-muted-foreground border-t border-border/50">
        Property of Hawkins National Laboratory. Do not distribute.
      </footer>
      <BackgroundAudio isMuted={isMuted} onInitialPlayFailed={handleInitialPlayFailed} />
      <SimpleConfetti isActive={isBirthday} />
    </div>
  );
}
