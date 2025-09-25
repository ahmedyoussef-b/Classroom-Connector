// src/app/login/page.tsx
import { LoginForm } from '@/components/LoginForm';
import { School } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
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
        
        <LoginForm />

      </div>
    </div>
  );
}
