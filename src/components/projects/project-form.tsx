'use client';

import type { Project, Tenant, StaffMember } from '@/lib/data';
import { tenantData, staffData } from '@/lib/data';
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
import { Save, PlusCircle, Trash2, Sparkles, Loader2, Info } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { DatePicker } from '../ui/date-picker';
import React, { useState, useTransition, useEffect } from 'react';
import { getFitScoreAction } from '@/app/actions';
import type { CalculateProjectFitScoreOutput } from '@/ai/flows/calculate-project-fit-score';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

type ProjectFormProps = {
  project?: Project | Partial<Project>;
};

type Resource = {
  id: string;
  userId: string;
  role: string;
  allocation: number;
};

type FitScoreResult = (CalculateProjectFitScoreOutput & { userId: string }) | null;


export function ProjectForm({ project }: ProjectFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditMode = !!project && 'id' in project;

  const [formData, setFormData] = useState({
    name: project?.name || '',
    code: project?.code || '',
    version: project?.version || '',
    owner: project?.owner || '',
    manager: project?.manager || '',
    tenantId: 'tenantId' in project ? project.tenantId : '',
  });

  const [techStack, setTechStack] = useState({
    languages: project?.techStack?.languages?.join(', ') || '',
    frameworks: project?.techStack?.frameworks?.join(', ') || '',
    databases: project?.techStack?.databases?.join(', ') || '',
    cloudProvider: project?.techStack?.cloudProvider || '',
    integrations: project?.techStack?.integrations?.join(', ') || '',
    devOps: project?.techStack?.devOps?.join(', ') || '',
  });
  
  const [timeline, setTimeline] = useState({
    startDate: project?.timeline?.startDate ? new Date(project.timeline.startDate) : undefined,
    endDate: project?.timeline?.endDate ? new Date(project.timeline.endDate) : undefined,
  });

  const initialResources =
    project?.resources?.teamMembers?.map((tm) => ({
      id: tm.userId + Date.now(), // simple unique id
      userId: tm.userId,
      role: tm.role,
      allocation: tm.allocation,
    })) || [];

  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [isCheckingFit, startFitCheck] = useTransition();
  const [fitScores, setFitScores] = useState<Record<string, FitScoreResult>>({});

  useEffect(() => {
    if (project) {
        setFormData({
            name: project.name || '',
            code: 'code' in project ? project.code : '',
            version: 'version' in project ? project.version : '',
            owner: project.owner || '',
            manager: project.manager || '',
            tenantId: 'tenantId' in project ? project.tenantId : '',
        });
        setTechStack({
            languages: project.techStack?.languages?.join(', ') || '',
            frameworks: project.techStack?.frameworks?.join(', ') || '',
            databases: project.techStack?.databases?.join(', ') || '',
            cloudProvider: project.techStack?.cloudProvider || '',
            integrations: project.techStack?.integrations?.join(', ') || '',
            devOps: project.techStack?.devOps?.join(', ') || '',
        });
        setTimeline({
            startDate: project.timeline?.startDate ? new Date(project.timeline.startDate) : undefined,
            endDate: project.timeline?.endDate ? new Date(project.timeline.endDate) : undefined,
        });
    }
  }, [project]);


  const handleAddResource = () => {
    setResources([
      ...resources,
      { id: `new-${Date.now()}`, userId: '', role: '', allocation: 100 },
    ]);
  };

  const handleRemoveResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  const handleResourceChange = (
    id: string,
    field: keyof Resource,
    value: string | number
  ) => {
    setResources(
      resources.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
     if (field === 'userId') {
      // Clear fit score when user changes
      setFitScores(prev => {
        const newScores = { ...prev };
        delete newScores[id];
        return newScores;
      });
    }
  };

  const handleTechStackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTechStack(prev => ({...prev, [name]: value}));
  };

  const handleCheckFit = (resourceId: string, userId: string) => {
    if (!userId) {
      toast({
        variant: 'destructive',
        title: 'No Staff Member Selected',
        description: 'Please select a staff member before checking their fit.',
      });
      return;
    }

    const combinedTechStack = Object.values(techStack).flatMap(item => item.split(',').map(s => s.trim()).filter(Boolean));
    if(combinedTechStack.length === 0) {
        toast({
            variant: 'destructive',
            title: 'Tech Stack is Empty',
            description: 'Please define the technical stack for the project first.',
        });
        return;
    }

    startFitCheck(async () => {
      const result = await getFitScoreAction(userId, combinedTechStack);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error Calculating Fit',
          description: result.error,
        });
         setFitScores(prev => ({...prev, [resourceId]: null}));
      } else if (result.data) {
        setFitScores(prev => ({...prev, [resourceId]: { ...result.data, userId }}));
      }
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElData = new FormData(event.currentTarget);
    const name = formElData.get('name') as string;

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
                <Input id="name" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Project Code</Label>
                <Input
                  id="code"
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  name="version"
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({...formData, version: e.target.value})}
                  required
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="owner">Project Owner</Label>
                <Input id="owner" name="owner" value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">Project Manager</Label>
                <Input id="manager" name="manager" value={formData.manager} onChange={(e) => setFormData({...formData, manager: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenantId">Tenant</Label>
                <Select name="tenantId" value={formData.tenantId} onValueChange={(value) => setFormData({...formData, tenantId: value})}>
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
              <CardTitle>Technical Stack</CardTitle>
              <CardDescription>Specify the technologies used in this project. Use comma-separated values.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="languages">Programming Languages</Label>
                <Input id="languages" name="languages" placeholder="e.g., TypeScript, C#" value={techStack.languages} onChange={handleTechStackChange} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="frameworks">Frameworks & Libraries</Label>
                <Input id="frameworks" name="frameworks" placeholder="e.g., Next.js, .NET Core" value={techStack.frameworks} onChange={handleTechStackChange} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="databases">Databases</Label>
                <Input id="databases" name="databases" placeholder="e.g., Firestore, SQL Server" value={techStack.databases} onChange={handleTechStackChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cloudProvider">Cloud Provider</Label>
                <Input id="cloudProvider" name="cloudProvider" placeholder="e.g., Firebase, Azure" value={techStack.cloudProvider} onChange={handleTechStackChange} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="integrations">Third-party Integrations</Label>
                <Input id="integrations" name="integrations" placeholder="e.g., Stripe, SendGrid" value={techStack.integrations} onChange={handleTechStackChange} />
              </div>
               <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="devOps">DevOps Tools</Label>
                <Input id="devOps" name="devOps" placeholder="e.g., GitHub Actions, Jira, Docker" value={techStack.devOps} onChange={handleTechStackChange} />
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Resources & Roles</CardTitle>
                <CardDescription>Manage team members and their allocation. Check their skill fit.</CardDescription>
              </div>
               <Button type="button" variant="outline" size="sm" onClick={handleAddResource}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {resources.map((resource) => (
                <div key={resource.id} className="p-4 border rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                    <div className="md:col-span-4 space-y-1">
                      <Label htmlFor={`resource-user-${resource.id}`} className="text-xs">Staff Member</Label>
                      <Select
                        name={`resource_user_${resource.id}`}
                        value={resource.userId}
                        onValueChange={(value) => handleResourceChange(resource.id, 'userId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                        <SelectContent>
                          {staffData.map((staff: StaffMember) => (
                            <SelectItem key={staff.id} value={staff.id}>
                              {staff.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-3 space-y-1">
                      <Label htmlFor={`resource-role-${resource.id}`} className="text-xs">Role</Label>
                      <Input
                        id={`resource-role-${resource.id}`}
                        name={`resource_role_${resource.id}`}
                        placeholder="e.g., Lead Developer"
                        value={resource.role}
                        onChange={(e) => handleResourceChange(resource.id, 'role', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <Label htmlFor={`resource-alloc-${resource.id}`} className="text-xs">Allocation %</Label>
                      <Input
                        id={`resource-alloc-${resource.id}`}
                        name={`resource_alloc_${resource.id}`}
                        type="number"
                        placeholder="100"
                        value={resource.allocation}
                        onChange={(e) => handleResourceChange(resource.id, 'allocation', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="md:col-span-3 flex items-end justify-end h-full gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCheckFit(resource.id, resource.userId)}
                        disabled={isCheckingFit}
                      >
                         {isCheckingFit ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Check Fit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleRemoveResource(resource.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {fitScores[resource.id] && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">AI Fit Assessment for {staffData.find(s => s.id === resource.userId)?.name}</p>
                         <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="grid gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium leading-none">Fit Score Details</h4>
                                <p className="text-sm text-muted-foreground">
                                  {fitScores[resource.id]?.explanation}
                                </p>
                              </div>
                              <div className="grid gap-2">
                                <div className="font-semibold">Matching Skills</div>
                                {fitScores[resource.id]!.matchingSkills.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                    {fitScores[resource.id]!.matchingSkills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                                    </div>
                                ) : <p className="text-sm text-muted-foreground">None</p>}
                              </div>
                               <div className="grid gap-2">
                                <div className="font-semibold">Missing Skills</div>
                                 {fitScores[resource.id]!.missingSkills.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                    {fitScores[resource.id]!.missingSkills.map(skill => <Badge key={skill} variant="destructive">{skill}</Badge>)}
                                    </div>
                                ) : <p className="text-sm text-muted-foreground">None</p>}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex items-center gap-4">
                        <Progress value={fitScores[resource.id]?.fitScore || 0} className="w-full" />
                        <span className="font-bold text-lg">{fitScores[resource.id]?.fitScore.toFixed(0)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
               {resources.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No team members added.</p>}
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
                <DatePicker name="startDate" defaultValue={timeline.startDate} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Target Completion Date</Label>
                <DatePicker name="endDate" defaultValue={timeline.endDate} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedHours">Estimated Effort (hours)</Label>
                <Input id="estimatedHours" name="estimatedHours" type="number" placeholder="e.g., 800" defaultValue={project?.timeline?.estimatedHours} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="milestones">Milestones</Label>
                <Textarea id="milestones" name="milestones" placeholder="e.g., MVP Launch (YYYY-MM-DD), UAT, Go-Live" defaultValue={project?.timeline?.milestones?.map(m => `${m.name} (${m.date})`).join('\n')} />
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
                <Input id="bugTrackerUrl" name="bugTrackerUrl" placeholder="https://jira.example.com" defaultValue={'support' in project ? project.support?.bugTrackerUrl : ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sla">Support SLA</Label>
                <Input id="sla" name="sla" placeholder="e.g., 24-hour response" defaultValue={'support' in project ? project.support?.sla : ''} />
              </div>
               <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="escalationContacts">Escalation Contacts</Label>
                <Input id="escalationContacts" name="escalationContacts" placeholder="e.g., Manager Name, Lead Engineer Name" defaultValue={'support' in project ? project.support?.escalationContacts.join(', ') : ''} />
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
                <Input id="architectureUrl" name="architectureUrl" defaultValue={'documentation' in project ? project.documentation?.architectureUrl : ''}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiUrl">API Docs URL</Label>
                <Input id="apiUrl" name="apiUrl" defaultValue={'documentation' in project ? project.documentation?.apiUrl : ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wikiUrl">Knowledge Base / Wiki URL</Label>
                <Input id="wikiUrl" name="wikiUrl" defaultValue={'documentation' in project ? project.documentation?.wikiUrl : ''}/>
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
                    <Textarea id="risks" name="risks" placeholder="Describe key risks and their mitigation plans." defaultValue={'risks' in project ? project.risks?.map(r => r.description).join('\n') : ''} />
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
                    <Input id="estimatedCost" name="estimatedCost" type="number" placeholder="e.g., 50000" defaultValue={project?.financials?.estimatedCost} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="licensingCost">Licensing Costs ($)</Label>
                    <Input id="licensingCost" name="licensingCost" type="number" placeholder="e.g., 2000" defaultValue={project?.financials?.licensingCost} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="budgetOwner">Budget Owner</Label>
                    <Input id="budgetOwner" name="budgetOwner" placeholder="e.g., Finance Dept" defaultValue={project?.financials?.budgetOwner} />
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
