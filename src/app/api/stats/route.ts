import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/schema';
import { seedDatabase } from '@/lib/db/seed';
import { getSimulationState } from '@/lib/simulation';

export async function GET() {
  try {
    seedDatabase();
    const db = getDatabase();

    const agentStats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        AVG(confidence_score) as avgConfidence,
        AVG(trust_score) as avgTrustScore,
        AVG(success_rate) as avgSuccessRate
      FROM agents
    `).get() as any;

    const taskStats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as running,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM tasks
    `).get() as any;

    const alertStats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN acknowledged = 0 THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN type = 'permission-violation' THEN 1 ELSE 0 END) as blocked
      FROM alerts
    `).get() as any;

    const approvalStats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM approval_requests
    `).get() as any;

    const auditCount = db.prepare('SELECT COUNT(*) as count FROM audit_log').get() as any;
    const auditTimes = db.prepare(`SELECT metadata FROM audit_log WHERE metadata LIKE '%executionTime%' LIMIT 50`).all() as any[];
    const execTimes = auditTimes
      .map(r => parseInt((typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata).executionTime) || 0)
      .filter(Boolean);
    const avgExecTime = execTimes.length > 0 ? execTimes.reduce((a, b) => a + b, 0) / execTimes.length : 0;

    const rawActivity = db.prepare(`SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 5`).all() as any[];
    const recentActivity = rawActivity.map((row) => ({
      id: row.id,
      agentId: row.agent_id,
      agentName: row.agent_name,
      action: row.action,
      decision: row.decision,
      user: row.user,
      confidence: row.confidence,
      result: row.result,
      metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
      timestamp: row.timestamp,
    }));

    const rawPerformance = db.prepare(`
      SELECT 
        a.id as agent_id,
        a.name as agent_name,
        COUNT(t.id) as tasks_completed,
        SUM(CASE WHEN t.status = 'failed' THEN 1 ELSE 0 END) as tasks_failed,
        AVG(t.confidence) as avg_confidence,
        CASE 
          WHEN COUNT(t.id) > 0 
          THEN (COUNT(CASE WHEN t.status = 'completed' THEN 1 END) * 100.0 / COUNT(t.id))
          ELSE 0 
        END as success_rate
      FROM agents a
      LEFT JOIN tasks t ON a.id = t.agent_id
      GROUP BY a.id, a.name
    `).all() as any[];

    const agentPerformance = rawPerformance.map((row) => ({
      agentId: row.agent_id,
      agentName: row.agent_name,
      tasksCompleted: row.tasks_completed,
      tasksFailed: row.tasks_failed,
      avgConfidence: row.avg_confidence,
      successRate: row.success_rate,
    }));

    const successRate = taskStats.total > 0 
      ? Math.round((taskStats.completed / taskStats.total) * 100) 
      : 0;

    const humanApprovalRate = (approvalStats.approved + approvalStats.rejected) > 0
      ? Math.round((approvalStats.approved / (approvalStats.approved + approvalStats.rejected)) * 100)
      : 0;

    const sim = getSimulationState();

    return NextResponse.json({
      success: true,
      data: {
        activeAgents: agentStats.active,
        totalAgents: agentStats.total,
        runningTasks: taskStats.running,
        completedTasks: taskStats.completed,
        failedTasks: taskStats.failed,
        successRate,
        pendingApprovals: approvalStats.pending,
        activeAlerts: alertStats.active,
        blockedActions: alertStats.blocked,
        totalAuditEntries: auditCount.count,
        recentActivity,
        agentPerformance,
        avgExecutionTime: Math.round(avgExecTime),
        avgConfidence: parseFloat((agentStats.avgConfidence || 0).toFixed(2)),
        avgTrustScore: Math.round(agentStats.avgTrustScore || 0),
        humanApprovalRate,
        simulationTick: sim.tick,
        agentStatuses: sim.agents.map((a: any) => ({ id: a.id, name: a.name, status: a.status })),
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
