// src/app/login/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/LoginForm';
import { School } from 'lucide-react';
import Link from 'next/link';

function LoginPageContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  const initialEmail = role === 'student' ? 'student@example.com' : role === 'teacher' ? 'teacher@example.com' : '';
  const placeholder = role === 'student' ? 'student@example.com' : 'teacher@example.com';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <Link href="/" className="flex justify-center items-center gap-2 mb-4 text-primary hover:opacity-80 transition-opacity">
                 <School className="h-10 w-10" />
                 <h1 className="text-4xl font-extrabold tracking-tight">
                    Classroom Connector
                </h1>
            </Link>
          <p className="text-lg text-muted-foreground">
            Connectez-vous pour commencer.
          </p>
        </div>
        
        <LoginForm initialEmail={initialEmail} emailPlaceholder={placeholder} />

      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
