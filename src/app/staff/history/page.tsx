import { AppLayout } from '@/components/layout/app-layout';
import { staffData } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export default function JobHistoryPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Job History</h1>
          <p className="text-muted-foreground">
            A complete timeline of career progression for all staff members.
          </p>
        </div>
        
        <div className="space-y-8">
            {staffData.map(staff => (
                <Card key={staff.id}>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border-2 border-primary">
                                <AvatarImage src={staff.avatar} alt={staff.name} data-ai-hint="avatar" />
                                <AvatarFallback className="text-xl">
                                    {staff.name.charAt(0)}
                                </AvatarFallback>
                                </Avatar>
                                <div>
                                <h2 className="text-xl font-bold font-headline">{staff.name}</h2>
                                <p className="text-muted-foreground">{staff.email}</p>
                                </div>
                            </div>
                            <Button asChild variant="outline">
                                <Link href={`/staff/${staff.id}`}>View Profile</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative pl-6">
                            <div className="absolute left-[30px] h-full w-0.5 -translate-x-1/2 bg-border"></div>
                            {staff.jobHistory.map((job, index) => (
                            <div key={index} className="relative mb-6 flex items-start gap-6">
                                <div className="absolute left-[30px] top-1.5 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-background bg-primary"></div>
                                <div className="min-w-[80px] pt-0.5 text-right text-sm text-muted-foreground">
                                <p>{formatDate(job.startDate)} -</p>
                                <p>{job.endDate ? formatDate(job.endDate) : 'Present'}</p>
                                </div>
                                <div>
                                <h4 className="font-semibold">{job.position} @ {job.company}</h4>
                                </div>
                            </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
        
        {staffData.length === 0 && (
            <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                    <Briefcase className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="text-lg font-semibold">No Staff Found</h3>
                    <p className="text-sm">Add staff members to see their job history.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </AppLayout>
  );
}
