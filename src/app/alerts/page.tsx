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
import { Alert } from '@/types';
import { AlertTriangle, CheckCircle, RefreshCw, Bell, BellOff } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchAlerts = useCallback(async () => {
    try {
      let url = '/api/alerts?limit=50';
      if (severityFilter !== 'all') {
        url += `&severity=${severityFilter}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setAlerts(data.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  }, [severityFilter]);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 8000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  async function acknowledgeAlert(alertId: string) {
    try {
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: alertId, 
          acknowledged: true, 
          acknowledgedBy: 'admin@company.com' 
        }),
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  }

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Critical', value: 'critical' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  const filteredAlerts = alerts.filter((alert) =>
    alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeAlerts = alerts.filter(a => !a.acknowledged);

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header title="Alerts" />
          <main className="flex-1 p-6">
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
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
        <Header title="Alert Management" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Alerts</h2>
                <p className="text-muted-foreground">
                  Monitor system alerts and issues
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="gap-1">
                  <Bell className="h-3 w-3" />
                  {activeAlerts.length} active
                </Badge>
                <Button onClick={fetchAlerts} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <SearchFilter
              placeholder="Search alerts..."
              onSearch={setSearchQuery}
              filters={filters}
              activeFilter={severityFilter}
              onFilterChange={setSeverityFilter}
            />

            {/* Alerts List */}
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <ErrorBoundary key={alert.id}>
                  <Card className={`transition-all hover:shadow-md ${alert.acknowledged ? 'opacity-60' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
                            <h3 className="font-medium">{alert.title}</h3>
                            <Badge variant={getSeverityVariant(alert.severity) as 'destructive' | 'warning' | 'info' | 'secondary'}>
                              {alert.severity}
                            </Badge>
                            <Badge variant={alert.acknowledged ? 'secondary' : 'destructive'}>
                              {alert.acknowledged ? 'Acknowledged' : 'Active'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Type: {alert.type.replace(/-/g, ' ')}</span>
                            {alert.agentName && <span>Agent: {alert.agentName}</span>}
                            <span>{formatDate(alert.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!alert.acknowledged && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => acknowledgeAlert(alert.id)}
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Acknowledge
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ErrorBoundary>
              ))}
            </div>

            {filteredAlerts.length === 0 && (
              <div className="text-center py-12">
                <BellOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No alerts found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search criteria' : 'All clear! No alerts to display'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
