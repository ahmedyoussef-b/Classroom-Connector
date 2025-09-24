import { StudentCard } from '@/components/StudentCard';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function ClassPage({ params }: { params: { id: string } }) {
  const classe = await prisma.classe.findUnique({
    where: { id: params.id },
    include: {
      eleves: {
        include: {
          etat: true,
        },
        orderBy: { name: 'asc' }
      }
    }
  });

  const metiers = await prisma.metier.findMany();

  if (!classe) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8 gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classe.eleves.map((student) => (
            <StudentCard key={student.id} student={student} careers={metiers} />
          ))}
        </div>
      </main>
    </>
  );
}
