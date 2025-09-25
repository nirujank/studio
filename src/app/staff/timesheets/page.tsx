'use client';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { projectData, staffData } from '@/lib/data';
import { useState, useEffect, useMemo } from 'react';
import { format, isWithinInterval } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';

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
    const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
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
        {
            id: '5',
            userId: 'USR-001',
            date: new Date(monday.getTime() + 172800000), // Add two days
            projectId: 'PROJ-003',
            milestone: 'Proof of Concept',
            hours: 4,
            payType: 'Overtime',
            description: 'Initial quantum computing simulation setup.'
        },
    ]
}

const payTypes = [
  { value: 'all', label: 'All Pay Types' },
  { value: 'Regular', label: 'Regular' },
  { value: 'Overtime', label: 'Overtime' },
  { value: 'Holiday', label: 'Holiday' },
];

export default function AdminE6Page() {
  const [allEntries, setAllEntries] = useState<TimesheetEntry[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedPayType, setSelectedPayType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    setAllEntries(getInitialEntries());
  }, []);

  const filteredEntries = useMemo(() => {
    return allEntries.filter(entry => {
        const isUserMatch = selectedUserId === 'all' || entry.userId === selectedUserId;
        const isProjectMatch = selectedProjectId === 'all' || entry.projectId === selectedProjectId;
        const isPayTypeMatch = selectedPayType === 'all' || entry.payType === selectedPayType;
        const isDateMatch = !dateRange || !dateRange.from || !dateRange.to || isWithinInterval(entry.date, { start: dateRange.from, end: dateRange.to });

        return isUserMatch && isProjectMatch && isPayTypeMatch && isDateMatch;
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [allEntries, selectedUserId, selectedProjectId, selectedPayType, dateRange]);
  
  const selectedUserName = useMemo(() => {
    if (selectedUserId === 'all') return 'All Staff';
    return staffData.find(s => s.id === selectedUserId)?.name || 'selected user';
  }, [selectedUserId]);

  const resetFilters = () => {
    setSelectedUserId('all');
    setSelectedProjectId('all');
    setSelectedPayType('all');
    setDateRange(undefined);
  }
  
  const staffOptions = [{ value: 'all', label: 'All Staff' }, ...staffData.map(s => ({ value: s.id, label: s.name }))];
  const projectOptions = [{ value: 'all', label: 'All Projects' }, ...projectData.map(p => ({ value: p.id, label: p.name }))];


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
            <CardDescription>Select filters to narrow down timesheet entries.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2 lg:col-span-1">
                    <Label htmlFor="staff-select">Staff Member</Label>
                    <Combobox
                        options={staffOptions}
                        selectedValue={selectedUserId}
                        onSelect={setSelectedUserId}
                        placeholder="Select staff"
                        searchPlaceholder="Search staff..."
                        notFoundText="No staff found."
                    />
                </div>
                <div className="space-y-2 lg:col-span-1">
                    <Label htmlFor="project-select">Project</Label>
                    <Combobox
                        options={projectOptions}
                        selectedValue={selectedProjectId}
                        onSelect={setSelectedProjectId}
                        placeholder="Select project"
                        searchPlaceholder="Search projects..."
                        notFoundText="No project found."
                    />
                </div>
                <div className="space-y-2 lg:col-span-1">
                    <Label htmlFor="pay-type-select">Pay Type</Label>
                    <Combobox
                        options={payTypes}
                        selectedValue={selectedPayType}
                        onSelect={setSelectedPayType}
                        placeholder="Select pay type"
                        searchPlaceholder="Search types..."
                        notFoundText="No type found."
                    />
                </div>
                 <div className="space-y-2 lg:col-span-1">
                    <Label htmlFor="date-range">Date Range</Label>
                    <DateRangePicker date={dateRange} onDateChange={setDateRange} id="date-range" />
                </div>
                <div className="flex items-end">
                    <Button onClick={resetFilters} variant="outline" className="w-full">Reset</Button>
                </div>
            </div>
            
            <h3 className="font-semibold pt-4">Filtered Entries</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Pay Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length > 0 ? (
                  filteredEntries.map(entry => {
                    const project = projectData.find(p => p.id === entry.projectId);
                    const staff = staffData.find(s => s.id === entry.userId);
                    return (
                      <TableRow key={entry.id}>
                        <TableCell>{staff?.name || 'N/A'}</TableCell>
                        <TableCell>{format(entry.date, 'PPP')}</TableCell>
                        <TableCell>{project?.name || 'N/A'}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{entry.description}</TableCell>
                        <TableCell>{entry.hours}</TableCell>
                        <TableCell>
                          <Badge variant={entry.payType === 'Overtime' ? 'destructive' : 'secondary'}>{entry.payType}</Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No entries match the selected filters.
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

    