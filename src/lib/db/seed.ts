import { getDatabase } from './schema';
import { AGENT_DEFINITIONS, AGENT_TYPES } from '../agents/definitions';
import { Agent, Task, Alert, AuditEntry, ApprovalRequest } from '@/types';

const uuidv4 = () => crypto.randomUUID();

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
  return date.toISOString();
}

function generateAgents(): Agent[] {
  return AGENT_TYPES.map((type) => {
    const def = AGENT_DEFINITIONS[type];
    const statuses: Agent['status'][] = ['active', 'idle', 'active', 'active', 'maintenance'];
    const status = randomItem(statuses);
    const health = Math.floor(randomBetween(def.healthRange[0], def.healthRange[1]));
    const totalTasks = Math.floor(randomBetween(50, 500));
    const successRate = parseFloat(randomBetween(0.85, 0.99).toFixed(2));

    return {
      id: uuidv4(),
      name: def.name,
      type,
      status,
      currentTask: status === 'active' ? randomItem([
        'Processing customer inquiry #4521',
        'Qualifying lead from website form',
        'Updating CRM records for Q2',
        'Analyzing email campaign response',
        'Responding to WhatsApp message',
        'Scheduling team meeting for next week',
      ]) : null,
      confidenceScore: parseFloat(randomBetween(0.75, 0.99).toFixed(2)),
      lastAction: randomItem([
        'Resolved support ticket',
        'Qualified new lead',
        'Updated contact record',
        'Processed incoming email',
        'Sent quick reply',
        'Created calendar event',
        'Generated response draft',
        'Updated pipeline stage',
      ]),
      lastActionTimestamp: randomDate(1),
      health,
      totalTasks,
      successRate,
      createdAt: randomDate(30),
      updatedAt: randomDate(1),
      trustScore: Math.floor(randomBetween(70, 99)),
      interventionCount: Math.floor(randomBetween(0, 10)),
      lastIntervention: Math.random() > 0.5 ? randomDate(7) : null,
      pausedAt: status === 'paused' ? randomDate(1) : null,
      pausedBy: status === 'paused' ? 'admin@company.com' : null,
    };
  });
}

function generateTasks(agents: Agent[]): Task[] {
  const tasks: Task[] = [];
  const statuses: Task['status'][] = ['pending', 'in-progress', 'completed', 'completed', 'completed', 'failed'];
  const priorities: Task['priority'][] = ['low', 'medium', 'medium', 'high', 'urgent'];

  const taskTemplates = [
    { title: 'Resolve customer complaint', description: 'Customer reported billing issue with invoice #INV-2024-0892' },
    { title: 'Qualify incoming lead', description: 'New lead from Enterprise signup form - Acme Corp' },
    { title: 'Update customer record', description: 'Merge duplicate contacts for john.doe@company.com' },
    { title: 'Process email campaign', description: 'Analyze response rates for Q2 newsletter campaign' },
    { title: 'Handle WhatsApp inquiry', description: 'Order status request from customer #CUST-1234' },
    { title: 'Schedule product demo', description: 'Coordinate demo session with 3 stakeholders' },
    { title: 'Generate sales proposal', description: 'Create customized proposal for Enterprise plan' },
    { title: 'Data enrichment task', description: 'Enrich contact records with LinkedIn data' },
    { title: 'Process refund request', description: 'Customer requesting refund for order #ORD-5678' },
    { title: 'Send follow-up email', description: 'Follow up on pending proposal for TechStart Inc' },
  ];

  for (let i = 0; i < 25; i++) {
    const agent = randomItem(agents);
    const template = randomItem(taskTemplates);
    const status = randomItem(statuses);
    const createdAt = randomDate(7);
    
    tasks.push({
      id: uuidv4(),
      agentId: agent.id,
      agentName: agent.name,
      title: template.title,
      description: template.description,
      status,
      priority: randomItem(priorities),
      input: { source: randomItem(['api', 'webhook', 'manual', 'schedule']) },
      output: status === 'completed' ? { result: 'success', recordsProcessed: Math.floor(randomBetween(1, 50)) } : null,
      confidence: parseFloat(randomBetween(0.70, 0.99).toFixed(2)),
      startedAt: status !== 'pending' ? createdAt : null,
      completedAt: status === 'completed' || status === 'failed' ? randomDate(1) : null,
      createdAt,
      updatedAt: randomDate(1),
      decisionContext: randomItem([
        'Automated processing based on standard workflow',
        'Escalated from initial triage',
        'Triggered by customer request',
        'Part of scheduled batch process',
        'Response to system event',
      ]),
      riskLevel: randomItem(['low', 'medium', 'medium', 'high']),
      humanOverride: Math.random() > 0.8,
      overrideReason: Math.random() > 0.8 ? randomItem([
        'Customer requested human assistance',
        'Confidence below threshold',
        'Policy violation detected',
        null,
      ]) : null,
    });
  }

  return tasks;
}

