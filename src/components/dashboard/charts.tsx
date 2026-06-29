'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TASK_HISTORY = [
  { time: '00:00', completed: 12, failed: 1, pending: 3 },
  { time: '04:00', completed: 8, failed: 2, pending: 5 },
  { time: '08:00', completed: 24, failed: 3, pending: 8 },
  { time: '12:00', completed: 32, failed: 2, pending: 6 },
  { time: '16:00', completed: 28, failed: 1, pending: 4 },
  { time: '20:00', completed: 18, failed: 0, pending: 2 },
];

const AGENT_DISTRIBUTION = [
  { name: 'Support', value: 28, color: '#22c55e' },
  { name: 'Sales', value: 22, color: '#3b82f6' },
  { name: 'CRM', value: 18, color: '#a855f7' },
  { name: 'Email', value: 15, color: '#f59e0b' },
  { name: 'WhatsApp', value: 10, color: '#10b981' },
  { name: 'Scheduling', value: 7, color: '#6366f1' },
];

const CONFIDENCE_TREND = [
  { day: 'Mon', confidence: 92 },
  { day: 'Tue', confidence: 89 },
  { day: 'Wed', confidence: 94 },
  { day: 'Thu', confidence: 91 },
  { day: 'Fri', confidence: 95 },
  { day: 'Sat', confidence: 88 },
  { day: 'Sun', confidence: 93 },
];

interface TaskHistoryChartProps {
  data?: typeof TASK_HISTORY;
}

export function TaskHistoryChart({ data = TASK_HISTORY }: TaskHistoryChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Task Activity (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="failed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="time" className="text-xs" tick={{ fontSize: 11 }} />
            <YAxis className="text-xs" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#22c55e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#completed)"
            />
            <Area
              type="monotone"
              dataKey="failed"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#failed)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface AgentDistributionChartProps {
  data?: typeof AGENT_DISTRIBUTION;
}

export function AgentDistributionChart({ data = AGENT_DISTRIBUTION }: AgentDistributionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Task Distribution by Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => (
                <span className="text-xs">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface ConfidenceTrendChartProps {
  data?: typeof CONFIDENCE_TREND;
}

export function ConfidenceTrendChart({ data = CONFIDENCE_TREND }: ConfidenceTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Avg Confidence Score</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="day" className="text-xs" tick={{ fontSize: 11 }} />
            <YAxis domain={[80, 100]} className="text-xs" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="confidence" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
