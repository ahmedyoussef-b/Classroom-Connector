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
import { MessageCircle, Send, SmilePlus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { EmojiPicker } from './EmojiPicker';
import type { ChatMessage } from '@/lib/types';

function ReactionBubble({ emoji, count, hasReacted }: { emoji: string, count: number, hasReacted: boolean }) {
    return (
        <div className={cn(
            "rounded-full px-2 py-0.5 text-xs flex items-center gap-1",
            hasReacted ? "bg-primary/20 border border-primary" : "bg-muted border"
        )}>
            <span>{emoji}</span>
            <span>{count}</span>
        </div>
    )
}

function Message({ msg, currentUserId }: { msg: ChatMessage, currentUserId: string }) {
    const { students, toggleReaction } = useApp();
    const isTeacher = msg.senderId === 'teacher';
    const student = !isTeacher ? students.find(s => s.id === msg.senderId) : null;

    const handleEmojiSelect = (emoji: string) => {
        toggleReaction(msg.id, emoji, currentUserId);
    };

    const reactions = msg.reactions && Object.entries(msg.reactions).filter(([, users]) => users.length > 0);

    return (
        <div className="group relative">
            <div className={cn("flex items-start gap-3", isTeacher ? "justify-end" : "justify-start")}>
                {!isTeacher && (
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{student?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div className="flex flex-col gap-1 items-end">
                    <div className={cn("max-w-xs rounded-lg p-3 text-sm relative", isTeacher ? "bg-primary text-primary-foreground" : "bg-muted")}>
                        <p className="font-bold">{msg.senderName}</p>
                        <p className="mt-1">{msg.message}</p>
                        <p className="mt-2 text-xs opacity-60 text-right">{format(msg.timestamp, 'p')}</p>
                    </div>
                     {reactions && reactions.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                            {reactions.map(([emoji, users]) => (
                                <ReactionBubble key={emoji} emoji={emoji} count={users.length} hasReacted={users.includes(currentUserId)} />
                            ))}
                        </div>
                    )}
                </div>
                {isTeacher && (
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>P</AvatarFallback>
                    </Avatar>
                )}
            </div>
             <Popover>
                <PopoverTrigger asChild>
                     <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "absolute top-0 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                            isTeacher ? "left-0 -translate-x-full" : "right-0 translate-x-full"
                        )}
                    >
                        <SmilePlus className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-0">
                    <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                </PopoverContent>
            </Popover>
        </div>
    )
}


export function ChatSheet() {
  const { messages, sendMessage } = useApp();
  const [newMessage, setNewMessage] = useState('');
  
  // In a real app, you'd get this from auth context
  const currentUserId = 'teacher'; 

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage({
        senderId: currentUserId,
        senderName: currentUserId === 'teacher' ? 'Professeur' : 'Current Student',
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
            <div className="space-y-6 py-4">
              {messages.map((msg) => (
                <Message key={msg.id} msg={msg} currentUserId={currentUserId} />
              ))}
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
