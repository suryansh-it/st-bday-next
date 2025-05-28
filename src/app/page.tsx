
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import StaticNoise from '@/components/upside-down/StaticNoise';
import CountdownTimer from '@/components/upside-down/CountdownTimer';
import PasswordGate from '@/components/upside-down/PasswordGate';
import PortalAnimation from '@/components/upside-down/PortalAnimation';
import { PASSWORD_GATE_KEY, BIRTHDAY_DATE_STRING } from '@/config/constants';
import IntroVideo from '@/components/upside-down/IntroVideo';
import { Loader2 } from 'lucide-react';

type AppStage = 'static' | 'countdown' |'video'| 'gate' | 'portal' | 'redirecting' | 'initial_load';

export default function HomePage() {
  const [stage, setStage] = useState<AppStage>('initial_load');
  const [showStatic, setShowStatic] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showPasswordGate, setShowPasswordGate] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already unlocked (highest priority)
    if (typeof window !== 'undefined' && localStorage.getItem(PASSWORD_GATE_KEY) === 'true') {
      setStage('redirecting');
      router.replace('/main');
      return;
    }

    // Check if birthday has arrived
    const today = new Date();
    const birthdayTargetDate = new Date(BIRTHDAY_DATE_STRING);
    // Normalize dates to compare day, month, year only for birthday check (ignoring time for "has arrived")
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const birthdayNormalized = new Date(birthdayTargetDate.getFullYear(), birthdayTargetDate.getMonth(), birthdayTargetDate.getDate());

    if (todayNormalized.getTime() >= birthdayNormalized.getTime()) {
      // Birthday has arrived or passed, go directly to gate
      setStage('gate');
      setShowPasswordGate(true);
      setShowStatic(false); // Ensure static is off
      setShowCountdown(false); // Ensure countdown is off
      return;
    }

    // Default flow: Pre-birthday, not unlocked
    setStage('static');
    setShowStatic(true);
    const staticTimer = setTimeout(() => {
      setStage('countdown');
      setShowCountdown(true);
      // Static can remain visible behind countdown or be turned off here if preferred
      // For now, let it be visible as it adds to the effect
    }, 2000); // Show static for 2 seconds before countdown

    return () => clearTimeout(staticTimer);
  }, [router]);

  const handleCountdownEnd = () => {
    setShowCountdown(false); // This will trigger dissolve via class for #pre-bday (1.5s)
    setTimeout(() => {
      setShowStatic(false); // Explicitly turn off static if it was still on
      setStage('video'); // NEW stage
    }, 1500); // Match the dissolve-animation duration (1.5s)
  };

  const handleVideoEnd = () => {
    setStage('gate');
    setShowPasswordGate(true);
  };
  

  const handleUnlock = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PASSWORD_GATE_KEY, 'true');
    }
    setShowPasswordGate(false); // This will hide the gate immediately
    setStage('portal');
    setShowPortal(true); // Portal animation starts (2.5s)
    
    // Wait for portal animation (2.5s) then redirect
    // Or redirect slightly before portal ends if preferred, current is 2s
    setTimeout(() => {
      setStage('redirecting');
      router.push('/main');
    }, 2000); // Redirecting after 2s of 2.5s portal animation
  };
  
  const CountdownTimerWithSuspense = () => (
    <Suspense fallback={
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-black/50 p-8">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
        <p className="font-digital text-2xl text-accent mt-4">Loading Timer...</p>
      </div>
    }>
      <CountdownTimer onCountdownEnd={handleCountdownEnd} />
    </Suspense>
  );

  if (stage === 'initial_load' || stage === 'redirecting') {
    return (
      <main className="relative min-h-screen w-full overflow-hidden">
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
          <Loader2 className="h-16 w-16 animate-spin text-accent" />
          <p className="mt-4 font-benguiat-style text-xl text-accent">
            {stage === 'redirecting' ? 'Entering the Upside Down...' : 'Initializing Protocol...'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* StaticNoise is managed by showStatic state */}
      <StaticNoise isActive={showStatic} /> 
      
      {/* Container for countdown, dissolves when showCountdown is false and not in static stage */}
      <div id="pre-bday" className={!showCountdown && stage !== 'static' && stage !== 'initial_load' ? 'dissolve-animation' : ''}>
        {stage === 'countdown' && showCountdown && <CountdownTimerWithSuspense />}
      </div>
      
      {stage === 'video' && <IntroVideo onEnd={handleVideoEnd} />}


      {stage === 'gate' && showPasswordGate && (
        <PasswordGate onUnlock={handleUnlock} />
      )}
      
      {stage === 'portal' && showPortal && <PortalAnimation />}
    </main>
  );
}
