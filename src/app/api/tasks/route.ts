import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/schema';
import { seedDatabase } from '@/lib/db/seed';
import { mapTask } from '@/lib/db/mappers';

export async function GET(request: Request) {
  try {
    seedDatabase();
    const db = getDatabase();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status');
    const agentId = searchParams.get('agentId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let query = 'SELECT * FROM tasks';
    const conditions: string[] = [];
    const values: unknown[] = [];
    
    if (status) {
      conditions.push('status = ?');
      values.push(status);
    }
    if (agentId) {
      conditions.push('agent_id = ?');
      values.push(agentId);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);
    
    const tasks = db.prepare(query).all(...values).map(mapTask);
    const total = db.prepare('SELECT COUNT(*) as count FROM tasks').get() as { count: number };
    
    return NextResponse.json({ 
      success: true, 
      data: tasks,
      pagination: {
        total: total.count,
        limit,
        offset,
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
