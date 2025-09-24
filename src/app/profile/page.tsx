import { AppLayout } from '@/components/layout/app-layout';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import { currentUser } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

export default function ProfilePage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} data-ai-hint="avatar" />
              <AvatarFallback className="text-3xl">
                {currentUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold font-headline">{currentUser.name}</h1>
              <p className="text-muted-foreground">{currentUser.category} @ {currentUser.region}</p>
            </div>
          </div>
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
        <ProfileTabs user={currentUser} />
      </div>
    </AppLayout>
  );
}
