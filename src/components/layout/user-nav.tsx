'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';
import { currentUser as adminUser, staffData } from '@/lib/data';
import { useEffect, useState } from 'react';

export function UserNav() {
  const [currentUser, setCurrentUser] = useState(adminUser);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const role = sessionStorage.getItem('userRole');
        const userId = sessionStorage.getItem('userId');

        if (role === 'staff' && userId) {
            const staffUser = staffData.find(s => s.id === userId);
            if (staffUser) {
                setCurrentUser(staffUser);
            }
        } else {
            setCurrentUser(adminUser);
        }
    }
  }, []);


  const handleLogout = () => {
    if(typeof window !== 'undefined') {
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('userId');
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={currentUser.avatar}
              alt={currentUser.name}
              data-ai-hint="avatar"
            />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/staff/${currentUser.id}`}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild onClick={handleLogout}>
          <Link href="/login">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
