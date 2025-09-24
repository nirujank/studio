'use client';

import { useFormState, useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileUp, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { extractSkillsAction } from '@/app/actions';
import { useEffect, useRef } from 'react';
import { Badge } from '../ui/badge';

const initialState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Extract Skills
    </Button>
  );
}

type ResumeExtractorProps = {
  onSkillsExtracted: (skills: string[]) => void;
};

export function ResumeExtractor({ onSkillsExtracted }: ResumeExtractorProps) {
  const [state, formAction] = useFormState(extractSkillsAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.skills) {
      onSkillsExtracted(state.skills);
      formRef.current?.reset();
    }
  }, [state, onSkillsExtracted]);

  return (
    <Card>
      <form ref={formRef} action={formAction}>
        <CardHeader>
          <CardTitle className="font-headline">Resume Skill Extractor</CardTitle>
          <CardDescription>
            Let AI automatically populate your skills from your resume.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="resume-file">Upload Resume</Label>
            <div className="flex items-center gap-2">
               <FileUp className="h-5 w-5 text-muted-foreground" />
               <Input id="resume-file" name="resume" type="file" accept=".pdf,.doc,.docx,.txt" required className="text-xs" />
            </div>
          </div>

          {state?.error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {state?.skills && (
             <div className="mt-4">
              <p className="text-sm font-medium mb-2">Successfully extracted skills:</p>
              <div className="flex flex-wrap gap-2">
                {state.skills.map(skill => <Badge key={skill}>{skill}</Badge>)}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
