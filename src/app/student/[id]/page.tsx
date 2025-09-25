// src/app/student/[id]/page.tsx
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { setStudentCareer, togglePunishment } from '@/lib/actions';
import { ArrowLeft, User, Briefcase, Zap, FileUp } from 'lucide-react';
import Link from 'next/link';

export default async function StudentAdminPage({ params }: { params: { id: string } }) {
  const { id: studentId } = params;

  const [student, metiers] = await Promise.all([
    prisma.user.findUnique({
      where: { id: studentId, role: 'ELEVE' },
      include: {
        etat: true,
        classe: true
      }
    }),
    prisma.metier.findMany()
  ]);

  if (!student) {
    notFound();
  }
  
  const studentState = student.etat;
  const isPunished = studentState?.isPunished ?? false;

  const setCareerAction = setStudentCareer.bind(null, student.id);
  const togglePunishmentAction = togglePunishment.bind(null, student.id);

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center gap-4">
            {student.classe && (
                 <Button variant="outline" size="icon" asChild>
                    <Link href={`/teacher/class/${student.classe.id}`}>
                        <ArrowLeft />
                        <span className="sr-only">Retour à la classe</span>
                    </Link>
                </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gestion de l'élève</h1>
              <p className="text-muted-foreground">Modifier les propriétés et le statut de {student.name}.</p>
            </div>
          </div>
          
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User />
                    Profil de l'élève
                </CardTitle>
                <CardDescription>Informations de base et ambition de l'élève.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <Label>Prénom</Label>
                        <p className="font-semibold text-lg">{student.name}</p>
                    </div>
                    <div>
                        <Label>Classe</Label>
                        <p className="font-semibold text-lg">{student.classe?.nom ?? 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Ambition déclarée</Label>
                    <p className="text-muted-foreground italic">"{student.ambition}"</p>
                  </div>
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase />
                        Assigner un métier
                    </CardTitle>
                    <CardDescription>Choisir un thème de carrière pour l'élève. Cela changera son environnement visuel.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={setCareerAction}>
                        <div className="flex items-end gap-4">
                            <div className='flex-grow'>
                                <Label htmlFor="career-select">Métier</Label>
                                <Select name="careerId" defaultValue={studentState?.metierId ?? 'none'}>
                                    <SelectTrigger id="career-select">
                                        <SelectValue placeholder="Choisir un métier..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Aucun</SelectItem>
                                        {metiers.map(metier => (
                                            <SelectItem key={metier.id} value={metier.id}>{metier.nom}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit">Appliquer</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-600">
                        <Zap />
                        Actions disciplinaires
                    </CardTitle>
                    <CardDescription>Activer le mode "puni" pour désactiver le thème de l'élève.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={togglePunishmentAction}>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <Label htmlFor="punishment-switch" className="font-medium">
                                Mode Puni
                            </Label>
                            <Switch id="punishment-switch" name="isPunished" defaultChecked={isPunished} type="submit" />
                        </div>
                    </form>
                </CardContent>
            </card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileUp />
                        Envoyer des documents
                    </CardTitle>
                    <CardDescription>Partager des fichiers ou des ressources avec l'élève.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Fonctionnalité à venir...</p>
                    </div>
                </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
