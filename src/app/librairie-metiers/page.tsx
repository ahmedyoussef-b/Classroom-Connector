import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { BookOpen } from 'lucide-react'; // Generic icon

export default async function CareersPage() {
  const careers = await prisma.metier.findMany();

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Librairie Métiers
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explorez les différents environnements et thèmes disponibles pour les élèves. Chaque métier offre une expérience visuelle unique.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {careers.map((career) => {
            const theme = career.theme as any;
            return (
              <Link href="#" key={career.id} className="group">
                <Card
                  className={cn(
                    "overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2 flex flex-col h-full",
                    theme.cursor
                  )}
                >
                  <div
                    className={cn(
                      'h-32 flex items-center justify-center p-6 bg-gradient-to-br',
                      theme.backgroundColor
                    )}
                    style={{ backgroundImage: theme.backgroundImage }}
                  >
                    <BookOpen className={cn('h-16 w-16', theme.textColor.replace('text-', 'text-'))} />
                  </div>
                  <CardHeader>
                    <CardTitle>{career.nom}</CardTitle>
                    <CardDescription className="text-sm">{career.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                     <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-semibold">Curseur:</span>
                        <span className={cn('px-2 py-1 rounded-full bg-muted')}>
                            {theme.cursor.replace('cursor-', '')}
                        </span>
                     </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>
    </>
  );
}
