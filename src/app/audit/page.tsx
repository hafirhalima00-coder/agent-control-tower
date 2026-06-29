'use client';

import { useEffect, useState, useCallback } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchFilter } from '@/components/ui/search-filter';
import { TableRowSkeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { formatDate } from '@/lib/utils';
import { AuditEntry } from '@/types';
import { ClipboardList, CheckCircle, XCircle, RefreshCw, Download, Filter } from 'lucide-react';

export default function AuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchEntries = useCallback(async () => {
    try {
      let url = '/api/audit?limit=100';
      if (resultFilter !== 'all') {
        url += `&result=${resultFilter}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setEntries(data.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching audit entries:', error);
    } finally {
      setLoading(false);
    }
  }, [resultFilter]);

  useEffect(() => {
    fetchEntries();
    const interval = setInterval(fetchEntries, 15000);
    return () => clearInterval(interval);
  }, [fetchEntries]);

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Success', value: 'success' },
    { label: 'Failure', value: 'failure' },
    { label: 'Pending', value: 'pending' },
  ];

  const filteredEntries = entries.filter((entry) =>
    entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.decision.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header title="Audit Log" />
          <main className="flex-1 p-6">
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Audit Log" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Audit Log</h2>
                <p className="text-muted-foreground">
                  Complete history of all agent actions and decisions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <ClipboardList className="h-3 w-3" />
                  {entries.length} entries
                </Badge>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button onClick={fetchEntries} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <SearchFilter
              placeholder="Search audit log..."
              onSearch={setSearchQuery}
              filters={filters}
              activeFilter={resultFilter}
              onFilterChange={setResultFilter}
            />

            {/* Audit Entries */}
            <div className="space-y-3">
              {filteredEntries.map((entry) => (
                <ErrorBoundary key={entry.id}>
                  <Card className="transition-all hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {entry.result === 'success' ? (
                              <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                            ) : entry.result === 'failure' ? (
                              <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                            ) : (
                              <ClipboardList className="h-4 w-4 text-yellow-500 shrink-0" />
                            )}
                            <h3 className="font-medium capitalize">
                              {entry.action.replace(/_/g, ' ')}
                            </h3>
                            <Badge variant={entry.result === 'success' ? 'success' : entry.result === 'failure' ? 'destructive' : 'warning'}>
                              {entry.result}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{entry.decision}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Agent: {entry.agentName}</span>
                            <span>User: {entry.user}</span>
                            <span>Confidence: {Math.round(entry.confidence * 100)}%</span>
                            <span>{formatDate(entry.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ErrorBoundary>
              ))}
            </div>

            {filteredEntries.length === 0 && (
              <div className="text-center py-12">
                <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No audit entries found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
