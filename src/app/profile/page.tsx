import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/data';

// This page now just redirects to the dynamic user profile page.
export default function ProfilePage() {
  redirect(`/staff/${currentUser.id}`);
}
