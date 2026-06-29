import { getDatabase } from './db/schema';
import { AGENT_DEFINITIONS } from './agents/definitions';
import { Agent, AgentStatus, TimelineEvent } from '@/types';

let tickCount = 0;
const toolCalls: Record<string, string[]> = {};
const progress: Record<string, number> = {};
const timeline: TimelineEvent[] = [];

const TOOL_CALLS = [
  'Searching CRM database...',
  'Querying customer records...',
  'Classifying email intent...',
  'Drafting response template...',
  'Validating contact information...',
  'Checking rate limits...',
  'Syncing with external API...',
  'Analyzing sentiment score...',
  'Generating proposal draft...',
  'Updating pipeline stage...',
  'Processing webhook payload...',
  'Building report data...',
];

const EVENT_TITLES = [
  'Tool call: analyze_email',
  'Tool call: query_crm',
  'Tool call: send_message',
  'Tool call: update_record',
  'Tool call: create_event',
  'Tool call: generate_report',
  'Tool call: validate_address',
  'Tool call: enrich_contact',
];

export function getSimulationState() {
  const db = getDatabase();
  const agents = db.prepare('SELECT * FROM agents').all() as any[];

  return {
    agents: agents.map(a => ({
      id: a.id,
      name: a.name,
      type: a.type,
      status: a.status,
      currentTask: a.current_task,
      health: a.health,
      confidenceScore: a.confidence_score,
      trustScore: a.trust_score,
    })),
    toolCalls: { ...toolCalls },
    progress: { ...progress },
    timeline: timeline.slice(0, 50),
    tick: tickCount,
  };
}

export function advanceSimulation(): TimelineEvent[] {
  tickCount++;
  const db = getDatabase();
  const newEvents: TimelineEvent[] = [];

  const agents = db.prepare('SELECT * FROM agents').all() as any[];
  const statusCycle: AgentStatus[] = ['active', 'active', 'active', 'idle', 'active', 'error'];

  for (const agent of agents) {
    const shouldChange = Math.random() > 0.6;
    if (shouldChange) {
      const newStatus = statusCycle[Math.floor(Math.random() * statusCycle.length)];
      db.prepare('UPDATE agents SET status = ?, updated_at = ? WHERE id = ?')
        .run(newStatus, new Date().toISOString(), agent.id);

      if (newStatus === 'error') {
        newEvents.push({
          id: `evt-${tickCount}-${agent.id}`,
          type: 'agent-status',
          title: `${agent.name} encountered an error`,
          description: `Status changed to error (tick ${tickCount})`,
          agentId: agent.id,
          agentName: agent.name,
          severity: 'critical',
          timestamp: new Date().toISOString(),
          metadata: {},
        });
      }
    }

    if (agent.status === 'active' && Math.random() > 0.4) {
      const calls = toolCalls[agent.id] || [];
      const newCall = TOOL_CALLS[Math.floor(Math.random() * TOOL_CALLS.length)];
      calls.unshift(newCall);
      toolCalls[agent.id] = calls.slice(0, 5);

      const currentProgress = progress[agent.id] || 0;
      const increment = Math.floor(Math.random() * 25) + 5;
      progress[agent.id] = Math.min(100, currentProgress + increment);

      if (Math.random() > 0.7) {
        const event: TimelineEvent = {
          id: `evt-${tickCount}-${agent.id}-${Date.now()}`,
          type: 'task',
          title: EVENT_TITLES[Math.floor(Math.random() * EVENT_TITLES.length)],
          description: `${agent.name} executing operation (${progress[agent.id]}%)`,
          agentId: agent.id,
          agentName: agent.name,
          severity: null,
          timestamp: new Date().toISOString(),
          metadata: { progress: progress[agent.id] },
        };
        newEvents.push(event);
      }
    }

    if (Math.random() > 0.92) {
      const newApprovalId = crypto.randomUUID();
      const templates = [
        { action: 'Process Bulk Refund', desc: 'Refund $3,200 for order batch', risk: 'high', amount: 3200 },
        { action: 'Delete Customer Records', desc: 'Delete 200 inactive accounts', risk: 'critical', amount: null },
        { action: 'Modify Pricing Tier', desc: 'Update enterprise plan pricing', risk: 'high', amount: null },
        { action: 'Export Sensitive Data', desc: 'Export PII for compliance audit', risk: 'critical', amount: null },
      ];
      const tpl = templates[Math.floor(Math.random() * templates.length)];

      db.prepare(`
        INSERT INTO approval_requests (id, agent_id, agent_name, action, description, risk_level, amount, data, status, requested_by, reviewed_by, reviewed_at, expires_at, created_at, decision_context, business_justification, impact_assessment, alternative_options, escalation_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, NULL, NULL, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        newApprovalId, agent.id, agent.name, tpl.action, tpl.desc, tpl.risk, tpl.amount,
        JSON.stringify({ ticketId: `TKT-${Math.floor(Math.random() * 9000 + 1000)}` }),
        agent.name,
        new Date(Date.now() + 86400000).toISOString(),
        new Date().toISOString(),
        'Automated escalation from simulation engine',
        tpl.desc,
        'Requires human review before execution',
        JSON.stringify(['Delay processing', 'Request manager approval', 'Cancel operation']),
        JSON.stringify([`${agent.name} -> Team Lead -> Compliance`])
      );

      newEvents.push({
        id: `evt-${tickCount}-approval-${agent.id}`,
        type: 'approval',
        title: `${agent.name} requires approval`,
        description: tpl.desc,
        agentId: agent.id,
        agentName: agent.name,
        severity: tpl.risk === 'critical' ? 'critical' : 'high',
        timestamp: new Date().toISOString(),
        metadata: { action: tpl.action, amount: tpl.amount },
      });
    }

    if (Math.random() > 0.93) {
      db.prepare(`
        INSERT INTO audit_log (id, agent_id, agent_name, action, decision, "user", confidence, result, metadata, timestamp, systems_affected, decision_reasoning, risk_assessment, human_override)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        crypto.randomUUID(), agent.id, agent.name, 'simulated_action',
        `Auto-simulated decision (tick ${tickCount})`,
        'simulation-engine',
        parseFloat((0.75 + Math.random() * 0.24).toFixed(2)),
        Math.random() > 0.15 ? 'success' : 'failure',
        JSON.stringify({ tick: tickCount, simulation: true }),
        new Date().toISOString(),
        JSON.stringify(['Simulated System']),
        'Part of live simulation demo',
        ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        Math.random() > 0.9 ? 1 : 0
      );
    }
  }

  timeline.unshift(...newEvents);
  if (timeline.length > 200) timeline.length = 200;

  return newEvents;
}

export function resetSimulation() {
  tickCount = 0;
  for (const key of Object.keys(toolCalls)) delete toolCalls[key];
  for (const key of Object.keys(progress)) delete progress[key];
  timeline.length = 0;
}
