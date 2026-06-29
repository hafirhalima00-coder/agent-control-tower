'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Agent } from '@/types';
import { Activity, Zap, Clock } from 'lucide-react';

interface AgentStatusCardsProps {
  agents: Agent[];
}

export function AgentStatusCards({ agents }: AgentStatusCardsProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'idle':
        return 'warning';
      case 'error':
        return 'destructive';
      case 'maintenance':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Agent Status Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'h-2 w-2 rounded-full',
                  agent.status === 'active' && 'bg-green-500',
                  agent.status === 'idle' && 'bg-yellow-500',
                  agent.status === 'error' && 'bg-red-500',
                  agent.status === 'maintenance' && 'bg-blue-500',
                  agent.status === 'offline' && 'bg-gray-500',
                )} />
                <div>
                  <p className="font-medium text-sm">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {agent.currentTask || 'No active task'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    <span>{Math.round(agent.confidenceScore * 100)}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                </div>
                <div className="w-20">
                  <Progress value={agent.health} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{agent.health}%</p>
                </div>
                <Badge variant={getStatusVariant(agent.status) as 'success' | 'warning' | 'destructive' | 'info' | 'secondary'}>
                  {agent.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
