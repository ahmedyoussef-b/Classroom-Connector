
"use client";

import type { User, EtatEleve, Metier } from '@prisma/client';
import { setStudentCareer, togglePunishment } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Ban, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useTransition } from 'react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

// We need to re-import an icon here as Lucide icons cannot be passed from server to client components
import { BookOpen } from 'lucide-react';

interface StudentCardProps {
  student: User & { etat: EtatEleve | null, isConnected?: boolean };
  careers: Metier[];
  isSelected: boolean;
  onSelectionChange: (studentId: string, isSelected: boolean) => void;
}

export function StudentCard({ student, careers, isSelected, onSelectionChange }: StudentCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleCareerChange = (careerId: string) => {
    startTransition(() => {
      setStudentCareer(student.id, careerId === 'none' ? null : careerId);
    });
  };

  const handlePunish = () => {
    startTransition(() => {
      togglePunishment(student.id);
    });
  };
  
  const state = student.etat;
  const currentCareer = careers.find(c => c.id === state?.metierId);

  return (
    <Card className={cn(
      "flex flex-col transition-all duration-300 relative",
      isSelected && "ring-2 ring-primary",
      state?.isPunished && "bg-destructive/10 border-destructive",
      (isPending) && "opacity-50"
    )}>
        <div className="absolute top-3 right-3 flex items-center gap-2">
             <div className={cn("h-2.5 w-2.5 rounded-full", student.isConnected ? 'bg-green-500' : 'bg-gray-400')} title={student.isConnected ? 'Connecté' : 'Déconnecté'}></div>
             <Checkbox
                id={`select-${student.id}`}
                checked={isSelected}
                onCheckedChange={(checked) => onSelectionChange(student.id, !!checked)}
                aria-label={`Sélectionner ${student.name}`}
            />
        </div>

      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-xl">{student.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{student.name}</CardTitle>
            <CardDescription>Ambition: {student.ambition}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <Label htmlFor={`career-select-${student.id}`} className="text-sm font-medium text-muted-foreground">
            Métier assigné
          </Label>
          <Select 
            onValueChange={handleCareerChange} 
            value={state?.metierId ?? 'none'} 
            disabled={state?.isPunished || isPending}
          >
            <SelectTrigger id={`career-select-${student.id}`} className="w-full">
              <SelectValue placeholder="Sélectionnez un métier..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun</SelectItem>
              {careers.map((career) => (
                <SelectItem key={career.id} value={career.id}>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {career.nom}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
         {currentCareer && !state?.isPunished && (
          <div className="text-sm text-muted-foreground flex items-center gap-2 p-2 bg-muted rounded-md">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>Thème: {currentCareer.nom}.</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          variant={state?.isPunished ? 'destructive' : 'outline'}
          onClick={handlePunish}
          className="w-full"
          disabled={isPending}
        >
          {state?.isPunished ? (
            <Ban className="mr-2 h-4 w-4" />
          ) : (
            <CheckCircle className="mr-2 h-4 w-4" />
          )}
          {state?.isPunished ? 'Enlever la punition' : 'Appliquer une punition'}
        </Button>
         <Button asChild className="w-full" variant="secondary">
            <Link href={`/student/${student.id}`}>Voir la page de l'élève</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
