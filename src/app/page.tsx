import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default function LandingPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <Icons.logo className="h-16 w-16 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tighter text-foreground">
          Welcome to DataDiary
        </h1>
        <p className="text-lg text-muted-foreground">
          Your personal space to record, reflect, and grow.
        </p>
        <div className="flex space-x-4 pt-4">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        Built with passion. Your data, your story.
      </footer>
    </div>
  );
}
