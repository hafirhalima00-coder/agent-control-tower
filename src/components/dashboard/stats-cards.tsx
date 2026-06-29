'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Bot, 
  CheckSquare, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  TrendingDown 
} from 'lucide-react';

interface StatsCardsProps {
  stats: {
    activeAgents: number;
    totalAgents: number;
    runningTasks: number;
    completedTasks: number;
    failedTasks: number;
    successRate: number;
    pendingApprovals: number;
    activeAlerts: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Active Agents',
      value: stats.activeAgents,
      total: stats.totalAgents,
      icon: Bot,
      description: 'Currently operational',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Running Tasks',
      value: stats.runningTasks,
      total: stats.completedTasks + stats.runningTasks + stats.failedTasks,
      icon: CheckSquare,
      description: 'In progress',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: stats.successRate >= 90 ? TrendingUp : TrendingDown,
      description: 'Task completion rate',
      color: stats.successRate >= 90 ? 'text-green-500' : 'text-yellow-500',
      bgColor: stats.successRate >= 90 ? 'bg-green-500/10' : 'bg-yellow-500/10',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: Clock,
      description: 'Awaiting review',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Active Alerts',
      value: stats.activeAlerts,
      icon: AlertTriangle,
      description: 'Unacknowledged',
      color: stats.activeAlerts > 5 ? 'text-red-500' : 'text-yellow-500',
      bgColor: stats.activeAlerts > 5 ? 'bg-red-500/10' : 'bg-yellow-500/10',
    },
    {
      title: 'Failed Tasks',
      value: stats.failedTasks,
      icon: AlertTriangle,
      description: 'Need attention',
      color: stats.failedTasks > 3 ? 'text-red-500' : 'text-gray-500',
      bgColor: stats.failedTasks > 3 ? 'bg-red-500/10' : 'bg-gray-500/10',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={cn('rounded-lg p-2', card.bgColor)}>
              <card.icon className={cn('h-4 w-4', card.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.total !== undefined ? `of ${card.total} total` : card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
