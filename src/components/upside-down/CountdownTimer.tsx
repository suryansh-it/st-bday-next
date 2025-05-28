
"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BIRTHDAY_DATE_STRING } from '@/config/constants';

interface CountdownTimerProps {
  onCountdownEnd: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ onCountdownEnd }) => {
  const searchParams = useSearchParams();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let targetDate: Date;
    if (searchParams?.get('test') === '1') {
      targetDate = new Date(Date.now() + 10000); // 10 seconds for testing countdown
    } else {
      targetDate = new Date(BIRTHDAY_DATE_STRING);
    }

    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return newTimeLeft;
    };

    setTimeLeft(calculateTimeLeft()); // Initial calculation

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(timer);
        onCountdownEnd();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient, onCountdownEnd, searchParams]);

  if (!isClient) {
    // Render placeholder or null on server to avoid hydration mismatch
    return (
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-black/50 p-8">
        <h2 className="font-digital text-5xl md:text-7xl lg:text-9xl text-accent animate-flicker mb-4">Loading Timer...</h2>
      </div>
    );
  }
  
  const format = (value: number) => String(value).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-black/50 p-8 text-center">
      <h2 className="font-digital text-5xl md:text-7xl lg:text-9xl text-accent animate-flicker mb-4">
        {`${format(timeLeft.days)}:${format(timeLeft.hours)}:${format(timeLeft.minutes)}:${format(timeLeft.seconds)}`}
      </h2>
      <p className="font-benguiat-style text-xl md:text-2xl text-foreground/80 animate-flicker">Until The Upside Down Opens...</p>
    </div>
  );
};

export default CountdownTimer;
