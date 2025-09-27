//src/components/chatSheet.tsx
"use client";

import { useState, useTransition, useRef, useEffect, useCallback } from 'react';
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
import { MessageWithReactions, Reaction } from '@/lib/types';
import { useFormStatus } from 'react-dom';
import { pusherClient } from '@/lib/pusher/client';
import { useToast } from '@/hooks/use-toast';

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
    const isCurrentUser = msg.senderId === currentUserId;
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
            <div className={cn("flex items-start gap-3", isCurrentUser ? "justify-end" : "justify-start")}>
                {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{msg.senderName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div className="flex flex-col gap-1 items-end">
                    <div className={cn("max-w-xs rounded-lg p-3 text-sm relative", isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
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
                {isCurrentUser && (
                     <Avatar className="h-8 w-8">
                        <AvatarFallback>{msg.senderName?.charAt(0)}</AvatarFallback>
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
                            isCurrentUser ? "left-0 -translate-x-full" : "right-0 translate-x-full"
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


export function ChatSheet({ chatroomId, userId }: { chatroomId: string, userId: string }) {
  const [messages, setMessages] = useState<MessageWithReactions[]>([]);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const currentUserId = userId;
  const { toast } = useToast();

  const scrollToBottom = () => {
    setTimeout(() => {
        if(scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, 100);
  };

  useEffect(() => {
    const fetchMessages = () => {
      startTransition(async () => {
        try {
          const res = await getMessages(chatroomId);
          setMessages(res);
          scrollToBottom();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: 'Impossible de charger les messages.'
            })
        }
      });
    };
    fetchMessages();
  }, [chatroomId, toast]);

  const handleNewMessage = useCallback((newMessage: MessageWithReactions) => {
    setMessages(prev => {
        const messageExists = prev.some(msg => msg.id === newMessage.id);
        if (!messageExists) {
            return [...prev, newMessage];
        }
        return prev;
    });
    scrollToBottom();
  }, []);

  const handleReactionUpdate = useCallback(({ messageId, reactions }: { messageId: string, reactions: Reaction[] }) => {
    setMessages(prev => 
        prev.map(msg => 
            msg.id === messageId ? { ...msg, reactions } : msg
        )
    );
  }, []);

  useEffect(() => {
    if (!chatroomId) return;

    const channelName = `presence-chatroom-${chatroomId}`;
    try {
        const channel = pusherClient.subscribe(channelName);

        channel.bind('new-message', handleNewMessage);
        channel.bind('reaction-update', handleReactionUpdate);
        
        return () => {
            channel.unbind('new-message', handleNewMessage);
            channel.unbind('reaction-update', handleReactionUpdate);
            pusherClient.unsubscribe(channelName);
        };
    } catch (error) {
        console.error("Pusher subscription error:", error);
        toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: "Impossible de se connecter au chat en temps réel."
        });
    }

  }, [chatroomId, handleNewMessage, handleReactionUpdate, toast]);

  const handleReaction = (messageId: string, emoji: string) => {
    startTransition(async () => {
        await toggleReaction(messageId, emoji);
    });
  };
  
    const handleSendMessage = async (formData: FormData) => {
        const message = formData.get('message') as string;
        if (!message.trim()) return;
        formRef.current?.reset();
        await sendMessage(formData);
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
          <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
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
            <input type="hidden" name="chatroomId" value={chatroomId} />
            <Input
              name="message"
              placeholder="Écrivez un message..."
              autoComplete="off"
            />
            <SubmitButton />
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
