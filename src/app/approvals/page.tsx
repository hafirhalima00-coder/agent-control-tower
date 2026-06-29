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
import { formatDate, getRiskColor } from '@/lib/utils';
import { ApprovalRequest } from '@/types';
import { Clock, CheckCircle, XCircle, RefreshCw, Shield, AlertTriangle } from 'lucide-react';

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchRequests = useCallback(async () => {
    try {
      let url = '/api/approvals?limit=50';
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching approval requests:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 12000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  async function reviewRequest(id: string, status: 'approved' | 'rejected') {
    try {
      await fetch('/api/approvals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id, 
          status, 
          reviewedBy: 'admin@company.com' 
        }),
      });
      fetchRequests();
    } catch (error) {
      console.error('Error reviewing request:', error);
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];

  const filteredRequests = requests.filter((request) =>
    request.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.agentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header title="Approvals" />
          <main className="flex-1 p-6">
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
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
        <Header title="Approval Queue" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Approval Queue</h2>
                <p className="text-muted-foreground">
                  Review and approve high-risk agent actions
                </p>
              </div>
              <div className="flex items-center gap-2">
                {pendingCount > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {pendingCount} pending
                  </Badge>
                )}
                <Button onClick={fetchRequests} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <SearchFilter
              placeholder="Search approvals..."
              onSearch={setSearchQuery}
              filters={filters}
              activeFilter={statusFilter}
              onFilterChange={setStatusFilter}
            />

            {/* Approval Requests */}
            <div className="space-y-3">
              {filteredRequests.map((request) => (
                <ErrorBoundary key={request.id}>
                  <Card className={`transition-all hover:shadow-md ${request.status !== 'pending' ? 'opacity-60' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Shield className="h-4 w-4 text-blue-500 shrink-0" />
                            <h3 className="font-medium">{request.action}</h3>
                            <Badge variant={getStatusVariant(request.status) as 'success' | 'destructive' | 'warning' | 'secondary'}>
                              {request.status}
                            </Badge>
                            <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(request.riskLevel)}`}>
                              {request.riskLevel} risk
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{request.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Agent: {request.agentName}</span>
                            {request.amount && <span>Amount: ${request.amount.toLocaleString()}</span>}
                            <span>Requested by: {request.requestedBy}</span>
                            <span>{formatDate(request.createdAt)}</span>
                          </div>
                          {request.reviewedBy && (
                            <div className="text-xs text-muted-foreground">
                              Reviewed by {request.reviewedBy} on {formatDate(request.reviewedAt!)}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {request.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => reviewRequest(request.id, 'approved')}
                              >
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => reviewRequest(request.id, 'rejected')}
                              >
                                <XCircle className="mr-1 h-3 w-3" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ErrorBoundary>
              ))}
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No approval requests</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search criteria' : 'All caught up! No pending approvals'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
