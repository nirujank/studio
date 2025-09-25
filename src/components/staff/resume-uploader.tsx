'use client';

import { useActionState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileUp, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { extractInfoAction, type InfoState } from '@/app/actions';

const initialState: InfoState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Extract Information
    </Button>
  );
}

type ResumeUploaderProps = {
  onInfoExtracted: (info: any) => void;
};

export function ResumeUploader({ onInfoExtracted }: ResumeUploaderProps) {
  const [state, formAction] = useActionState(extractInfoAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.data) {
      onInfoExtracted(state.data);
      formRef.current?.reset();
    }
  }, [state, onInfoExtracted]);

  return (
    <Card>
      <form ref={formRef} action={formAction}>
        <CardHeader>
          <CardTitle className="font-headline">AI Resume Parser</CardTitle>
          <CardDescription>
            Upload a resume to automatically fill out the form fields below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="resume-file">Upload Resume</Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
               <Input id="resume-file" name="resume" type="file" accept=".pdf,.doc,.docx,.txt" required className="text-xs flex-grow" />
            </div>
          </div>

          {state?.error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
            <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
