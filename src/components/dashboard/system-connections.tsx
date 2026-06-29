'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  Database, 
  Mail, 
  MessageSquare, 
  Calendar, 
  CreditCard, 
  Server,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

interface SystemConnection {
  id: string;
  name: string;
  type: 'crm' | 'email' | 'messaging' | 'calendar' | 'payment' | 'database' | 'api';
  status: 'connected' | 'disconnected' | 'error' | 'rate-limited';
  lastSyncAt: string | null;
  errorCount: number;
  rateLimitRemaining: number | null;
  rateLimitMax: number | null;
  connectedAgents: string[];
  health: number;
}

const MOCK_SYSTEMS: SystemConnection[] = [
  {
    id: '1',
    name: 'Salesforce CRM',
    type: 'crm',
    status: 'connected',
    lastSyncAt: new Date(Date.now() - 300000).toISOString(),
    errorCount: 0,
    rateLimitRemaining: 850,
    rateLimitMax: 1000,
    connectedAgents: ['crm', 'sales', 'customer-support'],
    health: 98,
  },
  {
    id: '2',
    name: 'Gmail',
    type: 'email',
    status: 'connected',
    lastSyncAt: new Date(Date.now() - 60000).toISOString(),
    errorCount: 2,
    rateLimitRemaining: 450,
    rateLimitMax: 500,
    connectedAgents: ['email', 'sales'],
    health: 94,
  },
  {
    id: '3',
    name: 'WhatsApp Business',
    type: 'messaging',
    status: 'connected',
    lastSyncAt: new Date(Date.now() - 120000).toISOString(),
    errorCount: 1,
    rateLimitRemaining: 180,
    rateLimitMax: 200,
    connectedAgents: ['whatsapp', 'customer-support'],
    health: 91,
  },
  {
    id: '4',
    name: 'Google Calendar',
    type: 'calendar',
    status: 'connected',
    lastSyncAt: new Date(Date.now() - 180000).toISOString(),
    errorCount: 0,
    rateLimitRemaining: null,
    rateLimitMax: null,
    connectedAgents: ['scheduling', 'sales'],
    health: 100,
  },
  {
    id: '5',
    name: 'Stripe',
    type: 'payment',
    status: 'rate-limited',
    lastSyncAt: new Date(Date.now() - 600000).toISOString(),
    errorCount: 5,
    rateLimitRemaining: 2,
    rateLimitMax: 100,
    connectedAgents: ['customer-support'],
    health: 65,
  },
  {
    id: '6',
    name: 'PostgreSQL',
    type: 'database',
    status: 'connected',
    lastSyncAt: new Date(Date.now() - 30000).toISOString(),
    errorCount: 0,
    rateLimitRemaining: null,
    rateLimitMax: null,
    connectedAgents: ['crm', 'sales', 'email', 'whatsapp', 'scheduling', 'customer-support'],
    health: 99,
  },
];

function getStatusIcon(status: string) {
  switch (status) {
    case 'connected':
      return <Wifi className="h-4 w-4 text-green-500" />;
    case 'disconnected':
      return <WifiOff className="h-4 w-4 text-gray-500" />;
    case 'error':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'rate-limited':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    default:
      return <Wifi className="h-4 w-4 text-gray-500" />;
  }
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'connected':
      return 'success';
    case 'disconnected':
      return 'secondary';
    case 'error':
      return 'destructive';
    case 'rate-limited':
      return 'warning';
    default:
      return 'secondary';
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'crm':
      return <Database className="h-5 w-5" />;
    case 'email':
      return <Mail className="h-5 w-5" />;
    case 'messaging':
      return <MessageSquare className="h-5 w-5" />;
    case 'calendar':
      return <Calendar className="h-5 w-5" />;
    case 'payment':
      return <CreditCard className="h-5 w-5" />;
    case 'database':
      return <Server className="h-5 w-5" />;
    default:
      return <Server className="h-5 w-5" />;
  }
}

export function SystemConnections() {
  const systems = MOCK_SYSTEMS;
  const connectedCount = systems.filter(s => s.status === 'connected').length;
  const overallHealth = Math.round(systems.reduce((sum, s) => sum + s.health, 0) / systems.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            System Connections
          </span>
          <Badge variant={connectedCount === systems.length ? 'success' : 'warning'}>
            {connectedCount}/{systems.length} connected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Overall System Health</span>
            <span>{overallHealth}%</span>
          </div>
          <Progress value={overallHealth} className="h-2" />
        </div>
        <div className="space-y-3">
          {systems.map((system) => (
            <div
              key={system.id}
              className={cn(
                'flex items-center justify-between rounded-lg border p-3 transition-colors',
                system.status === 'error' && 'border-red-200 bg-red-50/50',
                system.status === 'rate-limited' && 'border-yellow-200 bg-yellow-50/50'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'rounded-lg p-2',
                  system.status === 'connected' && 'bg-green-500/10',
                  system.status === 'error' && 'bg-red-500/10',
                  system.status === 'rate-limited' && 'bg-yellow-500/10',
                  system.status === 'disconnected' && 'bg-gray-500/10'
                )}>
                  {getTypeIcon(system.type)}
                </div>
                <div>
                  <p className="font-medium text-sm">{system.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {system.connectedAgents.length} agent{system.connectedAgents.length !== 1 ? 's' : ''} connected
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {system.rateLimitRemaining !== null && system.rateLimitMax !== null && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">API Quota</p>
                    <p className={cn(
                      'text-xs font-medium',
                      system.rateLimitRemaining < system.rateLimitMax * 0.1 && 'text-red-500',
                      system.rateLimitRemaining >= system.rateLimitMax * 0.1 && system.rateLimitRemaining < system.rateLimitMax * 0.3 && 'text-yellow-500'
                    )}>
                      {system.rateLimitRemaining}/{system.rateLimitMax}
                    </p>
                  </div>
                )}
                <Badge variant={getStatusVariant(system.status) as 'success' | 'warning' | 'destructive' | 'secondary'}>
                  {getStatusIcon(system.status)}
                  <span className="ml-1">{system.status}</span>
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
