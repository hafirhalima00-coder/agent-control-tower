'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  Pause, 
  Play, 
  Square, 
  RotateCcw, 
  AlertTriangle,
  CheckCircle,
  Shield,
  Clock,
  User,
} from 'lucide-react';

interface AgentIntervention {
  agentId: string;
  agentName: string;
  agentType: string;
  status: 'active' | 'idle' | 'paused' | 'error';
  trustScore: number;
  interventionsToday: number;
  lastIntervention: string | null;
  pausedAt: string | null;
  pausedBy: string | null;
  currentTask: string | null;
  confidence: number;
}

const MOCK_INTERVENTIONS: AgentIntervention[] = [
  {
    agentId: '1',
    agentName: 'Customer Support Agent',
    agentType: 'customer-support',
    status: 'active',
    trustScore: 92,
    interventionsToday: 2,
    lastIntervention: new Date(Date.now() - 3600000).toISOString(),
    pausedAt: null,
    pausedBy: null,
    currentTask: 'Processing customer inquiry #4521',
    confidence: 0.94,
  },
  {
    agentId: '2',
    agentName: 'Sales Agent',
    agentType: 'sales',
    status: 'active',
    trustScore: 87,
    interventionsToday: 1,
    lastIntervention: new Date(Date.now() - 7200000).toISOString(),
    pausedAt: null,
    pausedBy: null,
    currentTask: 'Qualifying lead from website form',
    confidence: 0.89,
  },
  {
    agentId: '3',
    agentName: 'CRM Agent',
    agentType: 'crm',
    status: 'paused',
    trustScore: 78,
    interventionsToday: 5,
    lastIntervention: new Date(Date.now() - 1800000).toISOString(),
    pausedAt: new Date(Date.now() - 1800000).toISOString(),
    pausedBy: 'admin@company.com',
    currentTask: null,
    confidence: 0.82,
  },
  {
    agentId: '4',
    agentName: 'Email Agent',
    agentType: 'email',
    status: 'active',
    trustScore: 95,
    interventionsToday: 0,
    lastIntervention: null,
    pausedAt: null,
    pausedBy: null,
    currentTask: 'Processing incoming email',
    confidence: 0.91,
  },
  {
    agentId: '5',
    agentName: 'WhatsApp Agent',
    agentType: 'whatsapp',
    status: 'error',
    trustScore: 65,
    interventionsToday: 8,
    lastIntervention: new Date(Date.now() - 600000).toISOString(),
    pausedAt: null,
    pausedBy: null,
    currentTask: null,
    confidence: 0.68,
  },
  {
    agentId: '6',
    agentName: 'Scheduling Agent',
    agentType: 'scheduling',
    status: 'active',
    trustScore: 98,
    interventionsToday: 0,
    lastIntervention: null,
    pausedAt: null,
    pausedBy: null,
    currentTask: 'Scheduling team meeting for next week',
    confidence: 0.96,
  },
];

function getStatusIcon(status: string) {
  switch (status) {
    case 'active':
      return <Play className="h-4 w-4 text-green-500" />;
    case 'idle':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'paused':
      return <Pause className="h-4 w-4 text-blue-500" />;
    case 'error':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Square className="h-4 w-4 text-gray-500" />;
  }
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'active':
      return 'success';
    case 'idle':
      return 'warning';
    case 'paused':
      return 'info';
    case 'error':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function getTrustColor(score: number) {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
}

function formatTimeAgo(date: string | null) {
  if (!date) return 'Never';
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function InterventionControls() {
  const [agents, setAgents] = useState(MOCK_INTERVENTIONS);

  const handlePause = (agentId: string) => {
    setAgents(prev => prev.map(a => 
      a.agentId === agentId 
        ? { ...a, status: 'paused' as const, pausedAt: new Date().toISOString(), pausedBy: 'admin@company.com' }
        : a
    ));
  };

  const handleResume = (agentId: string) => {
    setAgents(prev => prev.map(a => 
      a.agentId === agentId 
        ? { ...a, status: 'active' as const, pausedAt: null, pausedBy: null }
        : a
    ));
  };

  const handleStop = (agentId: string) => {
    setAgents(prev => prev.map(a => 
      a.agentId === agentId 
        ? { ...a, status: 'idle' as const, currentTask: null }
        : a
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Intervention Controls
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {agents.filter(a => a.status === 'active').length} active
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Pause className="h-3 w-3" />
              {agents.filter(a => a.status === 'paused').length} paused
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.agentId}
              className={cn(
                'rounded-lg border p-4 transition-all',
                agent.status === 'paused' && 'border-blue-200 bg-blue-50/50',
                agent.status === 'error' && 'border-red-200 bg-red-50/50',
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'rounded-full p-2',
                    agent.status === 'active' && 'bg-green-500/10',
                    agent.status === 'paused' && 'bg-blue-500/10',
                    agent.status === 'error' && 'bg-red-500/10',
                  )}>
                    {getStatusIcon(agent.status)}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{agent.agentName}</h3>
                    <p className="text-xs text-muted-foreground">
                      {agent.currentTask || 'No active task'}
                    </p>
                  </div>
                </div>
                <Badge variant={getStatusVariant(agent.status) as 'success' | 'warning' | 'info' | 'destructive' | 'secondary'}>
                  {agent.status}
                </Badge>
              </div>

              {/* Trust Score & Confidence */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Trust Score</p>
                  <div className="flex items-center gap-2">
                    <Progress value={agent.trustScore} className="h-1.5 flex-1" />
                    <span className={cn('text-sm font-medium', getTrustColor(agent.trustScore))}>
                      {agent.trustScore}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                  <div className="flex items-center gap-2">
                    <Progress value={agent.confidence * 100} className="h-1.5 flex-1" />
                    <span className="text-sm font-medium">
                      {Math.round(agent.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Intervention Stats */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {agent.interventionsToday} interventions today
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last: {formatTimeAgo(agent.lastIntervention)}
                </span>
                {agent.pausedBy && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Paused by: {agent.pausedBy}
                  </span>
                )}
              </div>

              {/* Control Buttons */}
              <div className="flex gap-2">
                {agent.status === 'active' ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handlePause(agent.agentId)}
                    >
                      <Pause className="mr-1 h-3 w-3" />
                      Pause
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStop(agent.agentId)}
                    >
                      <Square className="h-3 w-3" />
                    </Button>
                  </>
                ) : agent.status === 'paused' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleResume(agent.agentId)}
                  >
                    <Play className="mr-1 h-3 w-3" />
                    Resume
                  </Button>
                ) : agent.status === 'error' ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleResume(agent.agentId)}
                    >
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Restart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStop(agent.agentId)}
                    >
                      <Square className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleResume(agent.agentId)}
                  >
                    <Play className="mr-1 h-3 w-3" />
                    Start
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
