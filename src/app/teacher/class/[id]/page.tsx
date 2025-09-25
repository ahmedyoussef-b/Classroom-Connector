
// src/app/teacher/class/[id]/page.tsx
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ClassPageClient from './ClassPageClient';
import type { Metier } from '@prisma/client';

export default async function ClassPage({ params }: { params: { id: string } }) {
  const { id: classeId } = params;

  const classeData = prisma.classe.findUnique({
    where: { id: classeId },
    include: {
      eleves: {
        include: {
          etat: true,
        },
      },
    },
  });

  const metiersData = prisma.metier.findMany();
  
  const [classe, metiers] = await Promise.all([classeData, metiersData]);

  if (!classe) {
    notFound();
  }

  // Simulate connection status for demonstration
  const elevesWithConnection = classe.eleves.map((eleve, index) => ({
    ...eleve,
    isConnected: index % 2 === 0, // Alternate connected status
  }));

  const classeWithConnection = { ...classe, eleves: elevesWithConnection };

  return <ClassPageClient classe={classeWithConnection} metiers={metiers as Metier[]} />;
}
