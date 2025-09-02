"use client";

import { useState } from 'react';
import { personalizedLearningAmbitionDisplay } from '@/ai/flows/personalized-learning-ambition-display';
import { Button } from './ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import type { Student } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface PersonalizedContentProps {
  student: Student;
}

export function PersonalizedContent({ student }: PersonalizedContentProps) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const generateContent = async () => {
    setLoading(true);
    setError('');
    setContent('');
    try {
      const result = await personalizedLearningAmbitionDisplay({
        studentId: student.id,
        name: student.name,
        careerAmbitions: student.ambition,
      });
      setContent(result.personalizedContent);
    } catch (e) {
      setError('Impossible de générer le contenu. Veuillez réessayer.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-2xl font-semibold mb-4">Votre parcours personnalisé</h3>
      
      {!content && !loading && (
        <div className="text-center p-8 border-dashed border-2 rounded-lg">
          <p className="text-muted-foreground mb-4">
            Découvrez à quoi pourrait ressembler votre avenir en tant que {student.ambition}!
          </p>
          <Button onClick={generateContent}>
            <Sparkles className="mr-2 h-4 w-4" />
            Générer mon plan d'apprentissage
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Génération de votre plan personnalisé...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {content && (
        <div className="prose prose-blue dark:prose-invert max-w-none p-4 bg-muted/50 rounded-lg">
          <pre className="whitespace-pre-wrap font-sans text-sm">{content}</pre>
        </div>
      )}
    </div>
  );
}
