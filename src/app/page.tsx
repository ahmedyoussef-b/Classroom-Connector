import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School, User } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary">
          Classroom Connector
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Connecting Teachers and Students for a Brighter Future
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="items-center text-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <User className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">For Teachers</CardTitle>
            <CardDescription>
              Manage your classroom, inspire students, and track their progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild size="lg" className="w-full">
              <Link href="/teacher">Enter Teacher Dashboard</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="items-center text-center">
            <div className="p-4 bg-accent/10 rounded-full mb-4">
              <School className="w-10 h-10 text-accent" />
            </div>
            <CardTitle className="text-2xl">For Students</CardTitle>
            <CardDescription>
              Explore your future, chat with your teacher, and learn in a fun way.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild size="lg" variant="secondary" className="w-full">
              <Link href="/student/1">Enter as a Student</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-20 text-center text-muted-foreground">
        <p>Built with Next.js, Tailwind CSS, and Shadcn UI.</p>
        <p>A new way to experience the classroom.</p>
      </footer>
    </div>
  );
}
