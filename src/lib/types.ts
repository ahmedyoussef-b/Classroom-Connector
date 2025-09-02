import type { LucideIcon } from "lucide-react";

export interface Career {
  id: string;
  name: string;
  description: string;
  theme: {
    backgroundColor: string;
    backgroundImage: string;
    primaryColor: string;
    accentColor: string;
    textColor: string;
    icon: LucideIcon;
    cursor: string;
  };
}

export interface Student {
  id: string;
  name: string;
  ambition: string;
}

export interface ChatMessage {
  id: string;
  senderId: string; // 'teacher' or student's id
  senderName: string;
  message: string;
  timestamp: Date;
  reactions?: { [emoji: string]: string[] };
}
