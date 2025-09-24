import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function TenantsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold font-headline">Tenant Management</h1>
                <p className="text-muted-foreground">
                    Create and manage tenants.
                </p>
            </div>
            <Button asChild>
                <Link href="/tenants/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Tenant
                </Link>
            </Button>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Tenants</CardTitle>
                <CardDescription>A list of all tenants in the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                    <p>No tenants found.</p>
                    <p className="text-sm">Get started by adding a new tenant.</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
