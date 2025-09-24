'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, UserCircle, Users, Building2, ClipboardList, Clock, TrendingUp, PieChart, Shield } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/tenants',
    icon: Building2,
    label: 'Tenants',
  },
  {
    href: '/staff',
    icon: Users,
    label: 'Staff',
  },
  {
    href: '/recruitment',
    icon: ClipboardList,
    label: 'Recruitment',
  },
  {
    href: '/time-leave',
    icon: Clock,
    label: 'Time & Leave',
  },
  {
    href: '/performance',
    icon: TrendingUp,
    label: 'Performance',
  },
  {
    href: '/capacity',
    icon: PieChart,
    label: 'Capacity',
  },
  {
    href: '/security',
    icon: Shield,
    label: 'Security',
  },
  {
    href: '/profile',
    icon: UserCircle,
    label: 'My Profile',
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            as={Link}
            href={item.href}
            isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
            tooltip={item.label}
          >
            <item.icon />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
