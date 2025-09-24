import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function RequisitionsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Requisitions</h1>
          <p className="text-muted-foreground">
            Define, track, and manage job openings.
          </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Job Requisitions</CardTitle>
                <CardDescription>A list of all open positions.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                    <p>No requisitions found.</p>
                    <p className="text-sm">Get started by creating a new requisition.</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
