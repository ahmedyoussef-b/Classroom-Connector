
"use client";

import { useState, useMemo } from 'react';
import { StudentCard } from '@/components/StudentCard';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Video } from 'lucide-react';
import type { User, EtatEleve, Metier } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


// This is a server component that fetches data
export default function ClassPageWrapper({ params }: { params: { id: string } }) {
  // In a real app, you would fetch this data using an API route or a server action
  // For now, we simulate fetching initial data.
  const classe = {
    id: params.id,
    nom: 'Classe A',
    eleves: [
      { id: '1', name: 'Alice', ambition: 'devenir pompier', etat: { metierId: 'pompier-id', isPunished: false, eleveId: '1' }, isConnected: true },
      { id: '2', name: 'Bob', ambition: 'explorer Mars', etat: { metierId: 'astronaute-id', isPunished: false, eleveId: '2' }, isConnected: false },
      { id: '3', name: 'Charlie', ambition: 'soigner les animaux', etat: { metierId: 'veterinaire-id', isPunished: false, eleveId: '3' }, isConnected: true },
      { id: '4', name: 'Diana', ambition: "être une artiste célèbre", etat: { metierId: null, isPunished: false, eleveId: '4' }, isConnected: false },
    ],
  };

  const metiers = [
      { id: 'pompier-id', nom: 'Pompier', description: 'Protège les personnes et les biens des incendies.', theme: {} },
      { id: 'astronaute-id', nom: 'Astronaute', description: "Explore l'espace et voyage vers d'autres planètes.", theme: {} },
      { id: 'veterinaire-id', nom: 'Vétérinaire', description: 'Soigne les animaux malades et blessés.', theme: {} },
  ];

  return <ClassPageClient classe={classe as any} metiers={metiers as any} />;
}


interface ClassPageClientProps {
    classe: {
        id: string;
        nom: string;
        eleves: (User & { etat: EtatEleve | null, isConnected: boolean })[];
    };
    metiers: Metier[];
}

function ClassPageClient({ classe, metiers }: ClassPageClientProps) {
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();

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
  const selectedStudentNames = useMemo(() => {
    return classe.eleves
      .filter(student => selectedStudents.has(student.id))
      .map(student => student.name)
      .join(', ');
  }, [selectedStudents, classe.eleves]);

  const handleStartSession = () => {
    setIsAlertOpen(true);
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

       <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Session audio/visuelle</AlertDialogTitle>
            <AlertDialogDescription>
              Cette fonctionnalité est en cours de développement. La session serait lancée avec les élèves suivants : <span className="font-bold">{selectedStudentNames}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>Compris</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
