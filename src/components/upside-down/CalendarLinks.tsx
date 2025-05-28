"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BIRTHDAY_DATE_STRING, USER_NAME } from '@/config/constants';
import { CalendarPlus, Share2 } from 'lucide-react';

const CalendarLinks: React.FC = () => {
  const birthdayDate = new Date(BIRTHDAY_DATE_STRING);
  const eventTitle = `${USER_NAME}'s Upside Down BDay!`;
  const eventDescription = `Celebrate ${USER_NAME}'s birthday, Stranger Things style!`;

  const formatDateForGoogle = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const generateICSContent = () => {
    const startDate = formatDateForGoogle(birthdayDate);
    // Assuming a 1-hour event for .ics
    const endDate = formatDateForGoogle(new Date(birthdayDate.getTime() + 60 * 60 * 1000));

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//UpsideDownBDay//NONSGML v1.0//EN',
      'BEGIN:VEVENT',
      `UID:${startDate}-${endDate}@upsidedownbday.com`,
      `DTSTAMP:${formatDateForGoogle(new Date())}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${eventTitle}`,
      `DESCRIPTION:${eventDescription}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
  };

  const handleDownloadICS = () => {
    const icsContent = generateICSContent();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'upside_down_bday.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleGoogleCalendar = () => {
    const googleStartDate = formatDateForGoogle(birthdayDate);
    const googleEndDate = formatDateForGoogle(new Date(birthdayDate.getTime() + 60 * 60 * 1000)); // 1 hour duration
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${googleStartDate}/${googleEndDate}&details=${encodeURIComponent(eventDescription)}`;
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <Card className="vhs-overlay">
      <CardHeader>
        <CardTitle className="font-benguiat-style text-glitch text-accent">Event Horizon Calendar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">Don't get lost in the Upside Down. Mark your calendar!</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleDownloadICS} className="w-full sm:w-auto bg-primary hover:bg-primary/90 button-thump">
            <CalendarPlus className="mr-2 h-5 w-5" /> Download .ICS File
          </Button>
          <Button onClick={handleGoogleCalendar} variant="outline" className="w-full sm:w-auto border-accent text-accent hover:bg-accent/10 hover:text-accent button-thump">
            <Share2 className="mr-2 h-5 w-5" /> Add to Google Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarLinks;
