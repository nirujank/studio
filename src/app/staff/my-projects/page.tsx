'use client';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { projectData, type StaffMember } from '@/lib/data';
import { FolderKanban } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MyProjectsPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = sessionStorage.getItem('userId');
      setUserId(id);
    }
  }, []);

  const myProjects = userId 
    ? projectData.filter(project => project.resources.teamMembers.some(member => member.userId === userId))
    : [];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold font-headline">My Projects</h1>
                <p className="text-muted-foreground">
                    A list of projects you are assigned to.
                </p>
            </div>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {myProjects.map((project) => (
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
                  <p><strong>My Role:</strong> {project.resources.teamMembers.find(m => m.userId === userId)?.role}</p>
                  <p><strong>My Allocation:</strong> {project.resources.teamMembers.find(m => m.userId === userId)?.allocation}%</p>
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

        {myProjects.length === 0 && (
           <Card>
            <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                    <p>You are not assigned to any projects.</p>
                </div>
            </CardContent>
        </Card>
        )}
      </div>
    </AppLayout>
  );
}
