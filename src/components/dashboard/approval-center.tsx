'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ApprovalRequest } from '@/types';
import { formatDate, getRiskColor } from '@/lib/utils';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Shield, ArrowUpRight } from 'lucide-react';

export function ApprovalCenter() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch('/api/approvals?status=pending&limit=10');
      const data = await res.json();
      if (data.success) setRequests(data.data);
    } catch (error) {
      console.error('Error fetching approvals:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 8000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  async function reviewRequest(id: string, status: 'approved' | 'rejected') {
    setActionLoading(id);
    try {
      await fetch('/api/approvals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, reviewedBy: 'admin@company.com' }),
      });
      setRequests(prev => prev.filter(r => r.id !== id));
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error reviewing request:', error);
    } finally {
      setActionLoading(null);
    }
  }

  const topRequests = requests.slice(0, 3);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Shield className="h-4 w-4 text-orange-500" />
          Approval Center
          <Badge variant="destructive" className="ml-auto text-xs">
            {requests.length} pending
          </Badge>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={fetchRequests}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : topRequests.length === 0 ? (
          <div className="text-center py-4">
            <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <p className="text-xs text-muted-foreground">All approvals processed</p>
          </div>
        ) : (
          topRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-lg border p-3 space-y-2 hover:border-orange-200 transition-colors cursor-pointer"
              onClick={() => setSelectedRequest(selectedRequest?.id === request.id ? null : request)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                    <span className="text-sm font-medium truncate">{request.action}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{request.description}</p>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${getRiskColor(request.riskLevel)}`}>
                  {request.riskLevel}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{request.agentName}</span>
                <span>·</span>
                <span>{request.requestedBy}</span>
                {request.amount && (
                  <>
                    <span>·</span>
                    <span className="font-medium">${request.amount.toLocaleString()}</span>
                  </>
                )}
              </div>

              {selectedRequest?.id === request.id && (
                <div className="space-y-2 pt-2 border-t text-xs">
                  <div>
                    <span className="text-muted-foreground">Context: </span>
                    <span>{request.decisionContext}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Impact: </span>
                    <span>{request.impactAssessment}</span>
                  </div>
                  {request.alternativeOptions.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Alternatives: </span>
                      <span>{request.alternativeOptions.join(', ')}</span>
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-green-600 hover:text-green-700 hover:bg-green-50 text-xs"
                      onClick={(e) => { e.stopPropagation(); reviewRequest(request.id, 'approved'); }}
                      disabled={actionLoading === request.id}
                    >
                      {actionLoading === request.id ? (
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      )}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                      onClick={(e) => { e.stopPropagation(); reviewRequest(request.id, 'rejected'); }}
                      disabled={actionLoading === request.id}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  Expires {formatDate(request.expiresAt)}
                </span>
              </div>
            </div>
          ))
        )}

        {requests.length > 3 && (
          <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
            <a href="/approvals">View all {requests.length} pending →</a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
