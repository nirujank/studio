'use client';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { projectData, staffData } from '@/lib/data';
import { useState, useEffect, useMemo } from 'react';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';


export type TimesheetEntry = {
  id: string;
  userId: string;
  date: Date;
  projectId: string;
  milestone: string;
  hours: number;
  payType: 'Regular' | 'Overtime' | 'Holiday';
  description: string;
};

const getInitialEntries = (): TimesheetEntry[] => {
    const today = new Date();
    const monday = startOfWeek(today, { weekStartsOn: 1 });
    return [
         {
            id: '1',
            userId: 'USR-001',
            date: monday,
            projectId: 'PROJ-001',
            milestone: 'Full Feature Rollout',
            hours: 8,
            payType: 'Regular',
            description: 'Worked on Staff Hub Portal features, focusing on the new dashboard widgets.'
        },
        {
            id: '2',
            userId: 'USR-001',
            date: new Date(monday.getTime() + 86400000), // Add one day
            projectId: 'PROJ-001',
            milestone: 'Full Feature Rollout',
            hours: 6,
            payType: 'Regular',
            description: 'Code reviews and addressed PR feedback.'
        },
        {
            id: '3',
            userId: 'USR-002',
            date: monday,
            projectId: 'PROJ-001',
            milestone: 'MVP Launch',
            hours: 8,
            payType: 'Regular',
            description: 'Designed new icons for the staff dashboard.'
        },
         {
            id: '4',
            userId: 'USR-005',
            date: new Date(monday.getTime() + 86400000 * 2), // Add two days
            projectId: 'PROJ-001',
            milestone: 'Full Feature Rollout',
            hours: 8,
            payType: 'Regular',
            description: 'Configured CI/CD pipeline for the new feature branch.'
        },
    ]
}


export default function AdminE6Page() {
  const [allEntries, setAllEntries] = useState<TimesheetEntry[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  useEffect(() => {
    setAllEntries(getInitialEntries());
  }, []);

  const currentWeekEntries = useMemo(() => {
    if (!selectedUserId) return [];
    
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    
    return allEntries.filter(entry => 
        entry.userId === selectedUserId &&
        isWithinInterval(entry.date, { start: weekStart, end: weekEnd })
    ).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [allEntries, selectedUserId]);

  const selectedUserName = useMemo(() => {
    return staffData.find(s => s.id === selectedUserId)?.name || 'selected user';
  }, [selectedUserId]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">E6 Timesheets</h1>
            <p className="text-muted-foreground">Review timesheet entries for all staff members.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>View Timesheets</CardTitle>
            <CardDescription>Select a staff member to view their logged hours for the current week.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="max-w-xs space-y-2">
                <Label htmlFor="staff-select">Select Staff Member</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger id="staff-select">
                        <SelectValue placeholder="Select a staff member..." />
                    </SelectTrigger>
                    <SelectContent>
                        {staffData.map(staff => (
                            <SelectItem key={staff.id} value={staff.id}>
                                {staff.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <h3 className="font-semibold pt-4">Entries for {selectedUserName}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Description</TableHead>
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
                        <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                        <TableCell>{entry.hours}</TableCell>
                        <TableCell>
                          <Badge variant={entry.payType === 'Overtime' ? 'destructive' : 'secondary'}>{entry.payType}</Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      {selectedUserId ? `No entries for ${selectedUserName} this week.` : 'Please select a staff member to see their entries.'}
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
