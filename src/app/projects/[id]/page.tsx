
'use client';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { projectData } from '@/lib/data';
import { ChevronLeft, Pencil } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    value ? (
        <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-muted-foreground">{label}</p>
            <p className="text-base">{value}</p>
        </div>
    ) : null
);

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const project = projectData.find(p => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon">
                    <Link href="/projects">
                    <ChevronLeft />
                    <span className="sr-only">Back to projects</span>
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-headline">{project.name}</h1>
                    <p className="text-muted-foreground">Project Details for {project.code}</p>
                </div>
            </div>
            <Button asChild>
                <Link href={`/projects/${project.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Project
                </Link>
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                {/* General Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>General Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailItem label="Project Name" value={project.name} />
                        <DetailItem label="Project Code" value={project.code} />
                        <DetailItem label="Version" value={project.version} />
                        <DetailItem label="Project Owner" value={project.owner} />
                        <DetailItem label="Project Manager" value={project.manager} />
                        <DetailItem label="Tenant" value={project.tenantName} />
                    </CardContent>
                </Card>

                {/* Tech Stack */}
                 <Card>
                    <CardHeader>
                        <CardTitle>Technical Stack</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <DetailItem label="Programming Languages" value={project.techStack.languages.join(', ')} />
                       <DetailItem label="Frameworks & Libraries" value={project.techStack.frameworks.join(', ')} />
                       <DetailItem label="Databases" value={project.techStack.databases.join(', ')} />
                       <DetailItem label="Cloud Provider" value={project.techStack.cloudProvider} />
                       <DetailItem label="Integrations" value={project.techStack.integrations.join(', ')} />
                       <DetailItem label="DevOps Tools" value={project.techStack.devOps.join(', ')} />
                    </CardContent>
                </Card>
                
                {/* Timeline */}
                 <Card>
                    <CardHeader>
                        <CardTitle>Timeline & Estimation</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <DetailItem label="Start Date" value={new Date(project.timeline.startDate).toLocaleDateString()} />
                         <DetailItem label="End Date" value={new Date(project.timeline.endDate).toLocaleDateString()} />
                         <DetailItem label="Estimated Hours" value={project.timeline.estimatedHours} />
                         <div>
                            <p className="text-sm font-semibold text-muted-foreground mb-2">Milestones</p>
                            <div className="space-y-2">
                                {project.timeline.milestones.map(m => (
                                    <div key={m.name} className="flex justify-between items-center text-sm">
                                        <span>{m.name} ({new Date(m.date).toLocaleDateString()})</span>
                                        <Badge variant={m.status === 'Completed' ? 'secondary' : 'outline'}>{m.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Documentation */}
                 <Card>
                    <CardHeader>
                        <CardTitle>Documentation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Architecture Docs" value={project.documentation.architectureUrl ? <Link href={project.documentation.architectureUrl} className="text-primary underline">View</Link> : 'N/A'} />
                        <DetailItem label="API Docs" value={project.documentation.apiUrl ? <Link href={project.documentation.apiUrl} className="text-primary underline">View</Link> : 'N/A'} />
                        <DetailItem label="Knowledge Base / Wiki" value={project.documentation.wikiUrl ? <Link href={project.documentation.wikiUrl} className="text-primary underline">View</Link> : 'N/A'} />
                    </CardContent>
                </Card>

                {/* Risks */}
                <Card>
                    <CardHeader>
                        <CardTitle>Risks & Dependencies</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {project.risks.map((risk, i) => (
                           <div key={i}>
                               <DetailItem label="Risk Description" value={risk.description} />
                               <DetailItem label="Mitigation Plan" value={risk.mitigation} />
                           </div>
                       ))}
                       {project.risks.length === 0 && <p className="text-sm text-muted-foreground">No risks documented.</p>}
                    </CardContent>
                </Card>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
                {/* Resources */}
                <Card>
                    <CardHeader>
                        <CardTitle>Resources</CardTitle>
                        <CardDescription>Team members assigned to this project.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {project.resources.teamMembers.map(member => (
                                <div key={member.userId} className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={`https://picsum.photos/seed/${member.userId}/40/40`} data-ai-hint="avatar" />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{member.name}</p>
                                        <p className="text-sm text-muted-foreground">{member.role} ({member.allocation}%)</p>
                                    </div>
                                </div>
                            ))}
                            {project.resources.teamMembers.length === 0 && <p className="text-sm text-muted-foreground">No team members assigned.</p>}
                        </div>
                    </CardContent>
                </Card>
                
                {/* Support */}
                <Card>
                    <CardHeader>
                        <CardTitle>Maintenance & Support</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailItem label="Bug Tracker" value={project.support.bugTrackerUrl ? <Link href={project.support.bugTrackerUrl} className="text-primary underline">Go to tracker</Link> : 'N/A'} />
                        <DetailItem label="Support SLA" value={project.support.sla} />
                        <DetailItem label="Escalation Contacts" value={project.support.escalationContacts.join(', ')} />
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </AppLayout>
  );
}
