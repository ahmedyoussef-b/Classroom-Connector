"use client";

import { useApp } from '@/context/AppContext';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { CareerThemeWrapper } from '@/components/CareerThemeWrapper';
import { PersonalizedContent } from '@/components/PersonalizedContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Smile } from 'lucide-react';

export default function StudentPage() {
  const params = useParams();
  const studentId = typeof params.id === 'string' ? params.id : '';
  const { students, careers, studentStates } = useApp();

  const student = students.find((s) => s.id === studentId);
  const state = studentStates.get(studentId);
  const career = careers.find((c) => c.id === state?.careerId);

  if (!student) {
    return (
      <>
        <Header />
        <main className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <h1 className="text-2xl font-bold">Élève non trouvé.</h1>
        </main>
      </>
    );
  }

  const isPunished = state?.isPunished ?? false;

  const content = (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
        <div className="bg-card/80 backdrop-blur-sm border border-card-foreground/20 rounded-xl shadow-2xl">
            <div className="p-6 md:p-8">
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-4xl font-bold">Bienvenue, {student.name}!</CardTitle>
                    {career && (
                        <CardDescription className="text-lg pt-2">Vous explorez le monde d'un(e) {career.name}.</CardDescription>
                    )}
                </CardHeader>
                <PersonalizedContent student={student} />
            </div>
        </div>
    </div>
  );
  
  const punishmentView = (
    <div className="flex flex-col items-center justify-center text-center p-8">
       <AlertTriangle className="w-24 h-24 text-destructive mb-4" />
        <h2 className="text-3xl font-bold">Mode Puni</h2>
        <p className="text-muted-foreground mt-2">Votre thème personnalisé est temporairement désactivé. <br/> Concentrez-vous et préparez-vous à apprendre!</p>
    </div>
  );

  const defaultView = (
     <div className="flex flex-col items-center justify-center text-center p-8">
       <Smile className="w-24 h-24 text-primary mb-4" />
        <h2 className="text-3xl font-bold">Prêt à explorer?</h2>
        <p className="text-muted-foreground mt-2">Votre professeur vous assignera bientôt un thème de carrière à explorer.</p>
        <div className="mt-8 w-full max-w-2xl bg-card/80 backdrop-blur-sm border border-card-foreground/20 rounded-xl shadow-lg p-6">
          <PersonalizedContent student={student} />
        </div>
    </div>
  );

  return (
    <CareerThemeWrapper career={!isPunished ? career : undefined}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          {isPunished ? punishmentView : career ? content : defaultView}
        </main>
      </div>
    </CareerThemeWrapper>
  );
}
