'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { AuditEntry } from '@/types';
import { ClipboardList, CheckCircle, XCircle } from 'lucide-react';

interface RecentActivityProps {
  activities: AuditEntry[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between rounded-lg border p-3"
            >
              <div className="flex items-start gap-3">
                {activity.result === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium">{activity.action.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-muted-foreground">{activity.agentName}</p>
                  <p className="text-xs text-muted-foreground">{activity.decision}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={activity.result === 'success' ? 'success' : 'destructive'}>
                  {activity.result}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
