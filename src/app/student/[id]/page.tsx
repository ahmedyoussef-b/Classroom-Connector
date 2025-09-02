"use client";

import { useApp } from '@/context/AppContext';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { CareerThemeWrapper } from '@/components/CareerThemeWrapper';
import { PersonalizedContent } from '@/components/PersonalizedContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Smile } from 'lucide-react';

export default function StudentPage() {
  const params = useParams();
  const studentId = typeof params.id === 'string' ? params.id : '';
  const { students, careers, studentStates } = useApp();

  const student = students.find((s) => s.id === studentId);
  const state = studentStates.get(studentId);
  const career = careers.find((c) => c.id === state?.careerId);

  if (!student) {
    return (
      <>
        <Header />
        <main className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <h1 className="text-2xl font-bold">Student not found.</h1>
        </main>
      </>
    );
  }

  const isPunished = state?.isPunished ?? false;

  const content = (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      <Card className="bg-card/80 backdrop-blur-sm border-card-foreground/20">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Welcome, {student.name}!</CardTitle>
          {!isPunished && career && (
             <CardDescription className="text-lg">You are exploring the world of a {career.name}.</CardDescription>
          )}
           {!isPunished && !career && (
             <CardDescription className="text-lg">Your teacher will assign you a career to explore soon!</CardDescription>
          )}
          {isPunished && (
             <CardDescription className="text-lg text-destructive">You are in a timeout. Your custom view has been disabled.</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PersonalizedContent student={student} />
        </CardContent>
      </Card>
    </div>
  );
  
  const punishmentView = (
    <div className="flex flex-col items-center justify-center text-center p-8">
       <AlertTriangle className="w-24 h-24 text-destructive mb-4" />
        <h2 className="text-3xl font-bold">Punishment Mode</h2>
        <p className="text-muted-foreground mt-2">Your personalized theme is temporarily disabled. <br/> Focus and get ready to learn!</p>
    </div>
  );

  const defaultView = (
     <div className="flex flex-col items-center justify-center text-center p-8">
       <Smile className="w-24 h-24 text-primary mb-4" />
        <h2 className="text-3xl font-bold">Ready to Explore?</h2>
        <p className="text-muted-foreground mt-2">Your teacher will assign a career theme for you to explore shortly.</p>
        <div className="mt-8 w-full max-w-2xl">
          <PersonalizedContent student={student} />
        </div>
    </div>
  );

  return (
    <CareerThemeWrapper career={!isPunished ? career : undefined}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          {isPunished ? punishmentView : career ? content : defaultView}
        </main>
      </div>
    </CareerThemeWrapper>
  );
}