function generateAlerts(agents: Agent[]): Alert[] {
  const alerts: Alert[] = [];
  const types: Alert['type'][] = ['api-failure', 'low-confidence', 'permission-violation', 'failed-task', 'system-error'];
  const severities: Alert['severity'][] = ['critical', 'high', 'medium', 'low', 'info'];

  const alertTemplates = [
    { type: 'api-failure' as const, title: 'API Rate Limit Exceeded', message: 'Sales Agent hit rate limit on CRM API' },
    { type: 'low-confidence' as const, title: 'Low Confidence Score', message: 'Customer Support Agent confidence dropped below 80%' },
    { type: 'permission-violation' as const, title: 'Unauthorized Access Attempt', message: 'Email Agent attempted to access restricted endpoint' },
    { type: 'failed-task' as const, title: 'Task Execution Failed', message: 'WhatsApp Agent failed to send message after 3 retries' },
    { type: 'system-error' as const, title: 'System Error Detected', message: 'Scheduling Agent encountered timezone conversion error' },
    { type: 'api-failure' as const, title: 'Webhook Delivery Failed', message: 'Failed to deliver webhook to external endpoint' },
    { type: 'low-confidence' as const, title: 'Classification Uncertainty', message: 'Email Agent unsure about ticket priority classification' },
    { type: 'failed-task' as const, title: 'Data Sync Failed', message: 'CRM Agent sync failed due to network timeout' },
  ];

  for (let i = 0; i < 12; i++) {
    const agent = randomItem(agents);
    const template = randomItem(alertTemplates);
    const severity = randomItem(severities);

    alerts.push({
      id: uuidv4(),
      agentId: agent.id,
      agentName: agent.name,
      type: template.type,
      severity,
      title: template.title,
      message: template.message,
      metadata: { errorCode: Math.floor(randomBetween(1000, 9999)), endpoint: '/api/v1/resource' },
      acknowledged: Math.random() > 0.6,
      acknowledgedBy: Math.random() > 0.6 ? 'admin@company.com' : null,
      acknowledgedAt: Math.random() > 0.6 ? randomDate(1) : null,
      createdAt: randomDate(3),
      interventionRequired: severity === 'critical' || severity === 'high',
      resolvedBy: Math.random() > 0.7 ? 'admin@company.com' : null,
      resolvedAt: Math.random() > 0.7 ? randomDate(1) : null,
    });
  }

  return alerts;
}

