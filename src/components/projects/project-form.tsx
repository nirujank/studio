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
import { Textarea } from '../ui/textarea';
import { DatePicker } from '../ui/date-picker';

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Project Info</CardTitle>
              <CardDescription>
                Core details about the project.
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
                <Label htmlFor="owner">Project Owner</Label>
                <Input id="owner" name="owner" defaultValue={project?.owner} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">Project Manager</Label>
                <Input id="manager" name="manager" defaultValue={project?.manager} required />
              </div>
              <div className="space-y-2">
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
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Resources & Roles</CardTitle>
              <CardDescription>Manage team members and their allocation.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="resources">Team Members & Allocation</Label>
                    <Textarea id="resources" name="resources" placeholder="e.g., Alex Johnson (Developer, 100%), Maria Garcia (Designer, 50%)" />
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Stack</CardTitle>
              <CardDescription>Specify the technologies used in this project.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="languages">Programming Languages</Label>
                <Input id="languages" name="languages" placeholder="e.g., TypeScript, C#" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="frameworks">Frameworks & Libraries</Label>
                <Input id="frameworks" name="frameworks" placeholder="e.g., Next.js, .NET Core" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="databases">Databases</Label>
                <Input id="databases" name="databases" placeholder="e.g., Firestore, SQL Server" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cloudProvider">Cloud Provider</Label>
                <Input id="cloudProvider" name="cloudProvider" placeholder="e.g., Firebase, Azure" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="integrations">Third-party Integrations</Label>
                <Input id="integrations" name="integrations" placeholder="e.g., Stripe, SendGrid" />
              </div>
               <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="devOps">DevOps Tools</Label>
                <Input id="devOps" name="devOps" placeholder="e.g., GitHub Actions, Jira, Docker" />
              </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Timeline & Estimation</CardTitle>
              <CardDescription>Define project schedule and effort.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <DatePicker name="startDate" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Target Completion Date</Label>
                <DatePicker name="endDate" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedHours">Estimated Effort (hours)</Label>
                <Input id="estimatedHours" name="estimatedHours" type="number" placeholder="e.g., 800" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="milestones">Milestones</Label>
                <Textarea id="milestones" name="milestones" placeholder="e.g., MVP Launch (YYYY-MM-DD), UAT, Go-Live" />
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Maintenance & Support</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bugTrackerUrl">Bug Tracking Tool URL</Label>
                <Input id="bugTrackerUrl" name="bugTrackerUrl" placeholder="https://jira.example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sla">Support SLA</Label>
                <Input id="sla" name="sla" placeholder="e.g., 24-hour response" />
              </div>
               <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="escalationContacts">Escalation Contacts</Label>
                <Input id="escalationContacts" name="escalationContacts" placeholder="e.g., Manager Name, Lead Engineer Name" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="architectureUrl">Architecture Docs URL</Label>
                <Input id="architectureUrl" name="architectureUrl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiUrl">API Docs URL</Label>
                <Input id="apiUrl" name="apiUrl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wikiUrl">Knowledge Base / Wiki URL</Label>
                <Input id="wikiUrl" name="wikiUrl" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Risks & Dependencies</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="space-y-2">
                    <Label htmlFor="risks">Key Risks & Mitigation</Label>
                    <Textarea id="risks" name="risks" placeholder="Describe key risks and their mitigation plans." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dependencies">Dependencies</Label>
                    <Textarea id="dependencies" name="dependencies" placeholder="List internal modules or external APIs this project depends on." />
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Financials (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
                    <Input id="estimatedCost" name="estimatedCost" type="number" placeholder="e.g., 50000" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="licensingCost">Licensing Costs ($)</Label>
                    <Input id="licensingCost" name="licensingCost" type="number" placeholder="e.g., 2000" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="budgetOwner">Budget Owner</Label>
                    <Input id="budgetOwner" name="budgetOwner" placeholder="e.g., Finance Dept" />
                </div>
            </CardContent>
          </Card>

        </div>

        <div className="lg:col-span-1">
            <Card className="sticky top-4">
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button type="submit" className="w-full">
                        <Save className="mr-2 h-4 w-4" />
                        {isEditMode ? 'Save Changes' : 'Add Project'}
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </form>
  );
}
