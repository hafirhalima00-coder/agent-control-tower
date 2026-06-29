import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'agentops.db');

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    const fs = require('fs');
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'idle',
      current_task TEXT,
      confidence_score REAL NOT NULL DEFAULT 0.85,
      last_action TEXT NOT NULL,
      last_action_timestamp TEXT NOT NULL,
      health INTEGER NOT NULL DEFAULT 100,
      total_tasks INTEGER NOT NULL DEFAULT 0,
      success_rate REAL NOT NULL DEFAULT 0.95,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      trust_score INTEGER NOT NULL DEFAULT 85,
      intervention_count INTEGER NOT NULL DEFAULT 0,
      last_intervention TEXT,
      paused_at TEXT,
      paused_by TEXT
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      agent_name TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT NOT NULL DEFAULT 'medium',
      input TEXT NOT NULL DEFAULT '{}',
      output TEXT,
      confidence REAL NOT NULL DEFAULT 0.85,
      started_at TEXT,
      completed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      decision_context TEXT,
      risk_level TEXT NOT NULL DEFAULT 'low',
      human_override INTEGER NOT NULL DEFAULT 0,
      override_reason TEXT,
      FOREIGN KEY (agent_id) REFERENCES agents(id)
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      agent_id TEXT,
      agent_name TEXT,
      type TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'info',
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      metadata TEXT NOT NULL DEFAULT '{}',
      acknowledged INTEGER NOT NULL DEFAULT 0,
      acknowledged_by TEXT,
      acknowledged_at TEXT,
      created_at TEXT NOT NULL,
      intervention_required INTEGER NOT NULL DEFAULT 0,
      resolved_by TEXT,
      resolved_at TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      agent_name TEXT NOT NULL,
      action TEXT NOT NULL,
      decision TEXT NOT NULL,
      "user" TEXT NOT NULL,
      confidence REAL NOT NULL,
      result TEXT NOT NULL,
      metadata TEXT NOT NULL DEFAULT '{}',
      timestamp TEXT NOT NULL,
      systems_affected TEXT NOT NULL DEFAULT '[]',
      decision_reasoning TEXT,
      risk_assessment TEXT NOT NULL DEFAULT 'low',
      human_override INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS approval_requests (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      agent_name TEXT NOT NULL,
      action TEXT NOT NULL,
      description TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      amount REAL,
      data TEXT NOT NULL DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'pending',
      requested_by TEXT NOT NULL,
      reviewed_by TEXT,
      reviewed_at TEXT,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      decision_context TEXT,
      business_justification TEXT,
      impact_assessment TEXT,
      alternative_options TEXT NOT NULL DEFAULT '[]',
      escalation_path TEXT NOT NULL DEFAULT '[]'
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_agent_id ON tasks(agent_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_alerts_agent_id ON alerts(agent_id);
    CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
    CREATE INDEX IF NOT EXISTS idx_audit_log_agent_id ON audit_log(agent_id);
    CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);
    CREATE INDEX IF NOT EXISTS idx_approval_requests_status ON approval_requests(status);
  `);
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
