'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AgentPerformance } from '@/types';
import { BarChart3 } from 'lucide-react';

interface AgentPerformanceChartProps {
  performance: AgentPerformance[];
}

export function AgentPerformanceChart({ performance }: AgentPerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Agent Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {performance.map((agent) => (
            <div key={agent.agentId} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{agent.agentName}</p>
                <span className="text-sm text-muted-foreground">
                  {Math.round(agent.successRate)}% success
                </span>
              </div>
              <Progress value={agent.successRate} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{agent.tasksCompleted} completed</span>
                <span>{agent.tasksFailed} failed</span>
                <span>{Math.round(agent.avgConfidence * 100)}% avg confidence</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
