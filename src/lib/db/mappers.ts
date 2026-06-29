export function mapAgent(row: any) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    status: row.status,
    currentTask: row.current_task,
    confidenceScore: row.confidence_score,
    lastAction: row.last_action,
    lastActionTimestamp: row.last_action_timestamp,
    health: row.health,
    totalTasks: row.total_tasks,
    successRate: row.success_rate,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    trustScore: row.trust_score,
    interventionCount: row.intervention_count,
    lastIntervention: row.last_intervention,
    pausedAt: row.paused_at,
    pausedBy: row.paused_by,
  };
}

export function mapTask(row: any) {
  return {
    id: row.id,
    agentId: row.agent_id,
    agentName: row.agent_name,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    input: typeof row.input === 'string' ? JSON.parse(row.input) : row.input,
    output: row.output ? (typeof row.output === 'string' ? JSON.parse(row.output) : row.output) : null,
    confidence: row.confidence,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    decisionContext: row.decision_context,
    riskLevel: row.risk_level,
    humanOverride: row.human_override === 1 || row.human_override === true,
    overrideReason: row.override_reason,
  };
}

export function mapAlert(row: any) {
  return {
    id: row.id,
    agentId: row.agent_id,
    agentName: row.agent_name,
    type: row.type,
    severity: row.severity,
    title: row.title,
    message: row.message,
    metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
    acknowledged: row.acknowledged === 1 || row.acknowledged === true,
    acknowledgedBy: row.acknowledged_by,
    acknowledgedAt: row.acknowledged_at,
    createdAt: row.created_at,
    interventionRequired: row.intervention_required === 1 || row.intervention_required === true,
    resolvedBy: row.resolved_by,
    resolvedAt: row.resolved_at,
  };
}

export function mapAuditEntry(row: any) {
  return {
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
    systemsAffected: typeof row.systems_affected === 'string' ? JSON.parse(row.systems_affected) : row.systems_affected,
    decisionReasoning: row.decision_reasoning,
    riskAssessment: row.risk_assessment,
    humanOverride: row.human_override === 1 || row.human_override === true,
  };
}

export function mapApprovalRequest(row: any) {
  return {
    id: row.id,
    agentId: row.agent_id,
    agentName: row.agent_name,
    action: row.action,
    description: row.description,
    riskLevel: row.risk_level,
    amount: row.amount,
    data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
    status: row.status,
    requestedBy: row.requested_by,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    decisionContext: row.decision_context,
    businessJustification: row.business_justification,
    impactAssessment: row.impact_assessment,
    alternativeOptions: typeof row.alternative_options === 'string' ? JSON.parse(row.alternative_options) : row.alternative_options,
    escalationPath: typeof row.escalation_path === 'string' ? JSON.parse(row.escalation_path) : row.escalation_path,
  };
}
