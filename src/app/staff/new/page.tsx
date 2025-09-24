import { AppLayout } from '@/components/layout/app-layout';
import { StaffForm } from '@/components/staff/staff-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function NewStaffPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
         <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/staff">
              <ChevronLeft />
              <span className="sr-only">Back to staff</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-headline">Add New Staff Member</h1>
            <p className="text-muted-foreground">Fill out the form to add a new employee to the system.</p>
          </div>
        </div>
        <StaffForm />
      </div>
    </AppLayout>
  );
}
