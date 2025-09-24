import { AppLayout } from '@/components/layout/app-layout';
import { StaffForm } from '@/components/staff/staff-form';
import { staffData } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default function EditStaffPage({ params }: { params: { id: string } }) {
  const staffMember = staffData.find(s => s.id === params.id);

  if (!staffMember) {
    notFound();
  }

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
            <h1 className="text-2xl font-bold font-headline">Edit Staff Member</h1>
            <p className="text-muted-foreground">Editing profile for {staffMember.name}.</p>
          </div>
        </div>
        <StaffForm staffMember={staffMember} />
      </div>
    </AppLayout>
  );
}
