
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STRANGER_THINGS_QUOTES } from '@/config/constants';
import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

const QuotesDisplay: React.FC = () => {
  const [quote, setQuote] = useState('');

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * STRANGER_THINGS_QUOTES.length);
    return STRANGER_THINGS_QUOTES[randomIndex];
  };
  
  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  const handleNewQuote = () => {
    setQuote(getRandomQuote());
  }

  return (
    <Card className="vhs-overlay">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-benguiat-style text-glitch text-accent">Wisdom from Hawkins</CardTitle>
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNewQuote} 
            aria-label="New Quote" 
            className="button-thump text-accent hover:text-accent/70 hover:bg-transparent"
        >
            <span className="icon-hover-glow-accent"><RefreshCw className="h-5 w-5"/></span>
        </Button>
      </CardHeader>
      <CardContent>
        {quote ? (
          <blockquote className="text-lg italic text-foreground/90 border-l-4 border-accent pl-4 py-2">
            "{quote}"
          </blockquote>
        ) : (
          <p className="text-muted-foreground">Loading wisdom...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default QuotesDisplay;
