'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  Clock,
  TrendingUp,
  PieChart,
  Shield,
  UserCircle,
  FileText,
  UserCheck,
  CalendarCheck,
  FolderKanban,
  Sparkles,
  Briefcase,
  CalendarClock,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useSidebar } from '../ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { useEffect, useState } from 'react';

const allNavItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    role: 'admin',
  },
  {
    href: '/tenants',
    icon: Building2,
    label: 'Tenants',
    role: 'admin',
  },
  {
    label: 'Staff',
    icon: Users,
    href: '/staff',
    role: 'admin',
    subItems: [
      {
        href: '/staff',
        icon: Users,
        label: 'All Staff',
      },
      {
        href: '/staff/skills',
        icon: Sparkles,
        label: 'Skills & Training',
      },
      {
        href: '/staff/history',
        icon: Briefcase,
        label: 'Job History',
      },
      {
        href: '/staff/leave',
        icon: CalendarClock,
        label: 'Leave Entitlements',
      },
       {
        href: '/staff/timesheets',
        icon: Clock,
        label: 'E6 Timesheets',
      },
    ],
  },
  {
    href: '/projects',
    icon: FolderKanban,
    label: 'Projects',
    role: 'admin',
  },
  {
    label: 'Recruitment',
    icon: ClipboardList,
    href: '/recruitment',
    role: 'admin',
    subItems: [
      {
        href: '/recruitment/requisitions',
        icon: FileText,
        label: 'Requisitions',
      },
      {
        href: '/recruitment/candidates',
        icon: UserCheck,
        label: 'Candidates',
      },
      {
        href: '/recruitment/interviews',
        icon: CalendarCheck,
        label: 'Interviews',
      },
    ],
  },
  {
    href: '/profile',
    icon: UserCircle,
    label: 'My Profile',
    role: 'staff',
  },
  {
    href: '/staff/my-projects',
    icon: FolderKanban,
    label: 'My Projects',
    role: 'staff',
  },
  {
    href: '/staff/my-leave',
    icon: CalendarClock,
    label: 'My Leave',
    role: 'staff',
  },
  {
    href: '/staff/e6',
    icon: Clock,
    label: 'E6',
    role: 'staff',
  },
];

export function MainNav() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = sessionStorage.getItem('userRole');
      setUserRole(role);
    }
  }, []);

  const getProfileLink = () => {
    if (typeof window !== 'undefined') {
      const userId = sessionStorage.getItem('userId');
      if (userId) {
        return `/staff/${userId}`;
      }
    }
    return '/profile'; // Fallback
  }

  const navItems = allNavItems.filter(item => {
    if (!userRole) { // Default to admin view if no role set (e.g., on server)
      return item.role === 'admin';
    }
    return item.role === userRole;
  });


  const isLinkActive = (href: string, isParent = false) => {
    if (isParent) {
      return pathname.startsWith(href);
    }
    if (href === '/profile') {
        // Special handling for dynamic profile routes
        const userId = typeof window !== 'undefined' ? sessionStorage.getItem('userId') : '';
        return pathname === `/staff/${userId}`;
    }
    return pathname === href;
  };

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href || item.label}>
          {item.subItems ? (
            <Collapsible>
              <CollapsibleTrigger asChild>
                 <SidebarMenuButton
                  isActive={isLinkActive(item.href!, true)}
                  tooltip={item.label}
                  className="justify-between"
                  as="div"
                >
                  <div className="flex items-center gap-2">
                    <item.icon />
                    <span>{item.label}</span>
                  </div>
                </SidebarMenuButton>
              </CollapsibleTrigger>

              {state === 'expanded' && (
                <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.href}>
                          <SidebarMenuSubButton
                            as={Link}
                            href={subItem.href}
                            isActive={isLinkActive(subItem.href)}
                          >
                            <subItem.icon />
                            <span>{subItem.label}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
              )}

            </Collapsible>
          ) : (
            <SidebarMenuButton
              as={Link}
              href={item.label === 'My Profile' ? getProfileLink() : item.href!}
              isActive={isLinkActive(item.href!)}
              tooltip={item.label}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
