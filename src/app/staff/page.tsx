import { AppLayout } from '@/components/layout/app-layout';
import { StaffTable } from '@/components/dashboard/staff-table';
import { staffData } from '@/lib/data';

export default function StaffPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <StaffTable staffData={staffData} />
      </div>
    </AppLayout>
  );
}
