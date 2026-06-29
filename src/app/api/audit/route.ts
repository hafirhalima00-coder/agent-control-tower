import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/schema';
import { seedDatabase } from '@/lib/db/seed';
import { mapAuditEntry } from '@/lib/db/mappers';

export async function GET(request: Request) {
  try {
    seedDatabase();
    const db = getDatabase();
    const { searchParams } = new URL(request.url);
    
    const agentId = searchParams.get('agentId');
    const result = searchParams.get('result');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let query = 'SELECT * FROM audit_log';
    const conditions: string[] = [];
    const values: unknown[] = [];
    
    if (agentId) {
      conditions.push('agent_id = ?');
      values.push(agentId);
    }
    if (result) {
      conditions.push('result = ?');
      values.push(result);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);
    
    const entries = db.prepare(query).all(...values).map(mapAuditEntry);
    const total = db.prepare('SELECT COUNT(*) as count FROM audit_log').get() as { count: number };
    
    return NextResponse.json({ 
      success: true, 
      data: entries,
      pagination: {
        total: total.count,
        limit,
        offset,
      }
    });
  } catch (error) {
    console.error('Error fetching audit log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit log' },
      { status: 500 }
    );
  }
}
