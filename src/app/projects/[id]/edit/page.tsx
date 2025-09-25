
import { AppLayout } from '@/components/layout/app-layout';
import { ProjectForm } from '@/components/projects/project-form';
import { projectData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const project = projectData.find((p) => p.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href={`/projects/${project.id}`}>
              <ChevronLeft />
              <span className="sr-only">Back to project details</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-headline">Edit Project</h1>
            <p className="text-muted-foreground">Making changes to {project.name}.</p>
          </div>
        </div>
        <ProjectForm project={project} />
      </div>
    </AppLayout>
  );
}
