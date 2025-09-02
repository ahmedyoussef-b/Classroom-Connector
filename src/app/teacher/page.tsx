"use client";

import { useApp } from '@/context/AppContext';
import { StudentCard } from '@/components/StudentCard';
import { Header } from '@/components/Header';
import { ChatSheet } from '@/components/ChatSheet';

export default function TeacherPage() {
  const { students } = useApp();

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tableau de bord du professeur</h1>
            <p className="text-muted-foreground">Gérez vos élèves et leur parcours d'apprentissage.</p>
          </div>
          <ChatSheet />
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
