// src/app/student/[id]/page.tsx
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { User, Lightbulb, GraduationCap, FileUp } from 'lucide-react';
import { CareerThemeWrapper } from '@/components/CareerThemeWrapper';
import { PersonalizedContent } from '@/components/PersonalizedContent';
import { StudentWithStateAndCareer } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

async function getStudentData(id: string): Promise<StudentWithStateAndCareer | null> {
    const student = await prisma.user.findUnique({
      where: { id, role: 'ELEVE' },
      include: {
        etat: {
          include: {
            metier: true
          }
        },
        classe: true
      }
    });

    // If student is punished, don't return the career theme
    if (student?.etat?.isPunished && student.etat.metier) {
        // Create a new object to avoid modifying the cached one
        const studentWithoutTheme: StudentWithStateAndCareer = {
            ...student,
            etat: {
                ...student.etat,
                metier: null
            }
        };
        return studentWithoutTheme;
    }

    return student;
}


export default async function StudentPage({ params }: { params: { id:string } }) {
  await params;
  const student = await getStudentData(params.id);

  if (!student) {
    notFound();
  }

  const career = student.etat?.metier;

  return (
    <CareerThemeWrapper career={career ?? undefined}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="md:col-span-1">
              <Card className="bg-background/80 backdrop-blur-sm mb-8">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary">
                      <AvatarFallback className="text-3xl bg-background">
                        {student.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-3xl">Bonjour, {student.name}!</CardTitle>
                      <CardDescription className="text-lg">Bienvenue sur votre tableau de bord.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                      <Lightbulb className="h-5 w-5 text-accent" />
                      <p>Votre ambition : <span className="font-semibold italic text-foreground">"{student.ambition}"</span></p>
                  </div>
                  {career && (
                      <div className="flex items-center gap-2 text-muted-foreground mt-2">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          <p>Votre métier exploré : <span className="font-semibold text-foreground">{career.nom}</span></p>
                      </div>
                  )}
                   {student.classe && (
                      <div className="mt-4">
                          <Button asChild>
                              <Link href={`/teacher/class/${student.classe.id}`}>
                                  Voir ma classe
                              </Link>
                          </Button>
                      </div>
                  )}
                </CardContent>
              </Card>

              <PersonalizedContent student={student} />
            </div>

            <div className="md:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileUp />
                            Soumettre un devoir
                        </CardTitle>
                        <CardDescription>
                            Importez votre travail pour que votre professeur puisse le consulter.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Input id="homework" type="file" />
                            </div>
                            <Button className="mt-4">Soumettre</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
          </div>
        </main>
      </div>
    </CareerThemeWrapper>
  );
}

// Minimal Avatar component for this page
function Avatar({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>
}
function AvatarFallback({ children, className }: { children: React.ReactNode, className?: string }) {
    return <span className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>{children}</span>
}