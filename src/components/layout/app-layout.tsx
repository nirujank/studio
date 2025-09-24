import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { MainNav } from './main-nav';
import { UserNav } from './user-nav';
import Link from 'next/link';
import Image from 'next/image';
import { Notifications } from './notifications';
import { ThemeToggle } from './theme-toggle';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="flex flex-col" collapsible="offcanvas">
          <SidebarHeader className="border-b p-2">
            <div className="flex h-10 items-center justify-center gap-2.5">
              <ButtonOrLink>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                  <Image src="/logo.png" alt="Invorg Logo" width={32} height={32} />
                </div>
              </ButtonOrLink>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <h2 className="font-headline text-lg font-semibold tracking-tight">
                  Invorg
                </h2>
                <p className="text-xs text-muted-foreground">Staff Hub</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <MainNav />
          </SidebarContent>
          <SidebarFooter className="p-2">
            {/* Can add footer items here */}
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <SidebarTrigger />
            <div className="flex-1">
              {/* Maybe add breadcrumbs or page title here */}
            </div>
            <ThemeToggle />
            <Notifications />
            <UserNav />
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function ButtonOrLink({ children }: { children: React.ReactNode }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      {children}
    </Link>
  );
}
