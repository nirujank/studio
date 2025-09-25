'use client';
import { AppLayout } from '@/components/layout/app-layout';
import { staffData } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { LeaveRequestDialog } from '@/components/staff/leave-request-dialog';
import { useState, useEffect } from 'react';

export default function MyLeavePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<(typeof staffData)[0] | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = sessionStorage.getItem('userId');
      const user = staffData.find(s => s.id === userId);
      setCurrentUser(user || null);
    }
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold font-headline">My Leave Entitlements</h1>
                <p className="text-muted-foreground">
                    Monitor and manage your leave balances.
                </p>
            </div>
             <Button onClick={() => setIsDialogOpen(true)} disabled={!currentUser}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Request Leave
            </Button>
        </div>
        
        {currentUser ? (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Sick Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{currentUser.leave.sick.entitled - currentUser.leave.sick.taken}</div>
                <p className="text-xs text-muted-foreground">{currentUser.leave.sick.taken} of {currentUser.leave.sick.entitled} days taken</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Vacation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{currentUser.leave.vacation.entitled - currentUser.leave.vacation.taken}</div>
                <p className="text-xs text-muted-foreground">{currentUser.leave.vacation.taken} of {currentUser.leave.vacation.entitled} days taken</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Personal Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{currentUser.leave.personal.entitled - currentUser.leave.personal.taken}</div>
                <p className="text-xs text-muted-foreground">{currentUser.leave.personal.taken} of {currentUser.leave.personal.entitled} days taken</p>
              </CardContent>
            </Card>
          </div>
        ) : (
            <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                    <p>Loading your leave information...</p>
                </CardContent>
            </Card>
        )}
      </div>
      {currentUser && <LeaveRequestDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} staffId={currentUser.id} />}
    </AppLayout>
  );
}
