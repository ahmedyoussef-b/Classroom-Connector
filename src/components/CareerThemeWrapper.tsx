"use client";

import { Career } from '@/lib/types';
import React from 'react';

interface CareerThemeWrapperProps {
  career?: Career;
  children: React.ReactNode;
}

export function CareerThemeWrapper({ career, children }: CareerThemeWrapperProps) {
  const themeStyles: React.CSSProperties = career
    ? {
        '--custom-bg-image': career.theme.backgroundImage,
        '--primary-hsl': career.theme.primaryColor,
        '--accent-hsl': career.theme.accentColor,
        cursor: career.theme.cursor.replace('cursor-', ''),
      }
    : {
        '--primary-hsl': '207 90% 54%',
        '--accent-hsl': '36 100% 65%',
      };

  const themeClasses = career 
    ? `bg-gradient-to-br ${career.theme.backgroundColor} ${career.theme.textColor}`
    : 'bg-background text-foreground';

  return (
    <div
      style={themeStyles}
      className={`transition-all duration-700 ease-in-out ${themeClasses}`}
    >
      {career?.theme.backgroundImage && (
        <div 
          className="fixed inset-0 w-full h-full opacity-50 z-[-1]" 
          style={{ backgroundImage: career.theme.backgroundImage }}
        />
      )}
      {children}
    </div>
  );
}
