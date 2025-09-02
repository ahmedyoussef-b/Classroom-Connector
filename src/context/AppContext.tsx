"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Student, Career, ChatMessage } from '@/lib/types';
import { STUDENTS, CAREERS } from '@/lib/data';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';

interface StudentState {
  careerId: string | null;
  isPunished: boolean;
}

interface AppContextType {
  students: Student[];
  careers: Career[];
  studentStates: Map<string, StudentState>;
  setStudentCareer: (studentId: string, careerId: string | null) => void;
  togglePunishment: (studentId: string) => void;
  messages: ChatMessage[];
  sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp' | 'reactions'>) => void;
  toggleReaction: (messageId: string, emoji: string, userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialStudentStates = new Map<string, StudentState>(
  STUDENTS.map(student => [student.id, { careerId: null, isPunished: false }])
);

const initialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'teacher',
    senderName: 'Professeur',
    message: 'Bienvenue dans la classe, tout le monde! Commençons notre leçon.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    reactions: { '👍': ['1', '2'] },
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [studentStates, setStudentStates] = useState(initialStudentStates);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const setStudentCareer = useCallback((studentId: string, careerId: string | null) => {
    setStudentStates(prevStates => {
      const newStates = new Map(prevStates);
      const currentState = newStates.get(studentId);
      if (currentState) {
        newStates.set(studentId, { ...currentState, careerId });
      }
      return newStates;
    });
  }, []);

  const togglePunishment = useCallback((studentId: string) => {
    setStudentStates(prevStates => {
      const newStates = new Map(prevStates);
      const currentState = newStates.get(studentId);
      if (currentState) {
        newStates.set(studentId, { ...currentState, isPunished: !currentState.isPunished });
      }
      return newStates;
    });
  }, []);

  const sendMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp' | 'reactions'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date(),
      reactions: {},
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  }, []);

  const toggleReaction = useCallback((messageId: string, emoji: string, userId: string) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          const newReactions = { ...(msg.reactions || {}) };
          const users = newReactions[emoji] || [];
          if (users.includes(userId)) {
            newReactions[emoji] = users.filter(u => u !== userId);
            if(newReactions[emoji].length === 0) {
              delete newReactions[emoji];
            }
          } else {
            newReactions[emoji] = [...users, userId];
          }
          return { ...msg, reactions: newReactions };
        }
        return msg;
      })
    );
  }, []);

  const value = {
    students: STUDENTS,
    careers: CAREERS,
    studentStates,
    setStudentCareer,
    togglePunishment,
    messages,
    sendMessage,
    toggleReaction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
