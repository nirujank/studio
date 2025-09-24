import { AppLayout } from '@/components/layout/app-layout';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { staffData } from '@/lib/data';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">PCO Dashboard</h1>
          <p className="text-muted-foreground">
            Analytics and management tools for Invorg staff.
          </p>
        </div>
        <StatsCards staffData={staffData} />
      </div>
    </AppLayout>
  );
}
