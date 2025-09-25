import { AppLayout } from '@/components/layout/app-layout';
import { staffData } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function LeavePage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold font-headline">Leave Entitlements</h1>
                <p className="text-muted-foreground">
                    Monitor and manage staff leave balances.
                </p>
            </div>
             <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Leave Request
            </Button>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Leave Balances</CardTitle>
                <CardDescription>An overview of leave entitlements for all staff.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Staff Member</TableHead>
                            <TableHead className="text-center">Sick (Rem)</TableHead>
                            <TableHead className="text-center">Vacation (Rem)</TableHead>
                            <TableHead className="text-center">Personal (Rem)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staffData.map(staff => (
                            <TableRow key={staff.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                        <AvatarImage src={staff.avatar} alt={staff.name} data-ai-hint="avatar" />
                                        <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">
                                        {staff.name}
                                        <div className="text-sm text-muted-foreground">
                                            {staff.email}
                                        </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="font-semibold">{staff.leave.sick.entitled - staff.leave.sick.taken}</div>
                                    <div className="text-xs text-muted-foreground">{staff.leave.sick.taken} / {staff.leave.sick.entitled} taken</div>
                                </TableCell>
                                 <TableCell className="text-center">
                                    <div className="font-semibold">{staff.leave.vacation.entitled - staff.leave.vacation.taken}</div>
                                    <div className="text-xs text-muted-foreground">{staff.leave.vacation.taken} / {staff.leave.vacation.entitled} taken</div>
                                </TableCell>
                                 <TableCell className="text-center">
                                    <div className="font-semibold">{staff.leave.personal.entitled - staff.leave.personal.taken}</div>
                                    <div className="text-xs text-muted-foreground">{staff.leave.personal.taken} / {staff.leave.personal.entitled} taken</div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
