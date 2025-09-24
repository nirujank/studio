import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/80 to-secondary p-4">
       <div className="absolute left-4 top-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/login">
            <ChevronLeft />
            Back to Login
          </Link>
        </Button>
      </div>
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4">
            <Image src="/logo.png" alt="Invorg Logo" width={64} height={64} />
          </div>
          <h1 className="text-3xl font-bold font-headline text-foreground">
            Password Reset
          </h1>
          <p className="text-muted-foreground text-center">
            Enter your email to request a password reset from the PCO.
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
