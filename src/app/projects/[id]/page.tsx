import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { projectData } from '@/lib/data';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = projectData.find(p => p.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/projects">
              <ChevronLeft />
              <span className="sr-only">Back to projects</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-headline">{project.name}</h1>
            <p className="text-muted-foreground">Project Details for {project.code}</p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Under Construction</CardTitle>
            <CardDescription>The detailed project view is being built.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground">The full project details with tabs for resources, tech stack, timeline, etc., will be available here soon.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
