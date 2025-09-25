'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '../ui/date-picker';
import { projectData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Combobox } from '../ui/combobox';

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

const payTypes = [
  { value: 'Regular', label: 'Regular' },
  { value: 'Overtime', label: 'Overtime' },
  { value: 'Holiday', label: 'Holiday' },
];

export function E6TimesheetForm({ userId, onEntryAdded }: E6TimesheetFormProps) {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedMilestone, setSelectedMilestone] = useState<string>('');
  const [selectedPayType, setSelectedPayType] = useState<string>('Regular');

  const userProjects = useMemo(() => {
    if (!userId) return [];
    return projectData
      .filter(project =>
        project.resources.teamMembers.some(member => member.userId === userId)
      )
      .map(p => ({ value: p.id, label: p.name }));
  }, [userId]);

  const projectMilestones = useMemo(() => {
    const project = projectData.find(p => p.id === selectedProject);
    return project?.timeline.milestones.map(m => ({ value: m.name, label: `${m.name} (${m.status})` })) || [];
  }, [selectedProject]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const date = formData.get('date') as string;
    const hours = formData.get('hours') as string;
    const description = formData.get('description') as string;

    if (!date || !selectedProject || !hours || !selectedPayType) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill out all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newEntry = {
      date: new Date(date),
      projectId: selectedProject,
      milestone: selectedMilestone,
      hours: parseFloat(hours),
      payType: selectedPayType as TimesheetEntry['payType'],
      description,
    };

    onEntryAdded(newEntry);

    toast({
      title: 'Timesheet Entry Added',
      description: `Logged ${hours} hours for ${projectData.find(p => p.id === selectedProject)?.name}.`,
    });
    (event.target as HTMLFormElement).reset();
    setSelectedProject('');
    setSelectedMilestone('');
    setSelectedPayType('Regular');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <DatePicker name="date" disabled={(date) => date > new Date()} />
      </div>
      <div className="space-y-2">
        <Label>Project Name</Label>
        <Combobox
          options={userProjects}
          selectedValue={selectedProject}
          onSelect={setSelectedProject}
          placeholder="Select a project"
          searchPlaceholder="Search projects..."
          notFoundText="No projects found."
        />
      </div>
      <div className="space-y-2">
        <Label>Project Milestone</Label>
        <Combobox
          options={projectMilestones}
          selectedValue={selectedMilestone}
          onSelect={setSelectedMilestone}
          placeholder="Select a milestone"
          searchPlaceholder="Search milestones..."
          notFoundText="No milestones found."
          disabled={!selectedProject}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hours">Hours</Label>
          <Input id="hours" name="hours" type="number" step="0.5" min="0" required />
        </div>
        <div className="space-y-2">
          <Label>Pay Type</Label>
          <Combobox
            options={payTypes}
            selectedValue={selectedPayType}
            onSelect={setSelectedPayType}
            placeholder="Select pay type"
            searchPlaceholder="Search types..."
            notFoundText="No type found."
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" placeholder="Describe the work done..." />
      </div>
      <div className="pt-4">
        <Button type="submit" className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Entry
        </Button>
      </div>
    </form>
  );
}

    