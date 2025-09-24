import { Header } from '@/components/Header';
import { CareerThemeWrapper } from '@/components/CareerThemeWrapper';
import { PersonalizedContent } from '@/components/PersonalizedContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Smile } from 'lucide-react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metier } from '@prisma/client';

// We need to re-import an icon here as Lucide icons cannot be passed from server to client components
import { BookOpen } from 'lucide-react';

export default async function StudentPage({ params }: { params: { id: string } }) {
  const studentId = params.id;

  const student = await prisma.user.findUnique({
    where: { id: studentId, role: 'ELEVE' },
    include: {
      etat: {
        include: {
          metier: true
        }
      }
    }
  });

  if (!student) {
    notFound();
  }

  const state = student.etat;
  const career = student.etat?.metier;
  
  // A bit of a hack because we can't pass Lucide icons from server to client.
  // We'll pass the theme object and reconstruct the Icon on the client.
  // In a real app, we might have a mapping of icon names to components.
  const careerWithTheme = career ? {
      ...career,
      theme: {
          ...career.theme as any,
          icon: BookOpen
      }
  } : undefined;


  const isPunished = state?.isPunished ?? false;

  const content = (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
        <div className="bg-card/80 backdrop-blur-sm border border-card-foreground/20 rounded-xl shadow-2xl">
            <div className="p-6 md:p-8">
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-4xl font-bold">Bienvenue, {student.name}!</CardTitle>
                    {career && (
                        <CardDescription className="text-lg pt-2">Vous explorez le monde d'un(e) {career.nom}.</CardDescription>
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
    <CareerThemeWrapper career={!isPunished ? careerWithTheme : undefined}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          {isPunished ? punishmentView : career ? content : defaultView}
        </main>
      </div>
    </CareerThemeWrapper>
  );
}
