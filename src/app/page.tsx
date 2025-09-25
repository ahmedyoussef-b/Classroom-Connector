import { LoginForm } from '@/components/LoginForm';
import { School } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-2 mb-4">
                 <School className="h-10 w-10 text-primary" />
                 <h1 className="text-4xl font-extrabold tracking-tight text-primary">
                    Classroom Connector
                </h1>
            </div>
          <p className="text-lg text-muted-foreground">
            Connectez-vous pour commencer.
          </p>
        </div>
        
        <LoginForm />

      </div>
       <footer className="mt-20 text-center text-muted-foreground">
        <p>Built with Next.js, Tailwind CSS, and Shadcn UI.</p>
        <p>A new way to experience the classroom.</p>
      </footer>
    </div>
  );
}
