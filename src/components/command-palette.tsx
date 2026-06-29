'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Command } from 'cmdk';
import {
  LayoutDashboard,
  Bot,
  CheckSquare,
  AlertTriangle,
  ClipboardList,
  Clock,
  Search,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Agents', href: '/agents', icon: Bot },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'Audit Log', href: '/audit', icon: ClipboardList },
  { name: 'Approvals', href: '/approvals', icon: Clock },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const runCommand = useCallback((href: string) => {
    router.push(href);
    onOpenChange(false);
    setSearch('');
  }, [router, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-lg">
        <Command shouldFilter={true}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder="Type a command or search..."
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={search}
              onValueChange={setSearch}
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>
            <Command.Group heading="Navigation">
              {navigation.map((item) => (
                <Command.Item
                  key={item.href}
                  value={item.name}
                  onSelect={() => runCommand(item.href)}
                  className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Separator className="my-1 h-px bg-border" />
            <Command.Group heading="Actions">
              <Command.Item
                value="toggle-theme"
                onSelect={() => {
                  document.documentElement.classList.toggle('dark');
                  onOpenChange(false);
                }}
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <Moon className="h-4 w-4" />
                Toggle Dark Mode
              </Command.Item>
              <Command.Item
                value="refresh"
                onSelect={() => {
                  window.location.reload();
                  onOpenChange(false);
                }}
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <Settings className="h-4 w-4" />
                Refresh Data
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
