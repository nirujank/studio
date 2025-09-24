import { AppLayout } from '@/components/layout/app-layout';
import { SkillsTab } from '@/components/profile/skills-tab';
import { currentUser } from '@/lib/data';

export default function RecruitmentPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Recruitment</h1>
          <p className="text-muted-foreground">
            Manage your recruitment and intake lifecycle.
          </p>
        </div>
        {/* The SkillsTab contains the ResumeExtractor and skill display logic */}
        <SkillsTab skills={[]} />
      </div>
    </AppLayout>
  );
}
