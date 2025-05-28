"use client";

import React, { useEffect, useRef } from 'react';

interface StaticNoiseProps {
  isActive: boolean;
}

const StaticNoise: React.FC<StaticNoiseProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrameId: number;

    const drawStatic = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const randomColor = Math.random() > 0.5 ? 255 : 0;
        data[i] = randomColor;     // Red
        data[i + 1] = randomColor; // Green
        data[i + 2] = randomColor; // Blue
        data[i + 3] = 255;         // Alpha
      }
      ctx.putImageData(imageData, 0, 0);
      animationFrameId = requestAnimationFrame(drawStatic);
    };

    drawStatic();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive]);

  if (!isActive) return null;

  return <canvas ref={canvasRef} id="static-canvas" className="fixed inset-0 z-0 pointer-events-none" />;
};

export default StaticNoise;
