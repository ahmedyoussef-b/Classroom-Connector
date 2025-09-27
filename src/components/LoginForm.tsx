// src/components/LoginForm.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

interface LoginFormProps {
  initialEmail?: string;
  emailPlaceholder?: string;
}

export function LoginForm({ initialEmail = '', emailPlaceholder = 'votre@email.com' }: LoginFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('password'); // Demo password
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError("Les identifiants sont incorrects. L'email est student@example.com ou teacher@example.com et le mot de passe est 'password'.");
    } else if (result?.ok) {
      // Redirect based on role after successful login
      if (email === 'teacher@example.com') {
        router.push('/teacher');
      } else {
        // This is a simplification. A real app would fetch the user object to get the ID.
        // For now, we rely on the fact that the login form on the home page provides the correct email.
        try {
            const res = await fetch(`/api/user?email=${email}`);
            if (res.ok) {
                const student = await res.json();
                if (student && student.id) {
                    router.push(`/student/${student.id}`);
                } else {
                     setError("Impossible de trouver l'élève associé à cet email.");
                     router.push('/'); // Fallback
                }
            } else {
                 setError("Erreur lors de la récupération des informations de l'utilisateur.");
                 router.push('/'); // Fallback
            }
        } catch(e) {
            setError("Une erreur réseau est survenue.");
            router.push('/'); // Fallback
        }
      }
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          
          {error && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erreur de connexion</AlertTitle>
                <AlertDescription>
                    {error}
                </AlerDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center pt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Se connecter
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
