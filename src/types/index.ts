export type AgentStatus = 'active' | 'idle' | 'error' | 'maintenance' | 'offline' | 'paused';

export type AgentType = 
  | 'customer-support'
  | 'sales'
  | 'crm'
  | 'email'
  | 'whatsapp'
  | 'scheduling';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type AlertType = 
  | 'api-failure'
  | 'low-confidence'
  | 'permission-violation'
  | 'failed-task'
  | 'system-error'
  | 'security-breach';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type SystemConnectionStatus = 'connected' | 'disconnected' | 'error' | 'rate-limited';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  currentTask: string | null;
  confidenceScore: number;
  lastAction: string;
  lastActionTimestamp: string;
  health: number;
  totalTasks: number;
  successRate: number;
  createdAt: string;
  updatedAt: string;
  // Control Tower fields
  trustScore: number;
  interventionCount: number;
  lastIntervention: string | null;
  pausedAt: string | null;
  pausedBy: string | null;
}

export interface AgentBoundary {
  id: string;
  agentType: AgentType;
  agentName: string;
  allowedActions: string[];
  blockedActions: string[];
  allowedSystems: string[];
  maxRiskLevel: RiskLevel;
  requiresApproval: string[];
  dailyActionLimit: number;
  currentDailyCount: number;
  lastResetAt: string;
}

export interface SystemConnection {
  id: string;
  name: string;
  type: 'crm' | 'email' | 'messaging' | 'calendar' | 'payment' | 'database' | 'api';
  status: SystemConnectionStatus;
  lastSyncAt: string | null;
  errorCount: number;
  rateLimitRemaining: number | null;
  rateLimitMax: number | null;
  connectedAgents: AgentType[];
  health: number;
}

export interface Task {
  id: string;
  agentId: string;
  agentName: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  confidence: number;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Control Tower fields
  decisionContext: string | null;
  riskLevel: RiskLevel;
  humanOverride: boolean;
  overrideReason: string | null;
}

export interface Alert {
  id: string;
  agentId: string | null;
  agentName: string | null;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  metadata: Record<string, unknown>;
  acknowledged: boolean;
  acknowledgedBy: string | null;
  acknowledgedAt: string | null;
  createdAt: string;
  // Control Tower fields
  interventionRequired: boolean;
  resolvedBy: string | null;
  resolvedAt: string | null;
}

export interface AuditEntry {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  decision: string;
  user: string;
  confidence: number;
  result: 'success' | 'failure' | 'pending';
  metadata: Record<string, unknown>;
  timestamp: string;
  // Control Tower fields
  systemsAffected: string[];
  decisionReasoning: string;
  riskAssessment: RiskLevel;
  humanOverride: boolean;
}

export interface ApprovalRequest {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  description: string;
  riskLevel: RiskLevel;
  amount: number | null;
  data: Record<string, unknown>;
  status: ApprovalStatus;
  requestedBy: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  expiresAt: string;
  createdAt: string;
  // Control Tower fields
  decisionContext: string;
  businessJustification: string;
  impactAssessment: string;
  alternativeOptions: string[];
  escalationPath: string[];
}

export interface DashboardStats {
  activeAgents: number;
  totalAgents: number;
  runningTasks: number;
  completedTasks: number;
  failedTasks: number;
  successRate: number;
  pendingApprovals: number;
  activeAlerts: number;
  totalAuditEntries: number;
  recentActivity: AuditEntry[];
  agentPerformance: AgentPerformance[];
  // Executive KPIs
  blockedActions: number;
  avgExecutionTime: number;
  avgConfidence: number;
  avgTrustScore: number;
  humanApprovalRate: number;
  simulationTick: number;
  agentStatuses: { id: string; name: string; status: string }[];
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  tasksCompleted: number;
  tasksFailed: number;
  avgConfidence: number;
  successRate: number;
}

export interface TimelineEvent {
  id: string;
  type: 'task' | 'alert' | 'approval' | 'agent-status' | 'audit';
  title: string;
  description: string;
  agentId: string | null;
  agentName: string | null;
  severity: AlertSeverity | null;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
