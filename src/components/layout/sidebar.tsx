'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Bot,
  CheckSquare,
  AlertTriangle,
  ClipboardList,
  Clock,
  Settings,
  HelpCircle,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Agents', href: '/agents', icon: Bot },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'Audit Log', href: '/audit', icon: ClipboardList },
  { name: 'Approvals', href: '/approvals', icon: Clock },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-semibold">AgentOps</span>
            <span className="block text-[10px] text-muted-foreground -mt-1">Control Tower</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-2" role="navigation" aria-label="Main navigation">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="mr-3 h-4 w-4" aria-hidden="true" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-2">
        <Link
          href="#"
          className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <HelpCircle className="mr-3 h-4 w-4" />
          Help & Support
        </Link>
        <Link
          href="#"
          className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Settings className="mr-3 h-4 w-4" />
          Settings
        </Link>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">admin@company.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
