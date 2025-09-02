"use client";

import { useState } from 'react';
import { personalizedLearningAmbitionDisplay } from '@/ai/flows/personalized-learning-ambition-display';
import { Button } from './ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import type { Student } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Card, CardContent } from './ui/card';

interface PersonalizedContentProps {
  student: Student;
}

function Markdown({ content }: { content: string }) {
    const lines = content.split('\n');
    const elements = [];
    let listType: 'ol' | 'ul' | null = null;
    let listItems: string[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            if (listType === 'ul') {
                elements.push(<ul key={elements.length} className="list-disc list-inside space-y-1 my-4">{listItems.map((li, i) => <li key={i}>{li}</li>)}</ul>);
            } else if (listType === 'ol') {
                elements.push(<ol key={elements.length} className="list-decimal list-inside space-y-1 my-4">{listItems.map((li, i) => <li key={i}>{li}</li>)}</ol>);
            }
        }
        listItems = [];
        listType = null;
    };

    lines.forEach((line, index) => {
        line = line.trim();
        if (line.startsWith('# ')) {
            flushList();
            elements.push(<h2 key={index} className="text-2xl font-bold mt-6 mb-3 border-b pb-2">{line.substring(2)}</h2>);
        } else if (line.startsWith('## ')) {
            flushList();
            elements.push(<h3 key={index} className="text-xl font-semibold mt-4 mb-2">{line.substring(3)}</h3>);
        } else if (line.startsWith('### ')) {
            flushList();
            elements.push(<h4 key={index} className="text-lg font-semibold mt-3 mb-1">{line.substring(4)}</h4>);
        } else if (line.startsWith('* ') || line.startsWith('- ')) {
            if (listType !== 'ul') {
                flushList();
                listType = 'ul';
            }
            listItems.push(line.substring(2));
        } else if (line.match(/^\d+\.\s/)) {
            if (listType !== 'ol') {
                flushList();
                listType = 'ol';
            }
            listItems.push(line.replace(/^\d+\.\s/, ''));
        } else if (line === '') {
            flushList();
            elements.push(<div key={index} className="h-4"></div>);
        } else {
            flushList();
            const formattedLine = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>');
            elements.push(<p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />);
        }
    });
    flushList(); // Add any remaining list items

    return <div className="prose-sm dark:prose-invert max-w-none text-foreground">{elements}</div>;
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
    <div className="border-t border-foreground/20 pt-6">
      <h3 className="text-2xl font-semibold mb-4">Votre parcours personnalisé</h3>
      
      {!content && !loading && (
        <div className="text-center p-8 border-dashed border-2 border-foreground/20 rounded-lg">
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
        <Card className="bg-background/70">
          <CardContent className="p-6">
            <Markdown content={content} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
