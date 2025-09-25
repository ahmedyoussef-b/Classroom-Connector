// src/app/teacher/class/[id]/page.tsx
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ClassPageClient from './ClassPageClient';
import type { Metier } from '@prisma/client';

export default async function ClassPage({ params }: { params: { id: string } }) {
  const { id: classeId } = params;

  const [classe, metiers] = await Promise.all([
    prisma.classe.findUnique({
      where: { id: classeId },
      include: {
        eleves: {
          include: {
            etat: true,
          },
        },
      },
    }),
    prisma.metier.findMany()
  ]);

  if (!classe) {
    notFound();
  }

  const elevesWithConnection = classe.eleves.map((eleve, index) => ({
    ...eleve,
    isConnected: index % 2 === 0,
  }));

  const classeWithConnection = { 
    ...classe, 
    eleves: elevesWithConnection 
  };

  return <ClassPageClient classe={classeWithConnection} metiers={metiers as Metier[]} />;
}
