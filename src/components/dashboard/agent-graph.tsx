'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Agent } from '@/types';
import { Activity, Zap, ArrowDown } from 'lucide-react';

interface AgentGraphProps {
  agents: Agent[];
  eventCount?: number;
}

const hierarchy: Record<string, string[]> = {
  'CEO': ['customer-support', 'sales', 'crm', 'email', 'whatsapp', 'scheduling'],
};

const agentColors: Record<string, string> = {
  'customer-support': 'border-blue-400 bg-blue-50 dark:bg-blue-950',
  'sales': 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950',
  'crm': 'border-purple-400 bg-purple-50 dark:bg-purple-950',
  'email': 'border-amber-400 bg-amber-50 dark:bg-amber-950',
  'whatsapp': 'border-rose-400 bg-rose-50 dark:bg-rose-950',
  'scheduling': 'border-cyan-400 bg-cyan-50 dark:bg-cyan-950',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-500',
  idle: 'bg-yellow-500',
  error: 'bg-red-500',
  maintenance: 'bg-gray-500',
  offline: 'bg-gray-400',
  paused: 'bg-orange-500',
};

const agentIcons: Record<string, string> = {
  'customer-support': 'CS',
  'sales': 'SA',
  'crm': 'CRM',
  'email': 'EM',
  'whatsapp': 'WA',
  'scheduling': 'SC',
};

export function AgentGraph({ agents, eventCount = 0 }: AgentGraphProps) {
  const [activeFlows, setActiveFlows] = useState<{ from: string; to: string; id: number }[]>([]);

  useEffect(() => {
    if (eventCount === 0) return;
    const active = agents.filter(a => a.status === 'active');
    if (active.length === 0) return;
    const agent = active[Math.floor(Math.random() * active.length)];
    const flow = { from: 'CEO', to: agent.id, id: Date.now() };
    setActiveFlows(prev => [...prev.slice(-5), flow]);
    const timer = setTimeout(() => {
      setActiveFlows(prev => prev.filter(f => f.id !== flow.id));
    }, 2000);
    return () => clearTimeout(timer);
  }, [eventCount, agents]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-500" />
          Agent Hierarchy
          <Badge variant="outline" className="ml-auto text-xs">
            {agents.filter(a => a.status === 'active').length}/{agents.length} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-1">
          {/* CEO Node */}
          <div className="relative">
            <div className="px-4 py-2 rounded-lg border-2 border-slate-400 bg-slate-50 dark:bg-slate-900 font-bold text-sm text-center min-w-[80px]">
              CEO
              <div className="text-[10px] font-normal text-muted-foreground">Control Tower</div>
            </div>
          </div>

          {/* Flows */}
          <div className="relative flex justify-center gap-1">
            {activeFlows.map(flow => (
              <div
                key={flow.id}
                className="absolute animate-pulse text-blue-500"
                style={{ top: -8, animation: 'ping 2s ease-out' }}
              >
                <Zap className="h-5 w-5" />
              </div>
            ))}
          </div>

          {/* Connector line */}
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
          <ArrowDown className="h-3 w-3 text-slate-400 -mt-1" />

          {/* Agent Nodes */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-1 w-full">
            {agents.map(agent => {
              const colorClass = agentColors[agent.type] || 'border-slate-300';
              return (
                <div
                  key={agent.id}
                  className={`relative px-2 py-1.5 rounded-lg border-2 text-center text-xs transition-all duration-500 ${colorClass}`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusColors[agent.status] || 'bg-gray-400'} shrink-0`} />
                    <span className="font-medium truncate">{agentIcons[agent.type] || agent.type}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {agent.currentTask ? `${agent.currentTask.slice(0, 20)}...` : 'Idle'}
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <span className={`w-2 h-2 rounded-full ${statusColors[agent.status] || 'bg-gray-400'} inline-block`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
