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
import { Label } from '@/components/ui/label';
import { staffData } from '@/lib/data';
import { useActionState, useEffect, useRef, useTransition, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { assessLeaveRequestAction, type LeaveRequestState } from '@/app/actions';
import { Loader2, Sparkles, AlertCircle, CheckCircle, XCircle, RotateCcw, Send } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { DatePicker } from '../ui/date-picker';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/use-notifications';
import { Combobox } from '../ui/combobox';

type LeaveRequestDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  staffId?: string;
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

const leaveTypes = [
  { value: 'sick', label: 'Sick Leave' },
  { value: 'vacation', label: 'Vacation' },
  { value: 'personal', label: 'Personal' },
];

export function LeaveRequestDialog({ isOpen, onOpenChange, staffId: initialStaffId }: LeaveRequestDialogProps) {
  const [state, formAction, isPending] = useActionState(assessLeaveRequestAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [isResetting, startResetTransition] = useTransition();
  const { addNotification } = useNotifications();
  const { toast } = useToast();

  const [staffId, setStaffId] = useState(initialStaffId || '');
  const [leaveType, setLeaveType] = useState('');

  const staffOptions = staffData.map(staff => ({
    value: staff.id,
    label: staff.name,
  }));

  const handleNewRequest = () => {
    startResetTransition(() => {
      const formData = new FormData();
      formData.append('reset', 'true');
      formAction(formData);
    });
    setStaffId(initialStaffId || '');
    setLeaveType('');
    formRef.current?.reset();
  };
  
  useEffect(() => {
    if (!isOpen && (state?.data || state?.error)) {
        setTimeout(handleNewRequest, 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSendToPCO = () => {
    const user = staffData.find(s => s.id === staffId);
    if (!user) return;
    
    addNotification({
      title: "New Leave Request",
      description: `${user.name} has submitted a leave request for review.`,
      href: `/staff/${user.id}`,
    });

    toast({
      title: "Request Sent",
      description: "Your leave request has been sent to the PCO admin for approval.",
    });

    onOpenChange(false);
  }
  
  const handleSubmit = (formData: FormData) => {
    formData.set('staffId', staffId);
    formData.set('leaveType', leaveType);
    formAction(formData);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Leave Request Assessment</DialogTitle>
          <DialogDescription>
            Select a staff member and leave details to get an AI-powered assessment.
          </DialogDescription>
        </DialogHeader>

        {state?.data && !isPending ? (
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
            <DialogFooter>
              <Button onClick={handleNewRequest} disabled={isResetting} variant="outline">
                {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />}
                New Request
              </Button>
               {state.data.isEligible && (
                <Button onClick={handleSendToPCO}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Request to PCO
                </Button>
              )}
            </DialogFooter>
          </div>
        ) : (
          <form ref={formRef} action={handleSubmit} className="space-y-4 py-4">
            {initialStaffId ? (
                <input type="hidden" name="staffId" value={initialStaffId} />
            ) : (
                <div className="space-y-2">
                  <Label>Staff Member</Label>
                  <Combobox
                    options={staffOptions}
                    selectedValue={staffId}
                    onSelect={setStaffId}
                    placeholder="Select a staff member"
                    searchPlaceholder="Search staff..."
                    notFoundText="No staff found."
                  />
                </div>
            )}
            
            <div className="space-y-2">
              <Label>Leave Type</Label>
              <Combobox
                options={leaveTypes}
                selectedValue={leaveType}
                onSelect={setLeaveType}
                placeholder="Select leave type"
                searchPlaceholder="Search types..."
                notFoundText="No type found."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <DatePicker name="startDate" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <DatePicker name="endDate" />
                </div>
            </div>

             {state?.error && !isPending && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}
            <DialogFooter>
              <Button onClick={() => onOpenChange(false)} variant="ghost" type="button">Cancel</Button>
              <SubmitButton />
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

    