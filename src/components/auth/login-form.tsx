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
import { Loader2, Check, ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { staffData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';


export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false)
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

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

  const users = [{email: 'admin@invorg.com'}, ...staffData];

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
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {email
                    ? users.find((user) => user.email.toLowerCase() === email.toLowerCase())?.email
                    : "Select email..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[340px] p-0">
                <Command>
                  <CommandInput placeholder="Search email..." />
                  <CommandList>
                    <CommandEmpty>No email found.</CommandEmpty>
                    <CommandGroup>
                      {users.map((user) => (
                        <CommandItem
                          key={user.email}
                          value={user.email}
                          onSelect={(currentValue) => {
                            setEmail(currentValue === email ? "" : currentValue)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              email === user.email ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {user.email}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
