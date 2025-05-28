
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useLocalStorage from '@/hooks/useLocalStorage';
import { PlusCircle, Save, Trash2, BrainCircuit, Edit3, XCircle, X, Archive } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import TrashView from './TrashView'; 

const NOTES_STORAGE_KEY = 'upsideDownLabNotes_v2';
const TRASH_STORAGE_KEY = 'upsideDownLabNotes_trash_v1';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const NotesArea: React.FC = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>(NOTES_STORAGE_KEY, []);
  const [trashedNotes, setTrashedNotes] = useLocalStorage<Note[]>(TRASH_STORAGE_KEY, []);
  
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isEditingActiveNote, setIsEditingActiveNote] = useState<boolean>(false);
  const [currentEditTitle, setCurrentEditTitle] = useState('');
  const [currentEditContent, setCurrentEditContent] = useState('');

  const [showTrashView, setShowTrashView] = useState(false);

  const sortNotesByDate = (notesToSort: Note[]) => {
    return [...notesToSort].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  useEffect(() => {
    setNotes(prev => sortNotesByDate(prev));
    setTrashedNotes(prev => sortNotesByDate(prev));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleAddNote = () => {
    if (!newTitle.trim() && !newContent.trim()) {
      return;
    }
    const newNote: Note = {
      id: Date.now().toString(),
      title: newTitle.trim() || "Untitled Observation",
      content: newContent.trim(),
      createdAt: new Date().toISOString(),
    };
    setNotes(prev => sortNotesByDate([newNote, ...prev]));
    setNewTitle('');
    setNewContent('');
    setShowAddForm(false);
  };

  const handleDeleteNote = (id: string) => {
    const noteToDelete = notes.find(note => note.id === id);
    if (noteToDelete) {
      setNotes(prevNotes => sortNotesByDate(prevNotes.filter(note => note.id !== id)));
      setTrashedNotes(prevTrashed => sortNotesByDate([{ ...noteToDelete }, ...prevTrashed]));
      
      if (activeNoteId === id) {
        setActiveNoteId(null);
        setIsEditingActiveNote(false);
      }
    }
  };

  const handleRestoreFromTrash = (id: string) => {
    const noteToRestore = trashedNotes.find(note => note.id === id);
    if (noteToRestore) {
      setTrashedNotes(prevTrashed => sortNotesByDate(prevTrashed.filter(note => note.id !== id)));
      setNotes(prevNotes => sortNotesByDate([noteToRestore, ...prevNotes]));
    }
  };

  const handleDeletePermanently = (id: string) => {
    setTrashedNotes(prevTrashed => sortNotesByDate(prevTrashed.filter(note => note.id !== id)));
  };

  const handleEmptyTrash = () => {
    setTrashedNotes([]);
  };

  const handleCardClick = (note: Note) => {
    if (activeNoteId !== note.id) {
      setActiveNoteId(note.id);
      setIsEditingActiveNote(false); 
      setCurrentEditTitle(note.title);
      setCurrentEditContent(note.content);
      setShowAddForm(false); 
      setShowTrashView(false); 
    }
  };

  const handleStartEdit = () => {
    setIsEditingActiveNote(true);
  };

  const handleSaveEdit = () => {
    if (activeNoteId) {
      setNotes(prevNotes =>
        sortNotesByDate(
          prevNotes.map(note =>
            note.id === activeNoteId
              ? { ...note, title: currentEditTitle.trim() || "Untitled Observation", content: currentEditContent.trim(), createdAt: new Date().toISOString() } 
              : note
          )
        )
      );
      setIsEditingActiveNote(false); 
    }
  };

  const handleCancelEdit = () => {
    const originalNote = notes.find(n => n.id === activeNoteId);
    if (originalNote) {
      setCurrentEditTitle(originalNote.title);
      setCurrentEditContent(originalNote.content);
    }
    setIsEditingActiveNote(false); 
  };
  
  const handleCloseActiveNote = () => {
    setActiveNoteId(null);
    setIsEditingActiveNote(false);
  };

  const toggleAddForm = () => {
    if (showAddForm) {
      setShowAddForm(false);
    } else {
      setActiveNoteId(null); 
      setIsEditingActiveNote(false);
      setShowTrashView(false); 
      setShowAddForm(true);
    }
  };

  const toggleTrashView = () => {
    if (showTrashView) {
        setShowTrashView(false);
    } else {
        setActiveNoteId(null); 
        setIsEditingActiveNote(false);
        setShowAddForm(false); 
        setShowTrashView(true);
    }
  };

  const activeNoteObject = notes.find(note => note.id === activeNoteId);

  if (showTrashView) {
    return (
      <TrashView
        trashedNotes={trashedNotes}
        onRestoreNote={handleRestoreFromTrash}
        onDeletePermanently={handleDeletePermanently}
        onEmptyTrash={handleEmptyTrash}
        onCloseTrashView={() => setShowTrashView(false)}
      />
    );
  }

  return (
    <Card className="vhs-overlay shadow-2xl border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="font-benguiat-style text-glitch text-primary flex items-center">
          <BrainCircuit className="mr-3 h-7 w-7" />
          Research Terminal: Observations
        </CardTitle>
        <div className="flex gap-2">
          <Button
              variant="outline"
              size="sm"
              onClick={toggleAddForm}
              className="button-thump border-accent text-accent hover:bg-accent/10 hover:text-accent"
          >
            <span className="icon-hover-glow-accent"><PlusCircle className="mr-1.5 h-4 w-4" /></span>
            <span className="text-hover-flicker">{showAddForm ? 'Cancel Log Entry' : 'New Log Entry'}</span>
          </Button>
          <Button
              variant="outline"
              size="sm" 
              onClick={toggleTrashView}
              className="button-thump border-muted-foreground text-muted-foreground hover:bg-muted/20 hover:text-foreground"
          >
              <span className="icon-hover-glow-accent"><Archive className="mr-1.5 h-4 w-4" /></span>
              <span className="text-hover-flicker">Trash ({trashedNotes.length})</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {showAddForm && (
          <Card className={cn(
            "bg-card/50 border-border/50 p-4 space-y-3 md:col-span-2 lg:col-span-3",
            "animate-pulse-glow_once_short"
          )}>
            <Input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Log Title (e.g., Energy Fluctuations, Subject Eleven Behavior)"
              className="font-digital bg-input/70 border-accent/50 focus:ring-accent placeholder-accent/70 text-foreground"
            />
            <Textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Record your findings, theories, cryptic messages heard through the static..."
              rows={5}
              className="font-digital bg-input/70 border-accent/50 focus:ring-accent placeholder-accent/70 text-foreground"
            />
            <div className="flex justify-end">
              <Button onClick={handleAddNote} className="bg-accent text-accent-foreground hover:bg-accent/90 button-thump">
                <span className="icon-hover-glow-accent"><Save className="mr-2 h-4 w-4" /></span>
                <span className="text-hover-flicker">Commit Log Entry</span>
              </Button>
            </div>
          </Card>
        )}

        {((notes.length > 0) && (showAddForm || activeNoteId)) && <Separator className="my-6 border-border/30" />}
        {(notes.length > 0 && !showAddForm && !activeNoteId) && <Separator className="my-2 border-border/30" />}


        {!activeNoteId && !showAddForm && notes.length === 0 && (
          <p className="text-center text-muted-foreground py-8 font-digital text-lg">
            No logs recorded. Begin your investigation.
          </p>
        )}

        {activeNoteObject && !showAddForm ? (
          <Card
            key={activeNoteObject.id}
            className={cn(
              "vhs-overlay bg-card/80 border-2 border-accent shadow-accent/30 shadow-lg scale-[1.01] z-10 flex flex-col",
              "md:col-span-2 lg:col-span-3", 
              "transition-all duration-300 ease-in-out animate-pulse-glow_once_short" 
            )}
          >
            <CardHeader>
              {isEditingActiveNote ? (
                <Input
                  value={currentEditTitle}
                  onChange={(e) => setCurrentEditTitle(e.target.value)}
                  placeholder="Log Title"
                  className="font-benguiat-style text-xl text-primary/90 bg-input/80 border-accent/60 focus:ring-accent focus:border-accent"
                />
              ) : (
                <CardTitle className="font-benguiat-style text-xl text-primary/90 break-words">{activeNoteObject.title}</CardTitle>
              )}
            </CardHeader>
            <CardContent className="flex-grow min-h-[200px]">
              {isEditingActiveNote ? (
                <Textarea
                  value={currentEditContent}
                  onChange={(e) => setCurrentEditContent(e.target.value)}
                  placeholder="Record your findings, theories, cryptic messages..."
                  rows={8} 
                  className="font-digital text-sm bg-input/80 border-accent/60 focus:ring-accent focus:border-accent placeholder-accent/70 text-foreground h-full"
                />
              ) : (
                <ScrollArea className="h-[250px] md:h-[300px] pr-4">
                  <p className="text-sm text-card-foreground whitespace-pre-wrap break-words">
                    {activeNoteObject.content || "No detailed content."}
                  </p>
                </ScrollArea>
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap justify-between items-center gap-2 pt-4 border-t border-border/50 mt-auto bg-card/80">
              <span className="text-xs text-muted-foreground">
                Last entry: {format(new Date(activeNoteObject.createdAt), 'MMM d, yyyy HH:mm')}
              </span>
              <div className="flex flex-wrap gap-2">
                {isEditingActiveNote ? (
                  <>
                    <Button variant="ghost" onClick={handleCancelEdit} className="button-thump text-muted-foreground hover:text-foreground">
                      <span className="icon-hover-glow-accent"><XCircle className="mr-1.5 h-4 w-4"/></span> Cancel
                    </Button>
                    <Button onClick={handleSaveEdit} className="bg-accent text-accent-foreground hover:bg-accent/90 button-thump">
                       <span className="icon-hover-glow-accent"><Save className="mr-1.5 h-4 w-4"/></span> Save Changes
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={handleStartEdit} className="button-thump border-accent text-accent hover:bg-accent/10 hover:text-accent">
                     <span className="icon-hover-glow-accent"><Edit3 className="mr-1.5 h-4 w-4"/></span> Edit
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteNote(activeNoteObject.id)}
                  className="button-thump"
                >
                  <span className="icon-hover-glow-destructive"><Trash2 className="mr-1.5 h-4 w-4" /></span> Delete
                </Button>
                <Button variant="outline" onClick={handleCloseActiveNote} className="button-thump text-muted-foreground hover:text-foreground">
                   <span className="icon-hover-glow-accent"><X className="mr-1.5 h-4 w-4" /></span> Close
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : (
          !showAddForm && notes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map(note => (
                <Card
                  key={note.id}
                  className="vhs-overlay bg-card/70 border-border/70 flex flex-col justify-between note-card-interactive cursor-pointer"
                  onClick={() => handleCardClick(note)}
                >
                  <CardHeader>
                    <CardTitle className="font-benguiat-style text-lg text-primary/90 break-words">{note.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-card-foreground whitespace-pre-wrap break-words line-clamp-4">
                      {note.content || "No detailed content."}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center text-xs text-muted-foreground pt-4 border-t border-border/30 mt-auto">
                    <span>{format(new Date(note.createdAt), 'MMM d, yyyy HH:mm')}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleDeleteNote(note.id);
                      }}
                      className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 button-thump h-7 w-7"
                      aria-label="Delete note"
                    >
                      <span className="icon-hover-glow-destructive"><Trash2 className="h-4 w-4" /></span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default NotesArea;
