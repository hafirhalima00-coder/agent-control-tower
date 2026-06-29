'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';

interface SearchFilterProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  filters?: { label: string; value: string }[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export function SearchFilter({
  placeholder = 'Search...',
  onSearch,
  filters = [],
  activeFilter,
  onFilterChange,
}: SearchFilterProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          className="pl-9 pr-8"
          aria-label="Search"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
            onClick={() => {
              setQuery('');
              onSearch('');
            }}
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      {filters.length > 0 && (
        <div className="flex items-center gap-1">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant={activeFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange?.(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
