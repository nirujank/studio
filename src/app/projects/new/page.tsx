import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProjectPage() {
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
            <h1 className="text-2xl font-bold font-headline">Add New Project</h1>
            <p className="text-muted-foreground">Fill out the form to create a new project.</p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Under Construction</CardTitle>
            <CardDescription>This feature is not yet implemented.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">The form to create a new project will be available here soon.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}