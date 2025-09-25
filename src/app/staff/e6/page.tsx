'use client';
import { AppLayout } from '@/components/layout/app-layout';
import { E6TimesheetForm } from '@/components/staff/e6-timesheet-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { projectData } from '@/lib/data';
import { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export type TimesheetEntry = {
  id: string;
  date: Date;
  projectId: string;
  milestone: string;
  hours: number;
  payType: 'Regular' | 'Overtime' | 'Holiday';
  description: string;
};

export default function E6Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = sessionStorage.getItem('userId');
      setUserId(id);
      // In a real app, you would fetch entries for this user
      // For now, we'll use local state
    }
  }, []);

  const handleEntryAdded = (newEntry: Omit<TimesheetEntry, 'id'>) => {
    setEntries(prev => [...prev, { ...newEntry, id: Date.now().toString() }]);
  };
  
  const currentWeekEntries = entries.filter(entry => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    return entry.date >= weekStart && entry.date <= weekEnd;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">E6 Timesheet</h1>
          <p className="text-muted-foreground">Log your daily work hours.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <E6TimesheetForm userId={userId} onEntryAdded={handleEntryAdded} />
          </div>
          <div className="lg:col-span-2">
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
        </div>
      </div>
    </AppLayout>
  );
}
