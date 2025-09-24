"use client";

import { useState, useTransition, useRef, useEffect } from 'react';
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
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { EmojiPicker } from './EmojiPicker';
import { getMessages, sendMessage, toggleReaction } from '@/lib/actions';
import { MessageWithReactions } from '@/lib/types';
import { useFormStatus } from 'react-dom';

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

function Message({ msg, currentUserId, onReaction }: { msg: MessageWithReactions, currentUserId: string, onReaction: (emoji: string) => void }) {
    const isTeacher = msg.senderId === 'teacher-id'; // Assume a fixed teacher ID for now
    const reactionsByEmoji: { [key: string]: string[] } = {};
    
    msg.reactions.forEach(r => {
        if (!reactionsByEmoji[r.emoji]) {
            reactionsByEmoji[r.emoji] = [];
        }
        reactionsByEmoji[r.emoji].push(r.userId);
    });

    const reactionEntries = Object.entries(reactionsByEmoji);

    return (
        <div className="group relative">
            <div className={cn("flex items-start gap-3", isTeacher ? "justify-end" : "justify-start")}>
                {!isTeacher && (
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{msg.senderName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div className="flex flex-col gap-1 items-end">
                    <div className={cn("max-w-xs rounded-lg p-3 text-sm relative", isTeacher ? "bg-primary text-primary-foreground" : "bg-muted")}>
                        <p className="font-bold">{msg.senderName}</p>
                        <p className="mt-1">{msg.message}</p>
                        <p className="mt-2 text-xs opacity-60 text-right">{format(new Date(msg.createdAt), 'p')}</p>
                    </div>
                     {reactionEntries.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                            {reactionEntries.map(([emoji, users]) => (
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
                    <EmojiPicker onEmojiSelect={onReaction} />
                </PopoverContent>
            </Popover>
        </div>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="icon" aria-label="Send message" disabled={pending}>
          <Send className="h-4 w-4" />
        </Button>
    )
}


export function ChatSheet({ chatroomId }: { chatroomId: string }) {
  const [messages, setMessages] = useState<MessageWithReactions[]>([]);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  // In a real app, you'd get this from auth context
  const currentUserId = 'teacher-id'; 

  useEffect(() => {
    const fetchMessages = () => {
      startTransition(async () => {
        const res = await getMessages(chatroomId);
        setMessages(res);
      });
    };
    fetchMessages();
  }, [chatroomId]);


  const handleReaction = (messageId: string, emoji: string) => {
    startTransition(async () => {
        // Optimistic UI update
        const newMessages = messages.map(msg => {
            if (msg.id === messageId) {
                const newReactions = [...msg.reactions];
                const existingIndex = newReactions.findIndex(r => r.emoji === emoji && r.userId === currentUserId);
                if (existingIndex > -1) {
                    newReactions.splice(existingIndex, 1);
                } else {
                    newReactions.push({ id: 'temp', emoji, userId: currentUserId, messageId });
                }
                return { ...msg, reactions: newReactions };
            }
            return msg;
        });
        setMessages(newMessages);
        
        // Call server action
        await toggleReaction(messageId, emoji, currentUserId);
        
        // Re-fetch to confirm
        const updatedMessages = await getMessages(chatroomId);
        setMessages(updatedMessages);
    });
  };
  
    const handleSendMessage = async (formData: FormData) => {
        const message = formData.get('message') as string;
        if (!message.trim()) return;

        startTransition(async () => {
             // Optimistic UI update
            const tempId = `temp-${Date.now()}`;
            const newMessage: MessageWithReactions = {
                id: tempId,
                message: message,
                senderId: currentUserId,
                senderName: 'Moi',
                chatroomId,
                createdAt: new Date(),
                reactions: [],
            };
            setMessages(prev => [...prev, newMessage]);
            formRef.current?.reset();

            await sendMessage(formData);

            // Re-fetch to confirm and get real ID
            const updatedMessages = await getMessages(chatroomId);
            setMessages(updatedMessages);
        });
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
                <Message key={msg.id} msg={msg} currentUserId={currentUserId} onReaction={(emoji) => handleReaction(msg.id, emoji)} />
              ))}
            </div>
          </ScrollArea>
          <form 
            ref={formRef}
            action={handleSendMessage} 
            className="flex gap-2 border-t pt-4"
          >
            <input type="hidden" name="senderId" value={currentUserId} />
            <input type="hidden" name="chatroomId" value={chatroomId} />
            <Input
              name="message"
              placeholder="Écrivez un message..."
              autoComplete="off"
              disabled={isPending}
            />
            <SubmitButton />
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
