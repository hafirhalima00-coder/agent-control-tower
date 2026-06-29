import { getDatabase, closeDatabase } from '@/lib/db/schema';
import { seedDatabase } from '@/lib/db/seed';
import path from 'path';
import fs from 'fs';

const TEST_DB_PATH = path.join(process.cwd(), 'data', 'test-agentops.db');

describe('Database', () => {
  beforeAll(() => {
    // Ensure data directory exists
    const dataDir = path.dirname(TEST_DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  });

  afterAll(() => {
    closeDatabase();
    // Clean up test database
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  test('should initialize database successfully', () => {
    const db = getDatabase();
    expect(db).toBeDefined();
  });

  test('should seed database with mock data', () => {
    seedDatabase();
    const db = getDatabase();
    
    const agents = db.prepare('SELECT COUNT(*) as count FROM agents').get() as { count: number };
    expect(agents.count).toBeGreaterThan(0);
    expect(agents.count).toBe(6); // 6 agents

    const tasks = db.prepare('SELECT COUNT(*) as count FROM tasks').get() as { count: number };
    expect(tasks.count).toBeGreaterThan(0);

    const alerts = db.prepare('SELECT COUNT(*) as count FROM alerts').get() as { count: number };
    expect(alerts.count).toBeGreaterThan(0);

    const auditLog = db.prepare('SELECT COUNT(*) as count FROM audit_log').get() as { count: number };
    expect(auditLog.count).toBeGreaterThan(0);

    const approvals = db.prepare('SELECT COUNT(*) as count FROM approval_requests').get() as { count: number };
    expect(approvals.count).toBeGreaterThan(0);
  });

  test('should query agents correctly', () => {
    const db = getDatabase();
    const agents = db.prepare('SELECT * FROM agents').all() as any[];
    
    expect(Array.isArray(agents)).toBe(true);
    expect(agents.length).toBe(6);
    
    const firstAgent = agents[0];
    expect(firstAgent).toHaveProperty('id');
    expect(firstAgent).toHaveProperty('name');
    expect(firstAgent).toHaveProperty('type');
    expect(firstAgent).toHaveProperty('status');
    expect(firstAgent).toHaveProperty('confidence_score');
    expect(firstAgent).toHaveProperty('health');
  });

  test('should query tasks with filtering', () => {
    const db = getDatabase();
    
    const allTasks = db.prepare('SELECT * FROM tasks').all();
    expect(allTasks.length).toBeGreaterThan(0);

    const completedTasks = db.prepare('SELECT * FROM tasks WHERE status = ?').all('completed');
    expect(Array.isArray(completedTasks)).toBe(true);

    const failedTasks = db.prepare('SELECT * FROM tasks WHERE status = ?').all('failed');
    expect(Array.isArray(failedTasks)).toBe(true);
  });

  test('should query alerts correctly', () => {
    const db = getDatabase();
    const alerts = db.prepare('SELECT * FROM alerts').all();
    
    expect(Array.isArray(alerts)).toBe(true);
    expect(alerts.length).toBeGreaterThan(0);
  });

  test('should query audit log correctly', () => {
    const db = getDatabase();
    const entries = db.prepare('SELECT * FROM audit_log ORDER BY timestamp DESC').all();
    
    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBeGreaterThan(0);
  });

  test('should query approval requests correctly', () => {
    const db = getDatabase();
    const requests = db.prepare('SELECT * FROM approval_requests').all();
    
    expect(Array.isArray(requests)).toBe(true);
    expect(requests.length).toBeGreaterThan(0);
  });
});
