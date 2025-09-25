
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, UserPlus, Search, UserX, UserCheck } from 'lucide-react';
import type { StaffMember } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/hooks/use-notifications';

type StaffTableProps = {
  staffData: StaffMember[];
};

export function StaffTable({ staffData: initialStaffData }: StaffTableProps) {
  const [staff, setStaff] = useState(initialStaffData);
  const [search, setSearch] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StaffMember | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { addNotification } = useNotifications();

  const filteredData = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()) ||
      member.tenantName.toLowerCase().includes(search.toLowerCase()) ||
      member.id.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleResetPassword = (user: StaffMember) => {
    setSelectedUser(user);
    setResetDialogOpen(true);
  };
  
  const confirmResetPassword = () => {
    if (selectedUser) {
      toast({
        title: "Password Reset Triggered",
        description: `A password reset link has been sent to ${selectedUser.name}.`,
      });
      addNotification({
        title: 'Admin Password Reset',
        description: `Password reset initiated for ${selectedUser.name}.`,
        href: `/staff/${selectedUser.id}/edit`,
      });
    }
    setResetDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeactivate = (user: StaffMember) => {
    setSelectedUser(user);
    setDeactivateDialogOpen(true);
  };

  const confirmDeactivate = () => {
    if (selectedUser) {
      const isDeactivating = selectedUser.status === 'Active';
      setStaff(staff.map(member => 
        member.id === selectedUser.id 
          ? { ...member, status: isDeactivating ? 'Deactivated' : 'Active' } 
          : member
      ));
      toast({
        title: `User ${isDeactivating ? 'Deactivated' : 'Reactivated'}`,
        description: `${selectedUser.name}'s account has been ${isDeactivating ? 'deactivated' : 'reactivated'}.`,
      });
    }
    setDeactivateDialogOpen(false);
    setSelectedUser(null);
  }

  const handleEdit = (member: StaffMember) => {
    router.push(`/staff/${member.id}/edit`);
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">
              Staff Management
            </CardTitle>
            <CardDescription>
              Search, view, and manage staff profiles.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search staff..."
                className="w-full pl-8 sm:w-[200px] lg:w-[300px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button asChild>
              <Link href="/staff/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Home Office</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((member) => (
              <TableRow key={member.id} className={member.status === 'Deactivated' ? 'opacity-50' : ''}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={member.avatar} alt={member.name} data-ai-hint="avatar" />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">
                      {member.name}
                      {member.status === 'Deactivated' && <Badge variant="destructive" className="ml-2">Deactivated</Badge>}
                      <div className="text-sm text-muted-foreground">
                        {member.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{member.tenantName}</div>
                </TableCell>
                <TableCell>
                  {member.jobTitle}
                </TableCell>
                <TableCell>
                  {member.homeOffice}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/staff/${member.id}`}>View Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleEdit(member)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleResetPassword(member)}>
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onSelect={() => handleDeactivate(member)}
                        className={member.status === 'Active' ? 'text-destructive focus:bg-destructive/10 focus:text-destructive' : 'text-green-600 focus:bg-green-600/10 focus:text-green-700'}
                      >
                         {member.status === 'Active' ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Deactivate User
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Reactivate User
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         {filteredData.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No staff members found.
          </div>
        )}
      </CardContent>
    </Card>

    <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will trigger a password reset email to be sent to {selectedUser?.name}. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetPassword}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will {selectedUser?.status === 'Active' ? 'deactivate' : 'reactivate'} the account for {selectedUser?.name}. 
              They {selectedUser?.status === 'Active' ? 'will lose access' : 'will regain access'} to the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
                onClick={confirmDeactivate}
                className={selectedUser?.status === 'Active' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {selectedUser?.status === 'Active' ? 'Deactivate' : 'Reactivate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
