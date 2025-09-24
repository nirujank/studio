'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResumeExtractor } from './resume-extractor';

type SkillsTabProps = {
  skills: string[];
};

export function SkillsTab({ skills: initialSkills }: SkillsTabProps) {
  const [skills, setSkills] = useState(initialSkills);

  const handleSkillsExtracted = (newSkills: string[]) => {
    // Avoid duplicates and merge
    const combinedSkills = [...new Set([...skills, ...newSkills])];
    setSkills(combinedSkills);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Your Skills</CardTitle>
          <CardDescription>
            A list of your professional skills. Use the tool to add more from your resume.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No skills listed. Upload your resume to get started.
            </p>
          )}
        </CardContent>
      </Card>
      <ResumeExtractor onSkillsExtracted={handleSkillsExtracted} />
    </div>
  );
}
