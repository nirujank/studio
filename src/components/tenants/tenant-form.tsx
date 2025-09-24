'use client';

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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { Tenant } from '@/lib/data';
import { Save } from 'lucide-react';

type TenantFormProps = {
  tenant?: Tenant;
};

export function TenantForm({ tenant }: TenantFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditMode = !!tenant;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;

    toast({
      title: isEditMode ? 'Tenant Updated' : 'Tenant Added',
      description: `Tenant "${name}" has been successfully ${
        isEditMode ? 'updated' : 'created'
      }.`,
    });

    router.push('/tenants');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Tenant Information</CardTitle>
          <CardDescription>
            Enter the details for the new tenant.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Tenant Name</Label>
            <Input id="name" name="name" defaultValue={tenant?.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domain">Domain Name</Label>
            <Input
              id="domain"
              name="domain"
              type="text"
              defaultValue={tenant?.domain}
              placeholder="example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Tenant Logo</Label>
            <Input id="logo" name="logo" type="file" accept="image/*" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={tenant?.status || 'Active'}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={tenant?.description}
              placeholder="A brief description of the tenant."
            />
          </div>
        </CardContent>
        <CardFooter>
            <Button type="submit" className="w-full sm:w-auto">
                <Save className="mr-2" />
                {isEditMode ? 'Save Changes' : 'Add Tenant'}
            </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
