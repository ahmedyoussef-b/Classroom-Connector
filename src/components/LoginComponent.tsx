// src/components/LoginComponent.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/LoginForm';

// This client component handles the logic that depends on searchParams.
export function LoginComponent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  const initialEmail = role === 'student' ? 'student1@example.com' : role === 'teacher' ? 'teacher@example.com' : '';
  const placeholder = role === 'student' ? 'student@example.com' : 'teacher@example.com';
  
  if (role === 'student' && !initialEmail) {
      // Default to first student if role is student but no specific email is derived
      // This is a specific fix for the logic from the old login page
  }

  return (
    <LoginForm initialEmail={initialEmail} emailPlaceholder={placeholder} />
  );
}
