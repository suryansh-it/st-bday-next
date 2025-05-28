
"use client";

import React from 'react';
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; 
}

interface TrashViewProps {
  trashedNotes: Note[];
  onRestoreNote: (id: string) => void;
  onDeletePermanently: (id: string) => void;
  onEmptyTrash: () => void;
  onCloseTrashView: () => void;
}

const TrashView: FC<TrashViewProps> = ({
  trashedNotes,
  onRestoreNote,
  onDeletePermanently,
  onEmptyTrash,
  onCloseTrashView,
}) => {
  if (!trashedNotes || trashedNotes.length === 0) {
    return (
      <Card className="vhs-overlay bg-card/70 border-border/70 mt-6">
        <CardHeader>
          <CardTitle className="font-benguiat-style text-glitch text-accent flex items-center">
            <Trash2 className="mr-3 h-7 w-7" />
            Recycle Bin: Empty
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8 font-digital text-lg">
            No logs in the recycle bin.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" onClick={onCloseTrashView} className="button-thump">
            Back to Observations
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="vhs-overlay bg-card/70 border-primary/30 mt-6 shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="font-benguiat-style text-glitch text-primary flex items-center">
          <Trash2 className="mr-3 h-7 w-7" />
          Recycle Bin: Deleted Logs
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={onEmptyTrash}
            className="button-thump"
            disabled={trashedNotes.length === 0}
          >
            <span className="icon-hover-glow-destructive"><AlertTriangle className="mr-1.5 h-4 w-4" /></span> Empty Trash
          </Button>
          <Button variant="outline" size="sm" onClick={onCloseTrashView} className="button-thump">
            Back to Observations
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TooltipProvider>
              {trashedNotes.map(note => (
                <Card
                  key={note.id}
                  className="vhs-overlay bg-card/60 border-border/50 flex flex-col justify-between"
                >
                  <CardHeader>
                    <CardTitle className="font-benguiat-style text-lg text-muted-foreground break-words">{note.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-card-foreground/80 whitespace-pre-wrap break-words line-clamp-4">
                      {note.content || "No detailed content."}
                    </p>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-muted-foreground/70 pt-4 border-t border-border/30 mt-auto">
                    <div className="flex flex-col">
                      <span>Original: {format(new Date(note.createdAt), 'MMM d, yyyy HH:mm')}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 sm:justify-end">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onRestoreNote(note.id)}
                            className="button-thump border-accent text-accent hover:bg-accent/10 hover:text-accent h-9 w-9"
                          >
                            <span className="icon-hover-glow-accent"><RotateCcw className="h-4 w-4" /></span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-accent text-accent-foreground">
                          <p>Restore</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => onDeletePermanently(note.id)}
                            className="button-thump h-9 w-9" 
                          >
                            <span className="icon-hover-glow-destructive"><Trash2 className="h-4 w-4" /></span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-destructive text-destructive-foreground">
                          <p>Delete Forever</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </TooltipProvider>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TrashView;

