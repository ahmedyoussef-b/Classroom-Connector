import Link from 'next/link';
import { School } from 'lucide-react';
import { UserNav } from './UserNav';
import { Button } from './ui/button';
import { User } from '@prisma/client';

interface HeaderProps {
  user?: User | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-card border-b top-0 z-50 sticky">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <School className="h-6 w-6" />
          <span>Classroom Connector</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
           <Button variant="ghost" asChild>
            <Link href="/librairie-metiers">Métiers</Link>
          </Button>
          <UserNav user={user} />
        </nav>
      </div>
    </header>
  );
}
