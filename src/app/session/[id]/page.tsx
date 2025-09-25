// src/app/session/[id]/page.tsx
'use client';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Workspace } from '@/components/Workspace';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function SessionPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const role = searchParams.get('role');
    const studentIds = searchParams.get('students')?.split(',') || [];

    const handleGoBack = () => {
        router.back();
    };

    const teacherView = (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Colonne principale avec la vidéo du prof et l'espace de travail */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                <Card className="flex-grow">
                    <CardHeader>
                        <CardTitle>Mon flux vidéo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <VideoPlayer userId="teacher" />
                    </CardContent>
                </Card>
                <div className="flex-grow">
                   <Workspace />
                </div>
            </div>

            {/* Colonne latérale avec les vidéos des élèves */}
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users />
                            Élèves ({studentIds.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {studentIds.map(id => (
                            <div key={id}>
                                <VideoPlayer userId={id} />
                                <p className="text-center text-sm font-medium mt-2">Élève {id}</p>
                            </div>
                        ))}
                         {studentIds.length === 0 && <p className="text-muted-foreground text-center col-span-full">Aucun élève dans cette session.</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const studentView = (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2 flex flex-col gap-6">
                <Card className="flex-grow">
                    <CardHeader>
                        <CardTitle>Vidéo du Professeur</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <VideoPlayer userId="teacher-placeholder" />
                    </CardContent>
                </Card>
                 <div className="flex-grow">
                   <Workspace />
                </div>
            </div>
            <div className="flex flex-col">
                <Card>
                     <CardHeader>
                        <CardTitle>Ma Vidéo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <VideoPlayer userId="current-student" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <h1 className="text-xl font-bold">Session en direct</h1>
                    <Button variant="outline" onClick={handleGoBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Button>
                </div>
            </header>
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {role === 'teacher' ? teacherView : studentView}
            </main>
        </div>
    );
}


export default function SessionPage() {
    return (
        <Suspense fallback={<div>Chargement de la session...</div>}>
            <SessionPageContent />
        </Suspense>
    )
}
