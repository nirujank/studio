import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import type { StaffMember } from '@/lib/data';
import { PersonalInfoTab } from './personal-info-tab';
import { JobHistoryTab } from './job-history-tab';
import { SkillsTab } from './skills-tab';
import { User, Briefcase, Sparkles, School, HeartHandshake, Puzzle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ProfileTabsProps = {
  user: StaffMember;
};

const TrivialTab = ({ title, items }: { title: string; items: string[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="font-headline">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {items.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No information provided.</p>
      )}
    </CardContent>
  </Card>
);

export function ProfileTabs({ user }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:w-auto md:grid-cols-6">
        <TabsTrigger value="personal"><User className="mr-2 h-4 w-4" />Personal</TabsTrigger>
        <TabsTrigger value="history"><Briefcase className="mr-2 h-4 w-4" />History</TabsTrigger>
        <TabsTrigger value="skills"><Sparkles className="mr-2 h-4 w-4" />Skills</TabsTrigger>
        <TabsTrigger value="education" className="hidden md:flex"><School className="mr-2 h-4 w-4" />Education</TabsTrigger>
        <TabsTrigger value="hobbies" className="hidden md:flex"><Puzzle className="mr-2 h-4 w-4" />Hobbies</TabsTrigger>
        <TabsTrigger value="volunteering" className="hidden md:flex"><HeartHandshake className="mr-2 h-4 w-4" />Volunteering</TabsTrigger>
      </TabsList>
      <TabsContent value="personal">
        <PersonalInfoTab user={user} />
      </TabsContent>
      <TabsContent value="history">
        <JobHistoryTab jobHistory={user.jobHistory} />
      </TabsContent>
      <TabsContent value="skills">
        <SkillsTab skills={user.profile.skills} />
      </TabsContent>
       <TabsContent value="education">
        <TrivialTab title="Education" items={user.profile.education.map(e => `${e.degree}, ${e.university} (${e.year})`)} />
      </TabsContent>
      <TabsContent value="hobbies">
        <TrivialTab title="Hobbies" items={user.profile.hobbies} />
      </TabsContent>
      <TabsContent value="volunteering">
        <TrivialTab title="Volunteering" items={user.profile.volunteering} />
      </TabsContent>
    </Tabs>
  );
}
