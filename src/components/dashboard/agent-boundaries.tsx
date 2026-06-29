'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, CheckCircle, XCircle, AlertTriangle, Bot } from 'lucide-react';

interface AgentBoundary {
  agentType: string;
  agentName: string;
  allowedActions: string[];
  blockedActions: string[];
  allowedSystems: string[];
  maxRiskLevel: string;
  requiresApproval: string[];
  dailyActionLimit: number;
  currentDailyCount: number;
}

const MOCK_BOUNDARIES: AgentBoundary[] = [
  {
    agentType: 'customer-support',
    agentName: 'Customer Support Agent',
    allowedActions: [
      'Read customer records',
      'Send support responses',
      'Create tickets',
      'Escalate to human',
      'Search knowledge base',
    ],
    blockedActions: [
      'Delete customer records',
      'Process refunds over $500',
      'Export customer data',
    ],
    allowedSystems: ['Salesforce CRM', 'Gmail', 'PostgreSQL'],
    maxRiskLevel: 'medium',
    requiresApproval: ['Process refunds', 'Close high-priority tickets'],
    dailyActionLimit: 500,
    currentDailyCount: 342,
  },
  {
    agentType: 'sales',
    agentName: 'Sales Agent',
    allowedActions: [
      'Read lead data',
      'Send outreach emails',
      'Update pipeline',
      'Schedule meetings',
      'Generate proposals',
    ],
    blockedActions: [
      'Delete leads',
      'Modify pricing',
      'Access customer financial data',
    ],
    allowedSystems: ['Salesforce CRM', 'Gmail', 'Google Calendar'],
    maxRiskLevel: 'medium',
    requiresApproval: ['Send mass emails', 'Update pricing tiers'],
    dailyActionLimit: 200,
    currentDailyCount: 87,
  },
  {
    agentType: 'crm',
    agentName: 'CRM Agent',
    allowedActions: [
      'Read customer records',
      'Update contact info',
      'Merge duplicates',
      'Enrich data',
      'Validate records',
    ],
    blockedActions: [
      'Delete records',
      'Export full database',
      'Modify billing info',
    ],
    allowedSystems: ['Salesforce CRM', 'PostgreSQL'],
    maxRiskLevel: 'low',
    requiresApproval: ['Bulk record updates', 'Data enrichment'],
    dailyActionLimit: 1000,
    currentDailyCount: 567,
  },
  {
    agentType: 'email',
    agentName: 'Email Agent',
    allowedActions: [
      'Read incoming emails',
      'Send auto-replies',
      'Classify emails',
      'Schedule follow-ups',
      'Process attachments',
    ],
    blockedActions: [
      'Delete emails',
      'Send to external domains',
      'Access confidential folders',
    ],
    allowedSystems: ['Gmail'],
    maxRiskLevel: 'low',
    requiresApproval: ['Send to new contacts'],
    dailyActionLimit: 300,
    currentDailyCount: 198,
  },
  {
    agentType: 'whatsapp',
    agentName: 'WhatsApp Agent',
    allowedActions: [
      'Read messages',
      'Send quick replies',
      'Send order updates',
      'Process simple queries',
    ],
    blockedActions: [
      'Send to new numbers',
      'Access payment data',
      'Modify order details',
    ],
    allowedSystems: ['WhatsApp Business'],
    maxRiskLevel: 'medium',
    requiresApproval: ['Send promotional messages', 'Process refunds'],
    dailyActionLimit: 400,
    currentDailyCount: 156,
  },
  {
    agentType: 'scheduling',
    agentName: 'Scheduling Agent',
    allowedActions: [
      'Read calendar',
      'Create meetings',
      'Send reminders',
      'Resolve conflicts',
    ],
    blockedActions: [
      'Delete calendar events',
      'Access personal calendars',
      'Modify recurring events',
    ],
    allowedSystems: ['Google Calendar'],
    maxRiskLevel: 'low',
    requiresApproval: ['Schedule with executives'],
    dailyActionLimit: 150,
    currentDailyCount: 43,
  },
];

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

export function AgentBoundaries() {
  const boundaries = MOCK_BOUNDARIES;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Agent Boundaries & Permissions
          </span>
          <Badge variant="outline">{boundaries.length} agents</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {boundaries.map((boundary) => (
              <div key={boundary.agentType} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <h3 className="font-medium text-sm">{boundary.agentName}</h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(boundary.maxRiskLevel)}`}>
                    Max: {boundary.maxRiskLevel} risk
                  </span>
                </div>

                {/* Daily Usage */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Daily Usage</span>
                    <span>{boundary.currentDailyCount}/{boundary.dailyActionLimit}</span>
                  </div>
                  <Progress 
                    value={(boundary.currentDailyCount / boundary.dailyActionLimit) * 100} 
                    className="h-1.5"
                  />
                </div>

                {/* Allowed Systems */}
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Connected Systems</p>
                  <div className="flex flex-wrap gap-1">
                    {boundary.allowedSystems.map((system) => (
                      <Badge key={system} variant="secondary" className="text-[10px]">
                        {system}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Allowed Actions */}
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Allowed Actions
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {boundary.allowedActions.map((action) => (
                      <Badge key={action} variant="outline" className="text-[10px] border-green-200 text-green-700">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Blocked Actions */}
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-red-500" />
                    Blocked Actions
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {boundary.blockedActions.map((action) => (
                      <Badge key={action} variant="outline" className="text-[10px] border-red-200 text-red-700">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Requires Approval */}
                {boundary.requiresApproval.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-yellow-500" />
                      Requires Human Approval
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {boundary.requiresApproval.map((action) => (
                        <Badge key={action} variant="outline" className="text-[10px] border-yellow-200 text-yellow-700">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
