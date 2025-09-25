'use client';

import type { Project, Tenant } from '@/lib/data';
import { tenantData } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';

type ProjectFormProps = {
  project?: Project;
};

export function ProjectForm({ project }: ProjectFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditMode = !!project;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;

    toast({
      title: isEditMode ? 'Project Updated' : 'Project Added',
      description: `Project "${name}" has been successfully ${
        isEditMode ? 'updated' : 'created'
      }.`,
    });

    router.push('/projects');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>
            Enter the details for the new project.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" name="name" defaultValue={project?.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Project Code</Label>
            <Input
              id="code"
              name="code"
              type="text"
              defaultValue={project?.code}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              name="version"
              type="text"
              defaultValue={project?.version}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manager">Project Manager</Label>
            <Input id="manager" name="manager" defaultValue={project?.manager} required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tenantId">Tenant</Label>
            <Select name="tenantId" defaultValue={project?.tenantId}>
              <SelectTrigger>
                <SelectValue placeholder="Select tenant" />
              </SelectTrigger>
              <SelectContent>
                {tenantData.map((tenant: Tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            {isEditMode ? 'Save Changes' : 'Add Project'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
