"use client";

import { useApp } from '@/context/AppContext';
import { StudentCard } from '@/components/StudentCard';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ClassAPage() {
  const { students } = useApp();

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
            <h1 className="text-3xl font-bold tracking-tight">Classe A</h1>
            <p className="text-muted-foreground">Gérez vos élèves et leur parcours d'apprentissage.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      </main>
    </>
  );
}
