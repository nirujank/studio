import { AppLayout } from '@/components/layout/app-layout';
import { staffData } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SkillsPage() {
  const allSkills = [...new Set(staffData.flatMap(staff => staff.profile.skills))];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Skills & Training</h1>
          <p className="text-muted-foreground">
            An overview of skills across the organization.
          </p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>All Skills</CardTitle>
                <CardDescription>A list of all unique skills found in the organization.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {allSkills.map(skill => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                </div>
            </CardContent>
        </Card>

        <div className="space-y-4">
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
                        {staff.profile.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {staff.profile.skills.map((skill, index) => (
                                    <Badge key={`${skill}-${index}`}>{skill}</Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No skills listed for this staff member.</p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
        
        {staffData.length === 0 && (
            <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                    <Sparkles className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="text-lg font-semibold">No Staff Found</h3>
                    <p className="text-sm">Add staff members to see their skills.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </AppLayout>
  );
}
