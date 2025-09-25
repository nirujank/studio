
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { StaffMember } from '@/lib/data';
import { Separator } from '../ui/separator';

type PersonalInfoTabProps = {
  user: StaffMember;
};

const InfoItem = ({ label, value }: { label: string, value: React.ReactNode}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="text-sm p-2 bg-muted rounded-md h-10 flex items-center text-muted-foreground">{value || 'N/A'}</div>
  </div>
);


export function PersonalInfoTab({ user }: PersonalInfoTabProps) {
  const { personal } = user.profile;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Personal Information</CardTitle>
        <CardDescription>
          Your personal details. Contact PCO to make changes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Contact Information</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <InfoItem label="Phone" value={personal.phone} />
            <InfoItem label="Date of Birth" value={personal.dob} />
            <div className="sm:col-span-2">
                <InfoItem label="Address" value={personal.address} />
            </div>
            <InfoItem label="Emergency Contact" value={personal.emergencyContact} />
            <InfoItem label="Contact Priority" value={personal.contactPriority} />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Employment Details</h3>
          <div className="grid gap-6 sm:grid-cols-3">
             <InfoItem label="Job Title" value={user.jobTitle} />
             <InfoItem label="Job Category" value={user.jobCategory} />
             <InfoItem label="Employment Type" value={user.employmentType} />
             <div className="sm:col-span-3">
                <InfoItem label="Special Need or Accessibility" value={personal.specialNeeds} />
             </div>
          </div>
        </div>
        
        <Separator />

        <div>
            <h3 className="text-lg font-medium mb-4">Location</h3>
            <div className="grid gap-6 sm:grid-cols-3">
                <InfoItem label="Country" value={user.country} />
                <InfoItem label="Region" value={user.region} />
                <InfoItem label="Home Office" value={user.homeOffice} />
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
