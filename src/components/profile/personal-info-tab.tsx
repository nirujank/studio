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

type PersonalInfoTabProps = {
  personalInfo: StaffMember['profile']['personal'];
};

export function PersonalInfoTab({ personalInfo }: PersonalInfoTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Personal Information</CardTitle>
        <CardDescription>
          Your personal details. Contact PCO to make changes.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={personalInfo.phone} readOnly disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" value={personalInfo.dob} readOnly disabled />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" value={personalInfo.address} readOnly disabled />
        </div>
      </CardContent>
    </Card>
  );
}
