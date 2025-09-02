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
        '--custom-text-color': `var(--${career.theme.textColor})`, // This assumes you have colors like text-slate-800 defined. It's better to use classes.
        cursor: career.theme.cursor.replace('cursor-', ''),
      }
    : {};

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
