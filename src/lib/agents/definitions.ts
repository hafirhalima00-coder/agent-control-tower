import { AgentType } from '@/types';

export interface AgentDefinition {
  type: AgentType;
  name: string;
  description: string;
  capabilities: string[];
  defaultConfidence: number;
  healthRange: [number, number];
}

export const AGENT_DEFINITIONS: Record<AgentType, AgentDefinition> = {
  'customer-support': {
    type: 'customer-support',
    name: 'Customer Support Agent',
    description: 'Handles customer inquiries, complaint resolution, and support ticket management',
    capabilities: [
      'Ticket Classification',
      'Sentiment Analysis',
      'Response Generation',
      'Escalation Detection',
      'Knowledge Base Search',
    ],
    defaultConfidence: 0.92,
    healthRange: [85, 100],
  },
  sales: {
    type: 'sales',
    name: 'Sales Agent',
    description: 'Manages lead qualification, follow-ups, and sales pipeline automation',
    capabilities: [
      'Lead Scoring',
      'Email Outreach',
      'Meeting Scheduling',
      'Pipeline Updates',
      'Proposal Generation',
    ],
    defaultConfidence: 0.88,
    healthRange: [80, 100],
  },
  crm: {
    type: 'crm',
    name: 'CRM Agent',
    description: 'Maintains customer records, data enrichment, and CRM hygiene',
    capabilities: [
      'Contact Deduplication',
      'Data Enrichment',
      'Record Updates',
      'Segment Assignment',
      'Data Validation',
    ],
    defaultConfidence: 0.95,
    healthRange: [90, 100],
  },
  email: {
    type: 'email',
    name: 'Email Agent',
    description: 'Processes incoming emails, categorization, and automated responses',
    capabilities: [
      'Email Classification',
      'Auto-Reply Generation',
      'Priority Detection',
      'Attachment Processing',
      'Follow-up Scheduling',
    ],
    defaultConfidence: 0.90,
    healthRange: [82, 100],
  },
  whatsapp: {
    type: 'whatsapp',
    name: 'WhatsApp Agent',
    description: 'Handles WhatsApp Business interactions and customer communications',
    capabilities: [
      'Message Processing',
      'Quick Reply Generation',
      'Media Handling',
      'Order Tracking',
      'Payment Links',
    ],
    defaultConfidence: 0.87,
    healthRange: [78, 100],
  },
  scheduling: {
    type: 'scheduling',
    name: 'Scheduling Agent',
    description: 'Manages calendar appointments, meeting coordination, and scheduling optimization',
    capabilities: [
      'Calendar Management',
      'Conflict Resolution',
      'Meeting Optimization',
      'Reminder Setup',
      'Time Zone Handling',
    ],
    defaultConfidence: 0.94,
    healthRange: [88, 100],
  },
};

export const AGENT_TYPES: AgentType[] = Object.keys(AGENT_DEFINITIONS) as AgentType[];
