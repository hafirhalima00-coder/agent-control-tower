'use client';

import { useEffect, useState, useCallback } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchFilter } from '@/components/ui/search-filter';
import { TableRowSkeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { formatDate } from '@/lib/utils';
import { Task } from '@/types';
import { CheckSquare, Clock, AlertCircle, RefreshCw, Filter } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchTasks = useCallback(async () => {
    try {
      let url = '/api/tasks?limit=50';
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setTasks(data.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 12000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'pending': return 'warning';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Failed', value: 'failed' },
  ];

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header title="Tasks" />
          <main className="flex-1 p-6">
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <TableRowSkeleton key={i} />
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
        <Header title="Task Management" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Tasks</h2>
                <p className="text-muted-foreground">
                  Track and manage AI agent tasks
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {tasks.filter(t => t.status === 'in-progress').length} running
                </Badge>
                <Button onClick={fetchTasks} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <SearchFilter
              placeholder="Search tasks..."
              onSearch={setSearchQuery}
              filters={filters}
              activeFilter={statusFilter}
              onFilterChange={setStatusFilter}
            />

            {/* Tasks List */}
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <ErrorBoundary key={task.id}>
                  <Card className="transition-all hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium">{task.title}</h3>
                            <Badge variant={getStatusVariant(task.status) as 'success' | 'info' | 'warning' | 'destructive' | 'secondary'}>
                              {task.status}
                            </Badge>
                            <Badge variant={getPriorityVariant(task.priority) as 'destructive' | 'warning' | 'info' | 'secondary'}>
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(task.createdAt)}
                            </span>
                            <span>Agent: {task.agentName}</span>
                            <span className="flex items-center gap-1">
                              Confidence: {Math.round(task.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {task.status === 'pending' && (
                            <Button size="sm" variant="outline">
                              Start
                            </Button>
                          )}
                          {task.status === 'in-progress' && (
                            <Button size="sm" variant="outline">
                              Complete
                            </Button>
                          )}
                          {task.status === 'failed' && (
                            <Button size="sm" variant="outline">
                              Retry
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ErrorBoundary>
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No tasks found</h3>
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
