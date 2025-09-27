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
import { MessageCircle, Send, SmilePlus, Clock, AlertCircle } from 'lucide-react';
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
import { useSession } from 'next-auth/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

function ReactionBubble({ emoji, count, hasReacted }: { emoji: string, count: number, hasReacted: boolean }) {
    return (
        <div className={cn(
            "rounded-full px-2 py-0.5 text-xs flex items-center gap-1 cursor-pointer",
            hasReacted ? "bg-primary/20 border border-primary" : "bg-muted border"
        )}>
            <span>{emoji}</span>
            <span>{count}</span>
        </div>
    )
}

function Message({ msg, currentUserId, onReaction, onResend }: { msg: MessageWithReactions, currentUserId: string, onReaction: (emoji: string) => void, onResend: () => void }) {
    const isCurrentUser = msg.senderId === currentUserId;
    const reactionsByEmoji: { [key: string]: string[] } = {};
    
    msg.reactions.forEach(r => {
        if (!reactionsByEmoji[r.emoji]) {
            reactionsByEmoji[r.emoji] = [];
        }
        reactionsByEmoji[r.emoji].push(r.userId);
    });

    const reactionEntries = Object.entries(reactionsByEmoji);
    const messageTime = msg.status === 'pending' ? <Clock className="h-3 w-3" /> : format(new Date(msg.createdAt), 'p');

    return (
        <div className={cn("group relative", msg.status && "opacity-80")}>
            <div className={cn("flex items-start gap-3", isCurrentUser ? "justify-end" : "justify-start")}>
                {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{msg.senderName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div className="flex flex-col gap-1 items-end max-w-xs">
                    <div className={cn("rounded-lg p-3 text-sm relative", isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
                        {!isCurrentUser && <p className="font-bold">{msg.senderName}</p>}
                        <p className="mt-1 whitespace-pre-wrap">{msg.message}</p>
                        <p className="mt-2 text-xs opacity-60 text-right">{messageTime}</p>
                    </div>
                     {reactionEntries.length > 0 && (
                        <div className="flex gap-1 flex-wrap justify-end">
                            {reactionEntries.map(([emoji, users]) => (
                               <TooltipProvider key={emoji} delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div onClick={() => onReaction(emoji)}>
                                             <ReactionBubble emoji={emoji} count={users.length} hasReacted={users.includes(currentUserId)} />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{users.join(', ')}</p>
                                    </TooltipContent>
                                </Tooltip>
                               </TooltipProvider>
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
            {msg.status === 'failed' && (
                 <div className={cn("absolute top-0 flex items-center gap-2", isCurrentUser ? "left-0 -translate-x-full" : "right-0 translate-x-full")}>
                     <AlertCircle className="h-4 w-4 text-destructive" />
                     <Button variant="link" size="sm" className="text-destructive" onClick={onResend}>
                         Renvoyer
                     </Button>
                 </div>
             )}
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
  const { data: session } = useSession();
  const currentUserId = userId;
  const { toast } = useToast();

  const scrollToBottom = useCallback((behavior: 'smooth' | 'auto' = 'smooth') => {
    setTimeout(() => {
        if(scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior });
        }
    }, 100);
  }, []);

  useEffect(() => {
    // Test de connexion Pusher
    pusherClient.connection.bind('connected', () => {
        console.log('✅ [PUSHER] Connected to Pusher');
    });

    pusherClient.connection.bind('error', (error: any) => {
        console.error('❌ [PUSHER] Connection error FULL DETAILS:', JSON.stringify(error, null, 2));
        console.error('❌ [PUSHER] Error data content:', error.data);
    });
  }, []);

  useEffect(() => {
    const fetchMessages = () => {
      startTransition(async () => {
        try {
          const res = await getMessages(chatroomId);
          setMessages(res);
          scrollToBottom('auto');
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
  }, [chatroomId, toast, scrollToBottom]);
  
  const handleNewMessage = useCallback((newMessage: MessageWithReactions) => {
    console.log("📨 [CLIENT] Received 'new-message':", newMessage);
    setMessages(prev => {
        // If the message is from the current user and it was pending, update it.
        // Otherwise, add the new message.
        const pendingMessageIndex = prev.findIndex(msg => msg.status === 'pending' && msg.senderId === newMessage.senderId);
        if (pendingMessageIndex !== -1) {
            const newMessages = [...prev];
            newMessages[pendingMessageIndex] = newMessage;
            return newMessages;
        }

        const messageExists = prev.some(msg => msg.id === newMessage.id);
        if (!messageExists) {
            return [...prev, newMessage];
        }
        return prev;
    });
    scrollToBottom();
  }, [scrollToBottom]);

  const handleReactionUpdate = useCallback(({ messageId, reactions }: { messageId: string, reactions: Reaction[] }) => {
    console.log(`👍 [CLIENT] Received 'reaction-update' for message ${messageId}:`, reactions);
    setMessages(prev => 
        prev.map(msg => 
            msg.id === messageId ? { ...msg, reactions } : msg
        )
    );
  }, []);

  useEffect(() => {
    if (!chatroomId) return;

    const channelName = `private-chatroom-${chatroomId}`;
    try {
        console.log(`🔌 [CLIENT] Subscribing to channel: ${channelName}`);
        const channel = pusherClient.subscribe(channelName);
        
        channel.bind('pusher:subscription_succeeded', () => {
            console.log(`✅ [CLIENT] Successfully subscribed to ${channelName}`);
        });
        
        channel.bind('pusher:subscription_error', (status: any) => {
            console.error(`🚫 [CLIENT] Failed to subscribe to ${channelName}:`, status);
        });

        channel.bind('new-message', handleNewMessage);
        channel.bind('reaction-update', handleReactionUpdate);
        
        return () => {
            console.log(`🔌 [CLIENT] Unsubscribing from channel: ${channelName}`);
            channel.unbind_all();
            pusherClient.unsubscribe(channelName);
        };
    } catch (error) {
        console.error("💥 Pusher subscription error:", error);
        toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: "Impossible de se connecter au chat en temps réel."
        });
    }

  }, [chatroomId, handleNewMessage, handleReactionUpdate, toast]);

  const handleReaction = (messageId: string, emoji: string) => {
    // Optimistic update for reactions could be added here, but for now we rely on the server push
    startTransition(async () => {
        await toggleReaction(messageId, emoji);
    });
  };
  
  const handleSendMessage = async (formData: FormData, tempId: string) => {
    try {
        const confirmedMessage = await sendMessage(formData);
        setMessages(prev => prev.map(msg => msg.id === tempId ? confirmedMessage : msg));
    } catch (error) {
        console.error("Failed to send message", error);
        setMessages(prev => prev.map(msg => msg.id === tempId ? { ...msg, status: 'failed' } : msg));
        toast({
            variant: "destructive",
            title: "Erreur d'envoi",
            description: "Votre message n'a pas pu être envoyé."
        });
    }
  };

  const submitMessage = (formData: FormData) => {
    const messageContent = formData.get('message') as string;
    if (!messageContent.trim() || !session?.user) return;
    
    formRef.current?.reset();
    
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: MessageWithReactions = {
        id: tempId,
        message: messageContent,
        senderId: session.user.id,
        senderName: session.user.name ?? 'Moi',
        chatroomId: chatroomId,
        createdAt: new Date(),
        reactions: [],
        status: 'pending'
    };
    
    console.log("⏳ [CLIENT] Optimistically adding message:", optimisticMessage);
    setMessages(prev => [...prev, optimisticMessage]);
    scrollToBottom();
    
    handleSendMessage(formData, tempId);
  }

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
                <Message 
                    key={msg.id} 
                    msg={msg} 
                    currentUserId={currentUserId} 
                    onReaction={(emoji) => handleReaction(msg.id, emoji)}
                    onResend={() => {
                        const formData = new FormData();
                        formData.append('message', msg.message);
                        formData.append('chatroomId', msg.chatroomId);
                        handleSendMessage(formData, msg.id)
                    }}
                />
              ))}
            </div>
          </ScrollArea>
          <form 
            ref={formRef}
            action={submitMessage} 
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
