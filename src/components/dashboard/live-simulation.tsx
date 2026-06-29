'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TimelineEvent } from '@/types';
import { Zap, Bot, Clock, Activity } from 'lucide-react';

interface AgentProgress {
  id: string;
  name: string;
  type: string;
  status: string;
  currentTask: string | null;
  health: number;
  confidenceScore: number;
  toolCalls: string[];
  progress: number;
}

export function LiveSimulation() {
  const [agents, setAgents] = useState<AgentProgress[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [tick, setTick] = useState(0);
  const [tickSpeed, setTickSpeed] = useState(3000);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSim = useCallback(async () => {
    try {
      const res = await fetch('/api/simulation');
      const data = await res.json();
      if (data.success) {
        setAgents((data.state.agents || []).map((a: any) => ({
          ...a,
          toolCalls: data.state.toolCalls?.[a.id] || [],
          progress: data.state.progress?.[a.id] || 0,
        })));
        setEvents((prev: TimelineEvent[]) => {
          const combined = [...(data.newEvents || []), ...prev];
          return combined.slice(0, 20);
        });
        setTick(data.state.tick);
      }
    } catch (error) {
      console.error('Simulation fetch error:', error);
    }
  }, []);

  useEffect(() => {
    fetchSim();
    tickRef.current = setInterval(fetchSim, tickSpeed);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [fetchSim, tickSpeed]);

  const statusColors: Record<string, string> = {
    active: 'text-green-500 bg-green-500/10 border-green-200',
    idle: 'text-yellow-500 bg-yellow-500/10 border-yellow-200',
    error: 'text-red-500 bg-red-500/10 border-red-200',
    maintenance: 'text-gray-500 bg-gray-500/10 border-gray-200',
    offline: 'text-gray-400 bg-gray-400/10 border-gray-200',
    paused: 'text-orange-500 bg-orange-500/10 border-orange-200',
  };

  const eventIcons: Record<string, React.ReactNode> = {
    task: <Activity className="h-3 w-3 text-blue-500" />,
    alert: <Zap className="h-3 w-3 text-red-500" />,
    approval: <Clock className="h-3 w-3 text-orange-500" />,
    'agent-status': <Bot className="h-3 w-3 text-purple-500" />,
    audit: <Activity className="h-3 w-3 text-gray-500" />,
  };

  return (
    <>
      {/* Agent Monitor */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-500" />
            Live Agent Monitor
            <Badge variant="outline" className="ml-auto text-xs">
              Tick #{tick}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {agents.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-4">Initializing simulation...</div>
          ) : (
            agents.map((agent) => (
              <div key={agent.id} className="rounded-lg border p-2.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : agent.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                    <span className="text-sm font-medium truncate">{agent.name}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${statusColors[agent.status] || 'text-gray-500 bg-gray-500/10 border-gray-200'}`}>
                    {agent.status}
                  </span>
                </div>

                {/* Tool calls */}
                <div className="space-y-0.5">
                  {(agent as any).toolCalls?.length > 0 ? (
                    (agent as any).toolCalls.slice(0, 2).map((call: string, i: number) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <Zap className="h-2.5 w-2.5 text-blue-400 shrink-0" />
                        <span className="animate-pulse">{call}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] text-muted-foreground italic">Waiting for tasks...</div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <Progress value={(agent as any).progress || 0} className="h-1.5 flex-1" />
                  <span className="text-[10px] text-muted-foreground w-8 text-right">{(agent as any).progress || 0}%</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Live Event Stream */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Live Events
            <Badge variant="secondary" className="ml-auto text-xs">
              +{events.length} new
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 max-h-[240px] overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-4">Waiting for events...</div>
          ) : (
            events.map((event, i) => (
              <div
                key={event.id || i}
                className="flex items-start gap-2 py-1.5 border-b last:border-0 border-dashed text-xs"
              >
                <div className="mt-0.5 shrink-0">
                  {eventIcons[event.type] || <Activity className="h-3 w-3 text-gray-400" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{event.title}</div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {event.agentName && `${event.agentName} · `}
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                {event.severity && (
                  <Badge
                    variant={event.severity === 'critical' ? 'destructive' : 'secondary'}
                    className="text-[9px] px-1 py-0 h-4 shrink-0"
                  >
                    {event.severity}
                  </Badge>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}
