// src/app/teacher/class/[id]/page.tsx
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ClassPageClient from './ClassPageClient';

export default async function ClassPage({ params }: { params: { id: string } }) {
  const classeId = params.id;

  const [classe, teacher] = await Promise.all([
    prisma.classe.findUnique({
      where: { id: classeId },
      include: {
        eleves: {
          include: {
            etat: true,
          },
          orderBy: { name: 'asc' }
        },
      },
    }),
    prisma.user.findUnique({
        where: { id: 'teacher-id' }
    })
  ]);

  if (!classe || !teacher) {
    notFound();
  }
  
  // This is a simplified simulation of checking connection status
  const elevesWithConnection = classe.eleves.map((eleve, index) => ({
    ...eleve,
    isConnected: index % 2 === 0, 
  }));

  const clientProps = {
    classe: {
      id: classe.id,
      nom: classe.nom,
      eleves: elevesWithConnection.map(e => ({
          id: e.id,
          name: e.name,
          etat: e.etat ? {
              isPunished: e.etat.isPunished
          } : null,
          isConnected: e.isConnected
      })),
    },
    teacher,
  };


  return <ClassPageClient {...clientProps} />;
}
