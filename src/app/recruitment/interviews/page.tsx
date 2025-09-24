import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function InterviewsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Interviews</h1>
          <p className="text-muted-foreground">
            Schedule and manage candidate interviews.
          </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
                <CardDescription>A list of all scheduled interviews.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                    <p>No interviews scheduled.</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
