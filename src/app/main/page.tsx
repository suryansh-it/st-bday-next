
"use client"; 

import React from 'react';
import QuotesDisplay from '@/components/upside-down/QuotesDisplay';
import NotesArea from '@/components/upside-down/NotesArea'; // This will be the new advanced notes

export default function MainAppPage() {
  return (
    <div className="space-y-12"> {/* Increased spacing for better layout */}
      <QuotesDisplay />
      <NotesArea />
    </div>
  );
}
