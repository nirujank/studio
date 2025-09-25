'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { projectData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';

type TimesheetEntry = {
  id: string;
  date: Date;
  projectId: string;
  milestone: string;
  hours: number;
  payType: 'Regular' | 'Overtime' | 'Holiday';
  description: string;
};

type E6TimesheetFormProps = {
  userId: string | null;
  onEntryAdded: (entry: Omit<TimesheetEntry, 'id'>) => void;
};

export function E6TimesheetForm({ userId, onEntryAdded }: E6TimesheetFormProps) {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<string>('');

  const userProjects = useMemo(() => {
    if (!userId) return [];
    return projectData.filter(project => 
      project.resources.teamMembers.some(member => member.userId === userId)
    );
  }, [userId]);

  const projectMilestones = useMemo(() => {
    const project = userProjects.find(p => p.id === selectedProject);
    return project?.timeline.milestones || [];
  }, [selectedProject, userProjects]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const date = formData.get('date') as string;
    const projectId = formData.get('projectId') as string;
    const milestone = formData.get('milestone') as string;
    const hours = formData.get('hours') as string;
    const payType = formData.get('payType') as TimesheetEntry['payType'];
    const description = formData.get('description') as string;

    if (!date || !projectId || !hours || !payType) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill out all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newEntry = {
      date: new Date(date),
      projectId,
      milestone,
      hours: parseFloat(hours),
      payType,
      description,
    };

    onEntryAdded(newEntry);

    toast({
      title: 'Timesheet Entry Added',
      description: `Logged ${hours} hours for ${projectData.find(p => p.id === projectId)?.name}.`,
    });
    (event.target as HTMLFormElement).reset();
    setSelectedProject('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Log Time</CardTitle>
          <CardDescription>Enter your work details for a specific day.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <DatePicker name="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectId">Project Name</Label>
            <Select name="projectId" required onValueChange={setSelectedProject}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {userProjects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="milestone">Project Milestone</Label>
            <Select name="milestone" required disabled={!selectedProject}>
              <SelectTrigger>
                <SelectValue placeholder="Select a milestone" />
              </SelectTrigger>
              <SelectContent>
                {projectMilestones.map(milestone => (
                  <SelectItem key={milestone.name} value={milestone.name}>
                    {milestone.name} ({milestone.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label htmlFor="hours">Hours</Label>
              <Input id="hours" name="hours" type="number" step="0.5" min="0" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="payType">Pay Type</Label>
              <Select name="payType" required defaultValue="Regular">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Overtime">Overtime</SelectItem>
                  <SelectItem value="Holiday">Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Describe the work done..." />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Entry
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
