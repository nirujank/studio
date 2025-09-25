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
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { staffData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate finding the user
    const isAdmin = email.toLowerCase() === 'admin@invorg.com';
    const user = staffData.find(s => s.email.toLowerCase() === email.toLowerCase());

    setTimeout(() => {
      if (isAdmin) {
        sessionStorage.setItem('userRole', 'admin');
        sessionStorage.setItem('userId', 'admin-user-id'); // A placeholder admin ID
        router.push('/dashboard');
      } else if (user) {
        sessionStorage.setItem('userRole', 'staff');
        sessionStorage.setItem('userId', user.id);
        router.push(`/staff/${user.id}`);
      } else {
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'No user found with that email address.',
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
            asChild
          >
            <Link href="/reset-password">Forgot your password?</Link>
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
