'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  const handlePasswordReset = () => {
    const email = emailRef.current?.value;
    if (email) {
      toast({
        title: 'Password Reset Requested',
        description: `A password reset request has been sent for ${email}. The PCO has been notified.`,
      });
    } else {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address before requesting a password reset.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Secure Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              defaultValue="admin@invorg.com"
              required
              ref={emailRef}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" defaultValue="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={handlePasswordReset}
          >
            Contact PCO for password reset
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
