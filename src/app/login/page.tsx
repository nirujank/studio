import { LoginForm } from '@/components/auth/login-form';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/80 to-secondary p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4">
            <Image src="/logo.png" alt="Invorg Logo" width={64} height={64} />
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
