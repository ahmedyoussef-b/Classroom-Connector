//src/components/CareerThemeWrapper.tsx
"use client";

import type { Metier } from '@prisma/client';
import type { LucideIcon } from 'lucide-react';
import React from 'react';

type CareerWithIcon = Omit<Metier, 'theme'> & {
    theme: {
        icon: LucideIcon;
        [key: string]: any;
    }
}

interface CareerThemeWrapperProps {
  career?: CareerWithIcon;
  children: React.ReactNode;
}

// Définir un type qui étend les propriétés CSS de React pour inclure nos variables personnalisées.
interface CustomCSSProperties extends React.CSSProperties {
    '--custom-bg-image'?: string;
    '--primary-hsl'?: string;
    '--accent-hsl'?: string;
}


export function CareerThemeWrapper({ career, children }: CareerThemeWrapperProps) {
    const theme = career?.theme as any; // Cast to any to access dynamic properties

  const themeStyles: CustomCSSProperties = career
    ? {
        '--custom-bg-image': theme?.backgroundImage,
        '--primary-hsl': theme?.primaryColor,
        '--accent-hsl': theme?.accentColor,
        cursor: theme?.cursor.replace('cursor-', ''),
      }
    : {
        '--primary-hsl': '207 90% 54%',
        '--accent-hsl': '36 100% 65%',
      };

  const themeClasses = career 
    ? `bg-gradient-to-br ${theme?.backgroundColor} ${theme?.textColor}`
    : 'bg-background text-foreground';

  return (
    <div
      style={themeStyles}
      className={`transition-all duration-700 ease-in-out ${themeClasses}`}
    >
      {theme?.backgroundImage && (
        <div 
          className="fixed inset-0 w-full h-full opacity-50 z-[-1]" 
          style={{ backgroundImage: theme.backgroundImage }}
        />
      )}
      {children}
    </div>
  );
}
