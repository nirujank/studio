import { AppLayout } from '@/components/layout/app-layout';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import { staffData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { currentUser as defaultUser } from '@/lib/data';

export default function ProfilePage({ params }: { params: { id: string } }) {
  // A temporary hack to allow `/profile` to work for the current user link in the top nav
  if (params.id === 'profile') {
      redirect(`/staff/${defaultUser.id}`);
  }
    
  const user = staffData.find(member => member.id === params.id);

  if (!user) {
    notFound();
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="avatar" />
              <AvatarFallback className="text-3xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
              <p className="text-muted-foreground">{user.jobTitle} @ {user.region}</p>
            </div>
          </div>
          <Button asChild>
            <Link href={`/staff/${user.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </div>
        <ProfileTabs user={user} />
      </div>
    </AppLayout>
  );
}
