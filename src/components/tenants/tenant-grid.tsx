import type { Tenant } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Globe, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import Link from 'next/link';

type TenantGridProps = {
  tenants: Tenant[];
};

export function TenantGrid({ tenants }: TenantGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tenants.map((tenant) => (
        <Card key={tenant.id}>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-4">
                <Image
                src={tenant.logo}
                alt={`${tenant.name} Logo`}
                width={48}
                height={48}
                className="rounded-lg border"
                data-ai-hint="logo"
                />
                <div>
                    <CardTitle className="text-xl font-headline">{tenant.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                        <Globe className="h-3 w-3" />
                        {tenant.domain}
                    </CardDescription>
                </div>
            </div>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href="#">Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 h-10 overflow-hidden">
                {tenant.description}
            </p>
            <Badge variant={tenant.status === 'Active' ? 'secondary' : 'outline'}>
              {tenant.status}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
