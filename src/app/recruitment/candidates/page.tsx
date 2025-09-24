import { AppLayout } from '@/components/layout/app-layout';
import { SkillsTab } from '@/components/profile/skills-tab';

export default function CandidatesPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Candidates</h1>
          <p className="text-muted-foreground">
            Manage candidate applications and resumes.
          </p>
        </div>
        {/* The SkillsTab contains the ResumeExtractor and skill display logic */}
        <SkillsTab skills={[]} />
      </div>
    </AppLayout>
  );
}
