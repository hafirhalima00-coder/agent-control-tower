'use client';

import { useEffect, useState, useCallback } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { AgentStatusCards } from '@/components/dashboard/agent-status-cards';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { AgentPerformanceChart } from '@/components/dashboard/agent-performance-chart';
import { TaskHistoryChart, AgentDistributionChart, ConfidenceTrendChart } from '@/components/dashboard/charts';
import { AgentCommunicationView } from '@/components/dashboard/agent-communication';
import { SystemConnections } from '@/components/dashboard/system-connections';
import { AgentBoundaries } from '@/components/dashboard/agent-boundaries';
import { InterventionControls } from '@/components/dashboard/intervention-controls';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { TrustScoreVisualization } from '@/components/dashboard/trust-score';
import { ApprovalCenter } from '@/components/dashboard/approval-center';
import { AgentGraph } from '@/components/dashboard/agent-graph';
import { AIExplanation } from '@/components/dashboard/ai-explanation';
import { ReplayMode } from '@/components/dashboard/replay-mode';
import { LiveSimulation } from '@/components/dashboard/live-simulation';
import { StatsCardsSkeleton, AgentCardSkeleton, ChartSkeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { DashboardStats, Agent, AuditEntry } from '@/types';
import { RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [eventCount, setEventCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, agentsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/agents'),
      ]);

      const statsData = await statsRes.json();
      const agentsData = await agentsRes.json();

      if (statsData.success) setStats(statsData.data);
      if (agentsData.success) setAgents(agentsData.data);
      setLastUpdated(new Date());
      setEventCount(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Agent Control Tower" />
        <main className="flex-1 overflow-y-auto p-3 md:p-6">
          <div className="space-y-4 md:space-y-6 max-w-[1600px] mx-auto">
            {/* Live indicator */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
                {stats?.simulationTick !== undefined && stats.simulationTick > 0 && (
                  <Badge variant="secondary" className="text-[10px] gap-1">
                    <Zap className="h-2.5 w-2.5" />
                    Tick #{stats.simulationTick}
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={fetchData}>
                <RefreshCw className="mr-2 h-3 w-3" />
                Refresh
              </Button>
            </div>

            {/* Stats Cards */}
            <ErrorBoundary>
              {loading ? (
                <StatsCardsSkeleton />
              ) : (
                stats && <StatsCards stats={stats} />
              )}
            </ErrorBoundary>

            {/* Main Content with Tabs */}
            <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
              <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
                <TabsList className="w-full sm:w-auto inline-flex">
                  <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                  <TabsTrigger value="agents" className="text-xs sm:text-sm">Agents</TabsTrigger>
                  <TabsTrigger value="systems" className="text-xs sm:text-sm">Systems</TabsTrigger>
                  <TabsTrigger value="activity" className="text-xs sm:text-sm">Activity</TabsTrigger>
                  <TabsTrigger value="live" className="text-xs sm:text-sm">Live</TabsTrigger>
                  <TabsTrigger value="replay" className="text-xs sm:text-sm">Replay</TabsTrigger>
                </TabsList>
              </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 md:space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <ErrorBoundary><TaskHistoryChart /></ErrorBoundary>
                  <ErrorBoundary><AgentDistributionChart /></ErrorBoundary>
                  <ErrorBoundary><ConfidenceTrendChart /></ErrorBoundary>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <ErrorBoundary>
                    <AgentGraph agents={agents} eventCount={eventCount} />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <ApprovalCenter />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <AIExplanation />
                  </ErrorBoundary>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <ErrorBoundary>
                      {loading ? (
                        <div className="grid gap-4 md:grid-cols-2">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <AgentCardSkeleton key={i} />
                          ))}
                        </div>
                      ) : (
                        <AgentStatusCards agents={agents} />
                      )}
                    </ErrorBoundary>
                  </div>
                  <div className="space-y-4 md:space-y-6">
                    <ErrorBoundary><TrustScoreVisualization /></ErrorBoundary>
                    <ErrorBoundary>
                      {stats && <AgentPerformanceChart performance={stats.agentPerformance} />}
                    </ErrorBoundary>
                  </div>
                </div>
              </TabsContent>

              {/* Agents Tab */}
              <TabsContent value="agents" className="space-y-4 md:space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <ErrorBoundary><InterventionControls /></ErrorBoundary>
                  <ErrorBoundary><AgentBoundaries /></ErrorBoundary>
                </div>
                <ErrorBoundary>
                  <AgentCommunicationView />
                </ErrorBoundary>
              </TabsContent>

              {/* Systems Tab */}
              <TabsContent value="systems" className="space-y-4 md:space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <ErrorBoundary><SystemConnections /></ErrorBoundary>
                  <ErrorBoundary><TrustScoreVisualization /></ErrorBoundary>
                </div>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-4 md:space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <ErrorBoundary><ActivityFeed /></ErrorBoundary>
                  <div className="space-y-4 md:space-y-6">
                    <ErrorBoundary>
                      {stats && <RecentActivity activities={stats.recentActivity} />}
                    </ErrorBoundary>
                    <ErrorBoundary><AgentCommunicationView /></ErrorBoundary>
                  </div>
                </div>
              </TabsContent>

              {/* Live Tab */}
              <TabsContent value="live" className="space-y-4 md:space-y-6">
                <LiveSimulation />
              </TabsContent>

              {/* Replay Tab */}
              <TabsContent value="replay" className="space-y-4 md:space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <ErrorBoundary>
                    <ReplayMode events={stats?.recentActivity as AuditEntry[] || []} />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <AIExplanation />
                  </ErrorBoundary>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
