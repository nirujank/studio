import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { projectData } from '@/lib/data';
import { FolderKanban, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold font-headline">Projects</h1>
                <p className="text-muted-foreground">
                    A dashboard of all current and upcoming projects.
                </p>
            </div>
            <Button asChild>
                <Link href="/projects/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Project
                </Link>
            </Button>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {projectData.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-xl mb-1">{project.name}</CardTitle>
                    <CardDescription>{project.tenantName}</CardDescription>
                  </div>
                  <FolderKanban className="h-6 w-6 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Manager:</strong> {project.manager}</p>
                  <p><strong>Version:</strong> {project.version}</p>
                  <p><strong>Timeline:</strong> {new Date(project.timeline.startDate).toLocaleDateString()} - {new Date(project.timeline.endDate).toLocaleDateString()}</p>
                </div>
              </CardContent>
              <div className="p-6 pt-0">
                 <Button asChild variant="outline" className="w-full">
                    <Link href={`/projects/${project.id}`}>View Details</Link>
                 </Button>
              </div>
            </Card>
          ))}
        </div>

        {projectData.length === 0 && (
           <Card>
            <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                    <p>No projects found.</p>
                    <p className="text-sm">Get started by creating a new project.</p>
                </div>
            </CardContent>
        </Card>
        )}
      </div>
    </AppLayout>
  );
}
