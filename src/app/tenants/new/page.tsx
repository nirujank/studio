import { AppLayout } from '@/components/layout/app-layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function NewTenantPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
         <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/tenants">
              <ChevronLeft />
              <span className="sr-only">Back to tenants</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-headline">Add New Tenant</h1>
            <p className="text-muted-foreground">Fill out the form to add a new tenant.</p>
          </div>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Tenant Information</CardTitle>
                <CardDescription>Enter the details for the new tenant.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Tenant form will go here */}
                <p className="text-muted-foreground text-sm">Tenant form under construction.</p>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
