
import { Header } from '@/components/Header';
import { ChatSheet } from '@/components/ChatSheet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function TeacherPage() {
  const classes = await prisma.classe.findMany({
    include: {
      _count: {
        select: { eleves: true }
      }
    }
  });

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tableau de bord du professeur</h1>
            <p className="text-muted-foreground">Gérez vos classes et leur parcours d'apprentissage.</p>
          </div>
          {/* ChatSheet needs a chatroom id, we assume one for now */}
          {classes.length > 0 && <ChatSheet chatroomId={classes[0].chatroomId} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map(classe => (
              <Link href={`/teacher/class/${classe.id}`} className="group" key={classe.id}>
                  <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <CardHeader>
                          <div className="flex items-center gap-4">
                              <div className="p-3 bg-primary/10 rounded-full">
                                  <Users className="h-6 w-6 text-primary"/>
                              </div>
                              <div>
                                  <CardTitle>{classe.nom}</CardTitle>
                                  <CardDescription>{classe._count.eleves} élèves</CardDescription>
                              </div>
                          </div>
                      </CardHeader>
                      <CardContent>
                          <p className="text-sm text-muted-foreground">Accéder à la liste des élèves et gérer leurs thèmes.</p>
                      </CardContent>
                  </Card>
              </Link>
            ))}
        </div>
      </main>
    </>
  );
}
