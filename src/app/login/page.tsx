import { LoginForm } from '@/components/auth/login-form';
import { Building } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Building className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-headline text-foreground">
            Invorg Staff Hub
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Please sign in to continue.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
