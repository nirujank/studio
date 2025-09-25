'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '../ui/date-picker';
import { projectData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { Combobox } from '../ui/combobox';
import type { TimesheetEntry } from '@/app/staff/e6/page';

type E6TimesheetFormProps = {
  userId: string | null;
  onEntrySubmit: (entry: Omit<TimesheetEntry, 'id'>) => void;
  entry: TimesheetEntry | null;
};

const payTypes = [
  { value: 'Regular', label: 'Regular' },
  { value: 'Overtime', label: 'Overtime' },
  { value: 'Holiday', label: 'Holiday' },
];

export function E6TimesheetForm({ userId, onEntrySubmit, entry }: E6TimesheetFormProps) {
  const { toast } = useToast();
  
  const [date, setDate] = useState<Date | undefined>(entry?.date);
  const [hours, setHours] = useState<number | string>(entry?.hours || '');
  const [description, setDescription] = useState(entry?.description || '');
  const [selectedProject, setSelectedProject] = useState<string>(entry?.projectId || '');
  const [selectedMilestone, setSelectedMilestone] = useState<string>(entry?.milestone || '');
  const [selectedPayType, setSelectedPayType] = useState<string>(entry?.payType || 'Regular');

  useEffect(() => {
    setDate(entry?.date);
    setHours(entry?.hours || '');
    setDescription(entry?.description || '');
    setSelectedProject(entry?.projectId || '');
    setSelectedMilestone(entry?.milestone || '');
    setSelectedPayType(entry?.payType || 'Regular');
  }, [entry]);


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
    
    if (!date || !selectedProject || !hours || !selectedPayType) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill out all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newEntry = {
      date,
      projectId: selectedProject,
      milestone: selectedMilestone,
      hours: parseFloat(hours as string),
      payType: selectedPayType as TimesheetEntry['payType'],
      description,
    };

    onEntrySubmit(newEntry);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <DatePicker name="date" defaultValue={date} onDateSelect={setDate} disabled={(d) => d > new Date()} />
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
          <Input id="hours" name="hours" type="number" step="0.5" min="0" required value={hours} onChange={e => setHours(e.target.value)} />
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
        <Textarea id="description" name="description" placeholder="Describe the work done..." value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="pt-4">
        <Button type="submit" className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {entry ? 'Save Changes' : 'Save Entry'}
        </Button>
      </div>
    </form>
  );
}
