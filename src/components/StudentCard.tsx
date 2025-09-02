"use client";

import type { Student } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Ban, CheckCircle, User } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  const { careers, studentStates, setStudentCareer, togglePunishment } = useApp();
  const state = studentStates.get(student.id);

  const handleCareerChange = (careerId: string) => {
    setStudentCareer(student.id, careerId === 'none' ? null : careerId);
  };

  const handlePunish = () => {
    togglePunishment(student.id);
  };
  
  const currentCareer = careers.find(c => c.id === state?.careerId);

  return (
    <Card className="flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-xl">{student.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{student.name}</CardTitle>
            <CardDescription>Ambition: {student.ambition}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <label htmlFor={`career-select-${student.id}`} className="text-sm font-medium text-muted-foreground">
            Métier assigné
          </label>
          <Select onValueChange={handleCareerChange} value={state?.careerId ?? 'none'}>
            <SelectTrigger id={`career-select-${student.id}`} className="w-full">
              <SelectValue placeholder="Sélectionnez un métier..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun</SelectItem>
              {careers.map((career) => (
                <SelectItem key={career.id} value={career.id}>
                  <div className="flex items-center gap-2">
                    <career.theme.icon className="h-4 w-4" />
                    {career.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
         {currentCareer && (
          <div className="text-sm text-muted-foreground flex items-center gap-2 p-2 bg-muted rounded-md">
            <currentCareer.theme.icon className="h-4 w-4 text-primary" />
            <span>Affiche actuellement le thème {currentCareer.name}.</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant={state?.isPunished ? 'destructive' : 'outline'}
          onClick={handlePunish}
          className="w-full"
        >
          {state?.isPunished ? (
            <Ban className="mr-2 h-4 w-4" />
          ) : (
            <CheckCircle className="mr-2 h-4 w-4" />
          )}
          {state?.isPunished ? 'Enlever la punition' : 'Appliquer une punition'}
        </Button>
      </CardFooter>
    </Card>
  );
}
