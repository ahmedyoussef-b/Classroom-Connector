// src/components/LoginForm.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { getStudentByEmail } from '@/lib/actions';


interface LoginFormProps {
  initialEmail?: string;
  emailPlaceholder?: string;
}

export function LoginForm({ initialEmail = '', emailPlaceholder = 'votre@email.com' }: LoginFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Hardcoded logic for demonstration
    if (password !== 'password') {
      setError('Mot de passe incorrect. Le mot de passe est "password".');
      return;
    }

    if (email === 'teacher@example.com') {
      router.push('/teacher');
    } else if (email.startsWith('student')) {
       // In a real app, you would properly look up the user.
       if (email === 'student@example.com' || email.match(/^student\d+@example\.com$/)) {
            const student = await getStudentByEmail(email);
            if (student) {
                 router.push(`/student/${student.id}`);
            } else {
                setError('Aucun élève trouvé avec cet email.');
            }
       } else {
           setError('Email non reconnu. Essayez teacher@example.com ou un email étudiant valide.');
       }
    } else {
      setError('Email non reconnu. Essayez teacher@example.com ou un email étudiant valide.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Entrez vos identifiants pour accéder à votre tableau de bord.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erreur de connexion</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center pt-2">
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
