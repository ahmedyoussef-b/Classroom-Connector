"use client";

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from './ui/button';
import { MessageCircle, Send } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function ChatSheet() {
  const { messages, sendMessage, students } = useApp();
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage({
        senderId: 'teacher',
        senderName: 'Professeur',
        message: newMessage.trim(),
      });
      setNewMessage('');
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <MessageCircle className="mr-2 h-4 w-4" /> Ouvrir le Chat
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Chat de la classe</SheetTitle>
          <SheetDescription>
            Discussion en temps réel avec vos élèves.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="space-y-4 py-4">
              {messages.map((msg) => {
                const isTeacher = msg.senderId === 'teacher';
                const student = !isTeacher ? students.find(s => s.id === msg.senderId) : null;
                return (
                  <div key={msg.id} className={cn("flex items-start gap-3", isTeacher ? "justify-end" : "justify-start")}>
                    {!isTeacher && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{student?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn("max-w-xs rounded-lg p-3 text-sm", isTeacher ? "bg-primary text-primary-foreground" : "bg-muted")}>
                      <p className="font-bold">{msg.senderName}</p>
                      <p className="mt-1">{msg.message}</p>
                      <p className="mt-2 text-xs opacity-60 text-right">{format(msg.timestamp, 'p')}</p>
                    </div>
                     {isTeacher && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>P</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="flex gap-2 border-t pt-4">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrivez un message..."
              autoComplete="off"
            />
            <Button type="submit" size="icon" aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
