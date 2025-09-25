'use client';
import { AppLayout } from '@/components/layout/app-layout';
import { E6TimesheetForm } from '@/components/staff/e6-timesheet-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { projectData } from '@/lib/data';
import { useState, useEffect, useMemo } from 'react';
import { format, startOfWeek, endOfWeek, isWithinInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

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
            date: new Date(monday.getTime() + 86400000), // Add a day
            projectId: 'PROJ-001',
            milestone: 'Full Feature Rollout',
            hours: 6,
            payType: 'Regular',
            description: 'Code reviews and addressed PR feedback.'
        },
        {
            id: '3',
            date: new Date(monday.getTime() + 86400000 * 2), // Add 2 days
            projectId: 'PROJ-003',
            milestone: 'Proof of Concept',
            hours: 2,
            payType: 'Overtime',
            description: 'Initial setup for Quantum Leap project environment.'
        },
    ]
}

type ViewMode = 'day' | 'week' | 'month';

export default function E6Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();


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

  const handleOpenDialog = (entry: TimesheetEntry | null = null) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEntry(null);
  };

  const handleEntrySubmit = (newEntryData: Omit<TimesheetEntry, 'id'>) => {
    if (editingEntry) {
        // Update existing entry
        setEntries(prev => prev.map(e => e.id === editingEntry.id ? { ...e, ...newEntryData } : e));
        toast({ title: "Entry Updated", description: "Your timesheet entry has been updated." });
    } else {
        // Add new entry
        setEntries(prev => [...prev, { ...newEntryData, id: Date.now().toString() }].sort((a, b) => b.date.getTime() - a.date.getTime()));
        toast({ title: "Entry Added", description: `Logged ${newEntryData.hours} hours.` });
    }
    handleCloseDialog();
  };
  
  const handleDeleteEntry = () => {
    if (deletingEntryId) {
      setEntries(prev => prev.filter(e => e.id !== deletingEntryId));
      toast({ title: "Entry Deleted", description: "The timesheet entry has been removed." });
      setDeletingEntryId(null);
    }
  };

  const displayedEntries = useMemo(() => {
    let interval: { start: Date; end: Date };

    switch (viewMode) {
      case 'day':
        interval = { start: selectedDate, end: selectedDate };
        return entries.filter(entry => isSameDay(entry.date, selectedDate)).sort((a, b) => b.date.getTime() - a.date.getTime());
      case 'week':
        interval = { start: startOfWeek(selectedDate, { weekStartsOn: 1 }), end: endOfWeek(selectedDate, { weekStartsOn: 1 }) };
        break;
      case 'month':
        interval = { start: startOfMonth(selectedDate), end: endOfMonth(selectedDate) };
        break;
    }

    return entries
      .filter(entry => isWithinInterval(entry.date, interval))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [entries, selectedDate, viewMode]);

  const totalHours = useMemo(() => {
    return displayedEntries.reduce((acc, entry) => acc + entry.hours, 0);
  }, [displayedEntries]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
        setSelectedDate(date);
        setIsCalendarOpen(false);
    }
  }

  const getFilterTitle = () => {
    switch (viewMode) {
        case 'day':
            return format(selectedDate, 'PPP');
        case 'week':
            return `${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'MMM d')} - ${format(endOfWeek(selectedDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}`;
        case 'month':
            return format(selectedDate, 'MMMM yyyy');
    }
  }

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
                <Button onClick={() => handleOpenDialog()}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Log Time
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingEntry ? 'Edit' : 'Log'} Time</DialogTitle>
                  <DialogDescription>Enter your work details for a specific day.</DialogDescription>
                </DialogHeader>
                <E6TimesheetForm 
                  userId={userId} 
                  onEntrySubmit={handleEntrySubmit} 
                  entry={editingEntry}
                />
              </DialogContent>
            </Dialog>
        </div>

        <Card>
            <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <CardTitle>
                    Entries for {getFilterTitle()}
                    </CardTitle>
                    <CardDescription>
                    A summary of hours logged. Total: <span className="font-bold text-foreground">{totalHours} hours</span>
                    </CardDescription>
                </div>
                 <div className="flex gap-2 items-center">
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !selectedDate && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
                                disabled={(date) => date > new Date()}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Button variant={viewMode === 'day' ? 'default' : 'outline'} onClick={() => setViewMode('day')}>Day</Button>
                    <Button variant={viewMode === 'week' ? 'default' : 'outline'} onClick={() => setViewMode('week')}>Week</Button>
                    <Button variant={viewMode === 'month' ? 'default' : 'outline'} onClick={() => setViewMode('month')}>Month</Button>
                </div>
            </div>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Pay Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {displayedEntries.length > 0 ? (
                    displayedEntries.map(entry => {
                    const project = projectData.find(p => p.id === entry.projectId);
                    return (
                        <TableRow key={entry.id}>
                        <TableCell>{format(entry.date, 'PPP')}</TableCell>
                        <TableCell>{project?.name || 'N/A'}</TableCell>
                        <TableCell>{entry.hours}</TableCell>
                        <TableCell>
                            <Badge variant={entry.payType === 'Overtime' ? 'destructive' : 'secondary'}>{entry.payType}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(entry)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeletingEntryId(entry.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                        </TableCell>
                        </TableRow>
                    )
                    })
                ) : (
                    <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No entries for this period.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
      </div>

       <AlertDialog open={!!deletingEntryId} onOpenChange={() => setDeletingEntryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your timesheet entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingEntryId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEntry} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
