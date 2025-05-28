"use client";

import React, { useEffect, useState } from 'react';
import './SimpleConfetti.css'; // We'll create this CSS file

interface SimpleConfettiProps {
  isActive: boolean;
}

const SimpleConfetti: React.FC<SimpleConfettiProps> = ({ isActive }) => {
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="confetti-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            backgroundColor: `hsl(${Math.random() * 360}, 70%, 70%)`,
          }}
        />
      ));
      setParticles(newParticles);

      // Clear particles after animation
      const timer = setTimeout(() => setParticles([]), 5000); // Match animation duration
      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [isActive]);

  if (!isActive || particles.length === 0) return null;

  return <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">{particles}</div>;
};

export default SimpleConfetti;
