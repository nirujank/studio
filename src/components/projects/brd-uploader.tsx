'use client';

import { useActionState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileUp, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { extractProjectInfoAction, type ProjectInfoState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const initialState: ProjectInfoState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Extract from BRD
    </Button>
  );
}

type BrdUploaderProps = {
  onInfoExtracted: (info: any) => void;
};

export function BrdUploader({ onInfoExtracted }: BrdUploaderProps) {
  const [state, formAction] = useActionState(extractProjectInfoAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.data) {
      onInfoExtracted(state.data);
      formRef.current?.reset();
       toast({
        title: 'Information Extracted',
        description: 'The project form has been populated with data from the BRD.',
      });
    }
  }, [state, onInfoExtracted, toast]);

  return (
    <Card>
      <form ref={formRef} action={formAction}>
        <CardHeader>
          <CardTitle className="font-headline">AI Project Parser</CardTitle>
          <CardDescription>
            Upload a Business Requirements Document (BRD) to automatically fill out the project form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="brd-file">Upload BRD</Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
               <Input id="brd-file" name="brd" type="file" accept=".pdf,.doc,.docx,.txt" required className="text-xs flex-grow" />
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
