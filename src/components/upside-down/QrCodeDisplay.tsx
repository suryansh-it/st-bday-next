"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QRCode from 'qrcode.react';

const QrCodeDisplay: React.FC = () => {
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppUrl(window.location.origin); // Or a specific event link
    }
  }, []);

  return (
    <Card className="vhs-overlay">
      <CardHeader>
        <CardTitle className="font-benguiat-style text-glitch text-accent">Signal Boost (QR)</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <p className="text-muted-foreground text-center">Share this frequency with other survivors.</p>
        {appUrl ? (
          <div className="p-4 bg-background rounded-md shadow-inner">
            <QRCode
              value={appUrl}
              size={192} // Increased size
              bgColor="hsl(var(--background))"
              fgColor="hsl(var(--accent))"
              level="H"
              imageSettings={{ // Optional: add a small logo in the center
                src: "https://placehold.co/40x40/0A0A30/7DF9FF.png&text=ST", // Placeholder icon
                excavate: true,
                width: 30,
                height: 30,
              }}
            />
          </div>
        ) : (
          <p className="text-accent">Generating signal...</p>
        )}
        {appUrl && <p className="text-xs text-muted-foreground break-all text-center">{appUrl}</p>}
      </CardContent>
    </Card>
  );
};

export default QrCodeDisplay;
