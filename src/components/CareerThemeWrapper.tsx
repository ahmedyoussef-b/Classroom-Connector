
//src/components/CareerThemeWrapper.tsx
"use client";

import type { Metier } from '@prisma/client';
import React from 'react';
import { cn } from '@/lib/utils';
import placeholderImages from '@/lib/placeholder-images.json';


interface CareerThemeWrapperProps {
  career?: Metier;
  children: React.ReactNode;
}

interface CustomCSSProperties extends React.CSSProperties {
    '--primary-hsl'?: string;
    '--accent-hsl'?: string;
}


export function CareerThemeWrapper({ career, children }: CareerThemeWrapperProps) {
    const theme = career?.theme as any; 
    const careerName = career?.nom.toLowerCase() as keyof typeof placeholderImages || 'default';
    const imageData = placeholderImages[careerName] || placeholderImages.default;

    const themeStyles: CustomCSSProperties = career
    ? {
        '--primary-hsl': theme?.primaryColor,
        '--accent-hsl': theme?.accentColor,
        cursor: theme?.cursor.replace('cursor-', ''),
      }
    : {
        '--primary-hsl': '207 90% 54%', // default primary
        '--accent-hsl': '36 100% 65%', // default accent
      };

  const themeClasses = career 
    ? theme?.textColor
    : 'text-foreground';

  return (
    <div
      style={themeStyles}
      className={cn("transition-all duration-700 ease-in-out relative min-h-screen", themeClasses)}
    >
        <div 
          className="fixed inset-0 w-full h-full z-[-1] bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${imageData.url})` }}
          data-ai-hint={imageData.hint}
        />
        <div className="fixed inset-0 w-full h-full z-[-1] bg-background/60 backdrop-blur-sm" />
      
      {children}
    </div>
  );
}
