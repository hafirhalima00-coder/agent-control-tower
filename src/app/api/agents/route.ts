import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/schema';
import { seedDatabase } from '@/lib/db/seed';
import { mapAgent } from '@/lib/db/mappers';

export async function GET() {
  try {
    seedDatabase();
    const db = getDatabase();
    
    const agents = db.prepare('SELECT * FROM agents ORDER BY name').all().map(mapAgent);
    
    return NextResponse.json({ success: true, data: agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const db = getDatabase();
    const body = await request.json();
    const { id, status, currentTask } = body;
    
    const updates: string[] = [];
    const values: unknown[] = [];
    
    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    if (currentTask !== undefined) {
      updates.push('current_task = ?');
      values.push(currentTask);
    }
    
    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);
    
    db.prepare(`UPDATE agents SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    
    const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
    
    return NextResponse.json({ success: true, data: mapAgent(agent) });
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update agent' },
      { status: 500 }
    );
  }
}
