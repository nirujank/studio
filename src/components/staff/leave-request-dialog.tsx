'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { staffData } from '@/lib/data';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { assessLeaveRequestAction, type LeaveRequestState } from '@/app/actions';
import { Loader2, Sparkles, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type LeaveRequestDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const initialState: LeaveRequestState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Assess Request
    </Button>
  );
}

export function LeaveRequestDialog({ isOpen, onOpenChange }: LeaveRequestDialogProps) {
  const [state, formAction] = useActionState(assessLeaveRequestAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    // Reset form state when dialog is closed
    if(!isOpen) {
        (initialState as any).data = undefined;
        (initialState as any).error = undefined;
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Leave Request Assessment</DialogTitle>
          <DialogDescription>
            Select a staff member and leave details to get an AI-powered assessment.
          </DialogDescription>
        </DialogHeader>

        {state?.data ? (
          <div className="space-y-4 py-4">
            <h3 className="font-semibold text-lg">Assessment Complete</h3>
            <div>
              <Label>Eligibility</Label>
              <div className={`flex items-center gap-2 p-3 rounded-md ${state.data.isEligible ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                {state.data.isEligible ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                <p className="text-sm">{state.data.eligibilityReason}</p>
              </div>
            </div>
             <div>
              <Label>Project Impact Analysis</Label>
              <div className="p-3 rounded-md bg-secondary">
                <p className="text-sm text-secondary-foreground">{state.data.projectImpact}</p>
              </div>
            </div>
             <Button onClick={() => onOpenChange(false)} variant="outline">Close</Button>
          </div>
        ) : (
          <form ref={formRef} action={formAction} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="staffId">Staff Member</Label>
              <Select name="staffId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staffData.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select name="leaveType" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leaveDays">Number of Days</Label>
              <Input
                id="leaveDays"
                name="leaveDays"
                type="number"
                min="1"
                placeholder="e.g., 5"
                required
              />
            </div>
             {state?.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}
            <DialogFooter>
              <Button onClick={() => onOpenChange(false)} variant="ghost">Cancel</Button>
              <SubmitButton />
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
