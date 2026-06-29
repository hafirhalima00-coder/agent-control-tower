'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate } from '@/lib/utils';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  ArrowRight,
  Bot,
  User,
  Zap,
} from 'lucide-react';

interface ActivityEvent {
  id: string;
  type: 'action' | 'decision' | 'escalation' | 'intervention' | 'system';
  agentName: string;
  agentType: string;
  action: string;
  detail: string;
  result: 'success' | 'failure' | 'pending' | 'blocked';
  systemsAffected: string[];
  confidence: number;
  riskLevel: string;
  timestamp: string;
  humanInvolved: boolean;
}

const MOCK_ACTIVITIES: ActivityEvent[] = [
  {
    id: '1',
    type: 'action',
    agentName: 'Customer Support Agent',
    agentType: 'customer-support',
    action: 'Resolved support ticket',
    detail: 'Customer inquiry #4521 resolved automatically. Sent satisfaction survey.',
    result: 'success',
    systemsAffected: ['Salesforce CRM', 'Gmail'],
    confidence: 0.94,
    riskLevel: 'low',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    humanInvolved: false,
  },
  {
    id: '2',
    type: 'decision',
    agentName: 'Sales Agent',
    agentType: 'sales',
    action: 'Qualified lead',
    detail: 'Lead from Acme Corp scored 87/100. Assigned to senior sales rep.',
    result: 'success',
    systemsAffected: ['Salesforce CRM'],
    confidence: 0.89,
    riskLevel: 'medium',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    humanInvolved: false,
  },
  {
    id: '3',
    type: 'escalation',
    agentName: 'Customer Support Agent',
    agentType: 'customer-support',
    action: 'Escalated to human',
    detail: 'Customer expressing legal concerns about billing. Requires human review.',
    result: 'pending',
    systemsAffected: ['Salesforce CRM'],
    confidence: 0.72,
    riskLevel: 'high',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    humanInvolved: true,
  },
  {
    id: '4',
    type: 'intervention',
    agentName: 'CRM Agent',
    agentType: 'crm',
    action: 'Blocked by policy',
    detail: 'Attempted to delete 150 records. Blocked: requires human approval.',
    result: 'blocked',
    systemsAffected: ['Salesforce CRM', 'PostgreSQL'],
    confidence: 0.85,
    riskLevel: 'critical',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    humanInvolved: true,
  },
  {
    id: '5',
    type: 'action',
    agentName: 'Email Agent',
    agentType: 'email',
    action: 'Processed email',
    detail: 'Classified incoming email as high priority. Auto-reply sent.',
    result: 'success',
    systemsAffected: ['Gmail'],
    confidence: 0.91,
    riskLevel: 'low',
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    humanInvolved: false,
  },
  {
    id: '6',
    type: 'system',
    agentName: 'WhatsApp Agent',
    agentType: 'whatsapp',
    action: 'Rate limit warning',
    detail: 'Approaching WhatsApp Business API rate limit. Throttling requests.',
    result: 'success',
    systemsAffected: ['WhatsApp Business'],
    confidence: 1.0,
    riskLevel: 'low',
    timestamp: new Date(Date.now() - 1500000).toISOString(),
    humanInvolved: false,
  },
  {
    id: '7',
    type: 'decision',
    agentName: 'Scheduling Agent',
    agentType: 'scheduling',
    action: 'Scheduled meeting',
    detail: 'Coordinated meeting across 3 time zones. All attendees confirmed.',
    result: 'success',
    systemsAffected: ['Google Calendar'],
    confidence: 0.96,
    riskLevel: 'low',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    humanInvolved: false,
  },
  {
    id: '8',
    type: 'action',
    agentName: 'Sales Agent',
    agentType: 'sales',
    action: 'Generated proposal',
    detail: 'Created customized proposal for Enterprise plan. Sent for review.',
    result: 'success',
    systemsAffected: ['Salesforce CRM', 'Gmail'],
    confidence: 0.88,
    riskLevel: 'medium',
    timestamp: new Date(Date.now() - 2100000).toISOString(),
    humanInvolved: false,
  },
];

function getTypeIcon(type: string) {
  switch (type) {
    case 'action':
      return <Zap className="h-4 w-4 text-blue-500" />;
    case 'decision':
      return <Bot className="h-4 w-4 text-purple-500" />;
    case 'escalation':
      return <ArrowRight className="h-4 w-4 text-orange-500" />;
    case 'intervention':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'system':
      return <Activity className="h-4 w-4 text-gray-500" />;
    default:
      return <Activity className="h-4 w-4 text-gray-500" />;
  }
}

function getResultIcon(result: string) {
  switch (result) {
    case 'success':
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    case 'failure':
      return <XCircle className="h-3 w-3 text-red-500" />;
    case 'pending':
      return <Clock className="h-3 w-3 text-yellow-500" />;
    case 'blocked':
      return <AlertTriangle className="h-3 w-3 text-red-500" />;
    default:
      return <Clock className="h-3 w-3 text-gray-500" />;
  }
}

function getResultVariant(result: string) {
  switch (result) {
    case 'success':
      return 'success';
    case 'failure':
      return 'destructive';
    case 'pending':
      return 'warning';
    case 'blocked':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function getRiskColor(risk: string) {
  switch (risk) {
    case 'critical':
      return 'text-red-600 bg-red-50';
    case 'high':
      return 'text-orange-600 bg-orange-50';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50';
    case 'low':
      return 'text-green-600 bg-green-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

export function ActivityFeed() {
  const [activities] = useState(MOCK_ACTIVITIES);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Real-time Activity Feed
          </span>
          <Badge variant="outline">{activities.length} events</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(activity.type)}
                    <div>
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.agentName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activity.humanInvolved && (
                      <Badge variant="outline" className="text-[10px] gap-1">
                        <User className="h-3 w-3" />
                        Human
                      </Badge>
                    )}
                    <Badge variant={getResultVariant(activity.result) as 'success' | 'destructive' | 'warning' | 'secondary'}>
                      {getResultIcon(activity.result)}
                      <span className="ml-1">{activity.result}</span>
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-2">{activity.detail}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className={`px-1.5 py-0.5 rounded ${getRiskColor(activity.riskLevel)}`}>
                      {activity.riskLevel} risk
                    </span>
                    <span>Confidence: {Math.round(activity.confidence * 100)}%</span>
                    <span className="flex items-center gap-1">
                      Systems: {activity.systemsAffected.join(', ')}
                    </span>
                  </div>
                  <span>{formatDate(activity.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
