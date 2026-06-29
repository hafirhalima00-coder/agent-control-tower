export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  events: DemoEvent[];
}

export interface DemoEvent {
  type: 'agent-update' | 'task-create' | 'alert-create' | 'approval-request';
  delay: number;
  data: Record<string, unknown>;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'customer-complaint',
    name: 'Customer Complaint Resolution',
    description: 'Simulate a customer complaint flowing through support, CRM, and email agents',
    icon: '🎧',
    events: [
      {
        type: 'task-create',
        delay: 0,
        data: {
          agentName: 'Customer Support Agent',
          title: 'Handle customer complaint',
          description: 'Customer reporting billing issue with invoice #INV-2024-0892',
          status: 'in-progress',
          priority: 'high',
        },
      },
      {
        type: 'alert-create',
        delay: 2000,
        data: {
          severity: 'medium',
          title: 'Customer Escalation Detected',
          message: 'Customer expressed frustration. Sentiment score: -0.7',
          type: 'low-confidence',
        },
      },
      {
        type: 'agent-update',
        delay: 4000,
        data: {
          agentName: 'CRM Agent',
          status: 'active',
          currentTask: 'Retrieving customer history',
          confidenceScore: 0.94,
        },
      },
      {
        type: 'task-create',
        delay: 6000,
        data: {
          agentName: 'Email Agent',
          title: 'Send resolution email',
          description: 'Compose and send resolution email to customer',
          status: 'completed',
          priority: 'medium',
        },
      },
    ],
  },
  {
    id: 'lead-qualification',
    name: 'Lead Qualification Pipeline',
    description: 'Watch a new lead qualify through sales, scheduling, and email agents',
    icon: '🎯',
    events: [
      {
        type: 'task-create',
        delay: 0,
        data: {
          agentName: 'Sales Agent',
          title: 'Qualify new enterprise lead',
          description: 'New lead from Acme Corp - Enterprise signup form',
          status: 'in-progress',
          priority: 'high',
        },
      },
      {
        type: 'agent-update',
        delay: 3000,
        data: {
          agentName: 'Sales Agent',
          confidenceScore: 0.89,
          currentTask: 'Analyzing lead score',
        },
      },
      {
        type: 'approval-request',
        delay: 5000,
        data: {
          action: 'Schedule Executive Demo',
          description: 'Schedule demo call with VP of Engineering at Acme Corp',
          riskLevel: 'medium',
        },
      },
      {
        type: 'task-create',
        delay: 8000,
        data: {
          agentName: 'Scheduling Agent',
          title: 'Coordinate demo meeting',
          description: 'Find optimal time slot for 3 stakeholders across timezones',
          status: 'completed',
          priority: 'medium',
        },
      },
    ],
  },
  {
    id: 'security-incident',
    name: 'Security Incident Response',
    description: 'Simulate a security alert requiring immediate attention',
    icon: '🛡️',
    events: [
      {
        type: 'alert-create',
        delay: 0,
        data: {
          severity: 'critical',
          title: 'Unauthorized Access Attempt',
          message: 'Multiple failed login attempts detected from IP 192.168.1.100',
          type: 'permission-violation',
        },
      },
      {
        type: 'alert-create',
        delay: 1000,
        data: {
          severity: 'critical',
          title: 'Data Export Attempt Blocked',
          message: 'Agent attempted to export full customer database without authorization',
          type: 'permission-violation',
        },
      },
      {
        type: 'agent-update',
        delay: 2000,
        data: {
          agentName: 'CRM Agent',
          status: 'maintenance',
          currentTask: 'Security audit in progress',
          health: 45,
        },
      },
      {
        type: 'approval-request',
        delay: 4000,
        data: {
          action: 'Emergency System Lockdown',
          description: 'Lock down CRM system pending security investigation',
          riskLevel: 'critical',
        },
      },
    ],
  },
  {
    id: 'bulk-operations',
    name: 'Bulk Data Processing',
    description: 'Demonstrate system handling high-volume data operations',
    icon: '⚡',
    events: [
      {
        type: 'task-create',
        delay: 0,
        data: {
          agentName: 'CRM Agent',
          title: 'Bulk data enrichment',
          description: 'Enriching 10,000 contact records with LinkedIn data',
          status: 'in-progress',
          priority: 'urgent',
        },
      },
      {
        type: 'agent-update',
        delay: 2000,
        data: {
          agentName: 'CRM Agent',
          health: 72,
          confidenceScore: 0.88,
        },
      },
      {
        type: 'alert-create',
        delay: 4000,
        data: {
          severity: 'high',
          title: 'API Rate Limit Warning',
          message: 'CRM API approaching rate limit. 85% quota used.',
          type: 'api-failure',
        },
      },
      {
        type: 'task-create',
        delay: 6000,
        data: {
          agentName: 'Email Agent',
          title: 'Send bulk notification',
          description: 'Notify 500 customers about service update',
          status: 'completed',
          priority: 'medium',
        },
      },
    ],
  },
];
