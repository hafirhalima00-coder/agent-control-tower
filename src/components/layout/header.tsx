'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NotificationCenter } from '@/components/notification-center';
import { CommandPalette } from '@/components/command-palette';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { Search, Keyboard } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b bg-card px-4 md:px-6">
        <div className="flex items-center gap-2">
          <MobileMenu />
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-2 text-muted-foreground"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="text-xs">Search...</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">Ctrl</span>
              <span className="text-xs">K</span>
            </kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setCommandOpen(true)}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
          <NotificationCenter />
        </div>
      </header>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
