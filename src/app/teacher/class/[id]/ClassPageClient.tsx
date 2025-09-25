// src/app/teacher/class/[id]/ClassPageClient.tsx
"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { StudentCard } from '@/components/StudentCard';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Video } from 'lucide-react';
import type { User, EtatEleve, Metier } from '@prisma/client';

interface ClassPageClientProps {
    classe: {
        id: string;
        nom: string;
        eleves: (User & { etat: EtatEleve | null, isConnected: boolean })[];
    };
    metiers: Metier[];
}

export default function ClassPageClient({ classe, metiers }: ClassPageClientProps) {
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const router = useRouter();

  const handleSelectionChange = (studentId: string, isSelected: boolean) => {
    setSelectedStudents(prev => {
      const newSelection = new Set(prev);
      if (isSelected) {
        newSelection.add(studentId);
      } else {
        newSelection.delete(studentId);
      }
      return newSelection;
    });
  };

  const selectedCount = selectedStudents.size;

  const handleStartSession = () => {
    if (selectedCount > 0) {
      const studentIds = Array.from(selectedStudents).join(',');
      const sessionId = `session-${Date.now()}`;
      router.push(`/session/${sessionId}?role=teacher&students=${studentIds}`);
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className='flex items-center gap-4'>
                 <Button variant="outline" size="icon" asChild>
                    <Link href="/teacher">
                        <ArrowLeft />
                        <span className="sr-only">Retour</span>
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{classe.nom}</h1>
                    <p className="text-muted-foreground">Gérez vos élèves et leur parcours d'apprentissage.</p>
                </div>
            </div>
          {selectedCount > 0 && (
            <Button onClick={handleStartSession} className="transition-all animate-in fade-in zoom-in-95">
              <Video className="mr-2 h-4 w-4" />
              Démarrer une session ({selectedCount})
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classe.eleves.map((student) => (
            <StudentCard 
                key={student.id} 
                student={student} 
                careers={metiers}
                isSelected={selectedStudents.has(student.id)}
                onSelectionChange={handleSelectionChange}
             />
          ))}
        </div>
      </main>
    </>
  );
}