function generateAuditLog(agents: Agent[]): AuditEntry[] {
  const entries: AuditEntry[] = [];
  const actions = [
    'resolved_ticket', 'qualified_lead', 'updated_record', 'processed_email',
    'sent_response', 'created_event', 'updated_pipeline', 'generated_proposal',
    'processed_refund', 'escalated_issue', 'merged_contacts', 'sent_notification',
  ];
  const results: AuditEntry['result'][] = ['success', 'success', 'success', 'failure'];

  for (let i = 0; i < 40; i++) {
    const agent = randomItem(agents);
    const action = randomItem(actions);
    const result = randomItem(results);

    entries.push({
      id: uuidv4(),
      agentId: agent.id,
      agentName: agent.name,
      action,
      decision: `Auto-${action.replace('_', ' ')} based on business rules`,
      user: randomItem(['system', 'admin@company.com', 'agent-automation']),
      confidence: parseFloat(randomBetween(0.75, 0.99).toFixed(2)),
      result,
      metadata: { executionTime: Math.floor(randomBetween(50, 500)) + 'ms' },
      timestamp: randomDate(7),
      systemsAffected: randomItem([
        ['Salesforce CRM'],
        ['Gmail'],
        ['WhatsApp Business'],
        ['Google Calendar'],
        ['Salesforce CRM', 'Gmail'],
        ['PostgreSQL'],
      ]),
      decisionReasoning: randomItem([
        'Standard workflow automation',
        'Customer request processed',
        'Scheduled batch operation',
        'Event-triggered response',
        'Policy-based routing',
      ]),
      riskAssessment: randomItem(['low', 'low', 'medium', 'high']),
      humanOverride: Math.random() > 0.85,
    });
  }

  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function generateApprovalRequests(agents: Agent[]): ApprovalRequest[] {
  const requests: ApprovalRequest[] = [];
  const statuses: ApprovalRequest['status'][] = ['pending', 'pending', 'approved', 'rejected'];
  const riskLevels: ApprovalRequest['riskLevel'][] = ['low', 'medium', 'high', 'critical'];

  const approvalTemplates = [
    { action: 'Process Refund', description: 'Process refund of $1,250 for customer #CUST-5678', amount: 1250, risk: 'high' as const },
    { action: 'Delete CRM Records', description: 'Delete 150 inactive contact records from CRM database', amount: null, risk: 'critical' as const },
    { action: 'Export Customer Database', description: 'Export full customer database for quarterly analysis', amount: null, risk: 'critical' as const },
    { action: 'Update Pricing', description: 'Update enterprise pricing tier by 15%', amount: null, risk: 'high' as const },
    { action: 'Process Bulk Refund', description: 'Process batch refund of $5,400 for affected customers', amount: 5400, risk: 'critical' as const },
    { action: 'Send Mass Email', description: 'Send promotional email to 10,000 contacts', amount: null, risk: 'medium' as const },
    { action: 'Close Support Ticket', description: 'Close high-priority support ticket without resolution', amount: null, risk: 'medium' as const },
  ];

  for (let i = 0; i < 8; i++) {
    const agent = randomItem(agents);
    const template = randomItem(approvalTemplates);
    const status = randomItem(statuses);

    requests.push({
      id: uuidv4(),
      agentId: agent.id,
      agentName: agent.name,
      action: template.action,
      description: template.description,
      riskLevel: template.risk,
      amount: template.amount,
      data: { ticketId: `TKT-${Math.floor(randomBetween(1000, 9999))}` },
      status,
      requestedBy: agent.name,
      reviewedBy: status !== 'pending' ? 'admin@company.com' : null,
      reviewedAt: status !== 'pending' ? randomDate(1) : null,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: randomDate(3),
      decisionContext: randomItem([
        'Agent confidence below approval threshold (85%)',
        'Action exceeds predefined risk limits',
        'External policy requires human verification',
        'Customer account flagged for review',
      ]),
      businessJustification: randomItem([
        'Customer requested refund due to service disruption',
        'Records identified as duplicates during Q2 audit',
        'Required for quarterly compliance reporting',
        'Matches approved discount policy for enterprise accounts',
      ]),
      impactAssessment: randomItem([
        'Direct financial impact, affects 1 customer',
        'Removes stale data, no direct customer impact',
        'Requires 24-hour processing window',
        'Affects multiple departments, needs coordination',
      ]),
      alternativeOptions: randomItem([
        ['Partial refund of $500', 'Service credit instead'],
        ['Archive instead of delete', 'Flag for manual review'],
        ['Export with anonymized data', 'Use aggregated reports'],
        ['Apply discount on next invoice', 'Waive late fee instead'],
      ]),
      escalationPath: ['Agent -> Team Lead -> Compliance -> Admin'],
    });
  }

  return requests;
}

export function seedDatabase(): void {
  const db = getDatabase();
  
  const existingAgents = db.prepare('SELECT COUNT(*) as count FROM agents').get() as { count: number };
  if (existingAgents.count > 0) {
    return;
  }

  const agents = generateAgents();
  const tasks = generateTasks(agents);
  const alerts = generateAlerts(agents);
  const auditLog = generateAuditLog(agents);
  const approvals = generateApprovalRequests(agents);

  const insertAgent = db.prepare(`
    INSERT INTO agents (id, name, type, status, current_task, confidence_score, last_action, last_action_timestamp, health, total_tasks, success_rate, created_at, updated_at, trust_score, intervention_count, last_intervention, paused_at, paused_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertTask = db.prepare(`
    INSERT INTO tasks (id, agent_id, agent_name, title, description, status, priority, input, output, confidence, started_at, completed_at, created_at, updated_at, decision_context, risk_level, human_override, override_reason)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAlert = db.prepare(`
    INSERT INTO alerts (id, agent_id, agent_name, type, severity, title, message, metadata, acknowledged, acknowledged_by, acknowledged_at, created_at, intervention_required, resolved_by, resolved_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAudit = db.prepare(`
    INSERT INTO audit_log (id, agent_id, agent_name, action, decision, "user", confidence, result, metadata, timestamp, systems_affected, decision_reasoning, risk_assessment, human_override)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertApproval = db.prepare(`
    INSERT INTO approval_requests (id, agent_id, agent_name, action, description, risk_level, amount, data, status, requested_by, reviewed_by, reviewed_at, expires_at, created_at, decision_context, business_justification, impact_assessment, alternative_options, escalation_path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    for (const agent of agents) {
      insertAgent.run(
        agent.id, agent.name, agent.type, agent.status, agent.currentTask,
        agent.confidenceScore, agent.lastAction, agent.lastActionTimestamp,
        agent.health, agent.totalTasks, agent.successRate, agent.createdAt, agent.updatedAt,
        agent.trustScore, agent.interventionCount, agent.lastIntervention,
        agent.pausedAt, agent.pausedBy
      );
    }

    for (const task of tasks) {
      insertTask.run(
        task.id, task.agentId, task.agentName, task.title, task.description,
        task.status, task.priority, JSON.stringify(task.input),
        task.output ? JSON.stringify(task.output) : null,
        task.confidence, task.startedAt, task.completedAt, task.createdAt, task.updatedAt,
        task.decisionContext, task.riskLevel, task.humanOverride ? 1 : 0, task.overrideReason
      );
    }

    for (const alert of alerts) {
      insertAlert.run(
        alert.id, alert.agentId, alert.agentName, alert.type, alert.severity,
        alert.title, alert.message, JSON.stringify(alert.metadata),
        alert.acknowledged ? 1 : 0, alert.acknowledgedBy, alert.acknowledgedAt, alert.createdAt,
        alert.interventionRequired ? 1 : 0, alert.resolvedBy, alert.resolvedAt
      );
    }

    for (const entry of auditLog) {
      insertAudit.run(
        entry.id, entry.agentId, entry.agentName, entry.action, entry.decision,
        entry.user, entry.confidence, entry.result, JSON.stringify(entry.metadata), entry.timestamp,
        JSON.stringify(entry.systemsAffected), entry.decisionReasoning, entry.riskAssessment,
        entry.humanOverride ? 1 : 0
      );
    }

    for (const request of approvals) {
      insertApproval.run(
        request.id, request.agentId, request.agentName, request.action, request.description,
        request.riskLevel, request.amount, JSON.stringify(request.data),
        request.status, request.requestedBy, request.reviewedBy, request.reviewedAt,
        request.expiresAt, request.createdAt,
        request.decisionContext, request.businessJustification, request.impactAssessment,
        JSON.stringify(request.alternativeOptions), JSON.stringify(request.escalationPath)
      );
    }
  });

  transaction();
}
