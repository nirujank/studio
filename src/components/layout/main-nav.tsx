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
    label: 'Staff',
    icon: Users,
    href: '/staff',
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
    ],
  },
  {
    href: '/projects',
    icon: FolderKanban,
    label: 'Projects',
  },
  {
    label: 'Recruitment',
    icon: ClipboardList,
    href: '/recruitment',
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
  const { state } = useSidebar();

  const isLinkActive = (href: string, isParent = false) => {
    if (isParent) {
      return pathname.startsWith(href);
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
              href={item.href!}
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
