'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface BlockedDecision {
  id: string;
  agentName: string;
  action: string;
  reason: string;
  confidence: number;
  policy: string;
  recommendedAction: string;
  riskLevel: string;
  timestamp: string;
}

const mockDecisions: BlockedDecision[] = [
  {
    id: '1',
    agentName: 'Sales Agent',
    action: 'Process Refund $1,200',
    reason: 'Missing customer approval signature',
    confidence: 97,
    policy: 'FIN-004',
    recommendedAction: 'Escalate to manager',
    riskLevel: 'high',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    agentName: 'CRM Agent',
    action: 'Bulk Delete 150 Records',
    reason: 'No backup snapshot verified',
    confidence: 89,
    policy: 'DATA-007',
    recommendedAction: 'Create backup and retry',
    riskLevel: 'critical',
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: '3',
    agentName: 'Email Agent',
    action: 'Send Mass Campaign',
    reason: 'Recipient list exceeds daily limit',
    confidence: 94,
    policy: 'COM-012',
    recommendedAction: 'Schedule delivery over 2 days',
    riskLevel: 'medium',
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
];

export function AIExplanation() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Shield className="h-4 w-4 text-amber-500" />
          AI Decision Log
          <Badge variant="secondary" className="ml-auto text-xs">
            {mockDecisions.length} blocked
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockDecisions.map((decision) => (
          <div key={decision.id} className="rounded-lg border p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{decision.action}</div>
                  <div className="text-xs text-muted-foreground">{decision.agentName}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 shrink-0"
                onClick={() => setExpandedId(expandedId === decision.id ? null : decision.id)}
              >
                {expandedId === decision.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">BLOCKED</Badge>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">{decision.policy}</Badge>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{decision.riskLevel}</Badge>
            </div>

            {expandedId === decision.id && (
              <div className="space-y-2 pt-1 border-t text-xs">
                <div>
                  <span className="text-muted-foreground">Confidence: </span>
                  <span className="font-medium">{decision.confidence}%</span>
                  <div className="mt-1">
                    <Progress value={decision.confidence} className="h-1.5" />
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Reason: </span>
                  <span className="font-medium">{decision.reason}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Policy: </span>
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">{decision.policy}</code>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span className="text-muted-foreground">Recommended: </span>
                  <span className="font-medium">{decision.recommendedAction}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
