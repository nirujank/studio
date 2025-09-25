'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { ProjectForm } from '@/components/projects/project-form';
import { BrdUploader } from '@/components/projects/brd-uploader';
import { useState, useCallback } from 'react';
import type { ExtractProjectInfoFromBrdOutput } from '@/ai/flows/extract-project-info-from-brd';

export default function NewProjectPage() {
  const [extractedData, setExtractedData] = useState<ExtractProjectInfoFromBrdOutput | null>(null);

  const handleInfoExtracted = useCallback((info: ExtractProjectInfoFromBrdOutput) => {
    setExtractedData(info);
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/projects">
              <ChevronLeft />
              <span className="sr-only">Back to projects</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-headline">Add New Project</h1>
            <p className="text-muted-foreground">Upload a BRD to auto-fill or manually enter the details.</p>
          </div>
        </div>
        <BrdUploader onInfoExtracted={handleInfoExtracted} />
        <ProjectForm project={extractedData} />
      </div>
    </AppLayout>
  );
}
