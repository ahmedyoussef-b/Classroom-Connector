
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import React from 'react';

// This is a server component that fetches data
export default async function PageData({
  params,
  Page,
}: {
  params: { id: string };
  Page: React.FC<any>;
}) {
  const classeId = params.id;

  const classe = await prisma.classe.findUnique({
    where: { id: classeId },
    include: {
      eleves: {
        include: {
          etat: true,
        },
      },
    },
  });

  if (!classe) {
    notFound();
  }

  const metiers = await prisma.metier.findMany();

  // Simulate connection status for demonstration
  const elevesWithConnection = classe.eleves.map((eleve, index) => ({
    ...eleve,
    isConnected: index % 2 === 0, // Alternate connected status
  }));

  const classeWithConnection = { ...classe, eleves: elevesWithConnection };

  return <Page classe={classeWithConnection} metiers={metiers} />;
}
