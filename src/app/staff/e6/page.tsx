'use client';
import { AppLayout } from '@/components/layout/app-layout';
import { E6TimesheetForm } from '@/components/staff/e6-timesheet-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { projectData } from '@/lib/data';
import { useState, useEffect, useMemo } from 'react';
import { format, startOfWeek, endOfWeek, isWithinInterval, subDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


export type TimesheetEntry = {
  id: string;
  date: Date;
  projectId: string;
  milestone: string;
  hours: number;
  payType: 'Regular' | 'Overtime' | 'Holiday';
  description: string;
};

const getInitialEntries = (): TimesheetEntry[] => {
    const today = new Date();
    // Set entries to be within the current week for demonstration
    const monday = startOfWeek(today, { weekStartsOn: 1 });
    return [
         {
            id: '1',
            date: monday,
            projectId: 'PROJ-001',
            milestone: 'Full Feature Rollout',
            hours: 8,
            payType: 'Regular',
            description: 'Worked on Staff Hub Portal features, focusing on the new dashboard widgets.'
        },
        {
            id: '2',
            date: new Date(monday.setDate(monday.getDate() + 1)),
            projectId: 'PROJ-001',
            milestone: 'Full Feature Rollout',
            hours: 6,
            payType: 'Regular',
            description: 'Code reviews and addressed PR feedback.'
        },
        {
            id: '3',
            date: new Date(monday.setDate(monday.getDate() + 1)),
            projectId: 'PROJ-003',
            milestone: 'Proof of Concept',
            hours: 2,
            payType: 'Overtime',
            description: 'Initial setup for Quantum Leap project environment.'
        },
    ]
}


export default function E6Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // This effect runs once on mount to set initial data
    setEntries(getInitialEntries());
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = sessionStorage.getItem('userId');
      setUserId(id);
      // In a real app, you would fetch entries for this user
      // For now, we'll use local state with initial data
    }
  }, []);

  const handleEntryAdded = (newEntry: Omit<TimesheetEntry, 'id'>) => {
    setEntries(prev => [...prev, { ...newEntry, id: Date.now().toString() }]);
    setIsDialogOpen(false);
  };
  
  const currentWeekEntries = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    return entries.filter(entry => 
        isWithinInterval(entry.date, { start: weekStart, end: weekEnd })
    ).sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by most recent date first
  }, [entries]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold font-headline">E6 Timesheet</h1>
              <p className="text-muted-foreground">Log your daily work hours.</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Log Time
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Time</DialogTitle>
                  <DialogDescription>Enter your work details for a specific day.</DialogDescription>
                </DialogHeader>
                <E6TimesheetForm userId={userId} onEntryAdded={handleEntryAdded} />
              </DialogContent>
            </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>This Week's Entries</CardTitle>
            <CardDescription>A summary of hours logged this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Pay Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentWeekEntries.length > 0 ? (
                  currentWeekEntries.map(entry => {
                    const project = projectData.find(p => p.id === entry.projectId);
                    return (
                      <TableRow key={entry.id}>
                        <TableCell>{format(entry.date, 'PPP')}</TableCell>
                        <TableCell>{project?.name || 'N/A'}</TableCell>
                        <TableCell>{entry.hours}</TableCell>
                        <TableCell>
                          <Badge variant={entry.payType === 'Overtime' ? 'destructive' : 'secondary'}>{entry.payType}</Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No entries for this week.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
