'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { StaffMember } from '@/lib/data';
import { Briefcase } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type JobHistoryTabProps = {
  jobHistory: StaffMember['jobHistory'];
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export function JobHistoryTab({ jobHistory }: JobHistoryTabProps) {
  const chartData = [...jobHistory]
    .reverse()
    .map(job => ({
      date: formatDate(job.startDate),
      salary: job.salary
    }));

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Job History Timeline</CardTitle>
          <CardDescription>Your career journey at a glance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6">
            <div className="absolute left-[30px] h-full w-0.5 -translate-x-1/2 bg-border"></div>
            {jobHistory.map((job, index) => (
              <div key={index} className="relative mb-8 flex items-start gap-6">
                <div className="absolute left-[30px] top-1.5 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-background bg-primary"></div>
                <div className="min-w-[80px] pt-0.5 text-right text-sm text-muted-foreground">
                  <p>{formatDate(job.startDate)} -</p>
                  <p>{job.endDate ? formatDate(job.endDate) : 'Present'}</p>
                </div>
                <div>
                  <h4 className="font-semibold">{job.position}</h4>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                  <p className="text-sm font-medium text-primary">{formatCurrency(job.salary)}/year</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline">Salary Progression</CardTitle>
          <CardDescription>Visualizing your salary growth over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <XAxis 
                dataKey="date" 
                stroke="#888888" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(value) => `$${Number(value) / 1000}k`}
                stroke="#888888" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Salary']}
                contentStyle={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
              />
              <Line type="monotone" dataKey="salary" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
