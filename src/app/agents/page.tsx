'use client';

import { useEffect, useState, useCallback } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { SearchFilter } from '@/components/ui/search-filter';
import { AgentCardSkeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { cn } from '@/lib/utils';
import { Agent } from '@/types';
import { 
  Bot, 
  Activity, 
  Zap, 
  Clock, 
  RefreshCw,
  Settings,
  Pause,
  Play,
  Wifi,
  WifiOff,
} from 'lucide-react';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch('/api/agents');
      const data = await res.json();
      if (data.success) {
        setAgents(data.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 15000);
    return () => clearInterval(interval);
  }, [fetchAgents]);

  async function toggleAgentStatus(agentId: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'idle' : 'active';
    try {
      await fetch('/api/agents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: agentId, status: newStatus }),
      });
      fetchAgents();
    } catch (error) {
      console.error('Error updating agent:', error);
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'idle': return 'warning';
      case 'error': return 'destructive';
      case 'maintenance': return 'info';
      default: return 'secondary';
    }
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const statusFilters = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Idle', value: 'idle' },
    { label: 'Error', value: 'error' },
    { label: 'Maintenance', value: 'maintenance' },
  ];

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header title="Agents" />
          <main className="flex-1 p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <AgentCardSkeleton key={i} />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Agent Management" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">AI Agents</h2>
                <p className="text-muted-foreground">
                  Monitor and manage your AI agent fleet
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Auto-refreshing
                </Badge>
                <Button onClick={fetchAgents} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <SearchFilter
              placeholder="Search agents..."
              onSearch={setSearchQuery}
              filters={statusFilters}
              activeFilter={statusFilter}
              onFilterChange={setStatusFilter}
            />

            {/* Agent Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAgents.map((agent) => (
                <ErrorBoundary key={agent.id}>
                  <Card className="relative overflow-hidden transition-all hover:shadow-lg">
                    <div className={cn(
                      'absolute top-0 left-0 h-1 w-full',
                      agent.status === 'active' && 'bg-green-500',
                      agent.status === 'idle' && 'bg-yellow-500',
                      agent.status === 'error' && 'bg-red-500',
                      agent.status === 'maintenance' && 'bg-blue-500',
                      agent.status === 'offline' && 'bg-gray-500',
                    )} />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <Bot className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            <p className="text-sm text-muted-foreground capitalize">
                              {agent.type.replace('-', ' ')}
                            </p>
                          </div>
                        </div>
                        <Badge variant={getStatusVariant(agent.status) as 'success' | 'warning' | 'destructive' | 'info' | 'secondary'}>
                          {agent.status === 'active' && <Wifi className="mr-1 h-3 w-3" />}
                          {agent.status === 'offline' && <WifiOff className="mr-1 h-3 w-3" />}
                          {agent.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Zap className="h-3 w-3" />
                            Confidence
                          </div>
                          <p className="text-lg font-semibold">
                            {Math.round(agent.confidenceScore * 100)}%
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Activity className="h-3 w-3" />
                            Health
                          </div>
                          <Progress value={agent.health} className="h-2" />
                          <p className="text-xs text-muted-foreground">{agent.health}%</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Current Task
                        </div>
                        <p className="text-sm truncate">
                          {agent.currentTask || 'No active task'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          Last Action
                        </div>
                        <p className="text-sm truncate">{agent.lastAction}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Total Tasks</p>
                          <p className="text-sm font-medium">{agent.totalTasks}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Success Rate</p>
                          <p className="text-sm font-medium">{Math.round(agent.successRate * 100)}%</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => toggleAgentStatus(agent.id, agent.status)}
                        >
                          {agent.status === 'active' ? (
                            <>
                              <Pause className="mr-1 h-3 w-3" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="mr-1 h-3 w-3" />
                              Start
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </ErrorBoundary>
              ))}
            </div>

            {filteredAgents.length === 0 && (
              <div className="text-center py-12">
                <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No agents found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
