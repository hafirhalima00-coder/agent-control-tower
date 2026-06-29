import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/schema';
import { seedDatabase } from '@/lib/db/seed';
import { mapAlert } from '@/lib/db/mappers';

export async function GET(request: Request) {
  try {
    seedDatabase();
    const db = getDatabase();
    const { searchParams } = new URL(request.url);
    
    const severity = searchParams.get('severity');
    const acknowledged = searchParams.get('acknowledged');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    let query = 'SELECT * FROM alerts';
    const conditions: string[] = [];
    const values: unknown[] = [];
    
    if (severity) {
      conditions.push('severity = ?');
      values.push(severity);
    }
    if (acknowledged !== null && acknowledged !== undefined) {
      conditions.push('acknowledged = ?');
      values.push(acknowledged === 'true' ? 1 : 0);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC LIMIT ?';
    values.push(limit);
    
    const alerts = db.prepare(query).all(...values).map(mapAlert);
    
    return NextResponse.json({ success: true, data: alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const db = getDatabase();
    const body = await request.json();
    const { id, acknowledged, acknowledgedBy } = body;
    
    db.prepare(`
      UPDATE alerts 
      SET acknowledged = ?, acknowledged_by = ?, acknowledged_at = ?
      WHERE id = ?
    `).run(acknowledged ? 1 : 0, acknowledgedBy, new Date().toISOString(), id);
    
    const alert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(id);
    
    return NextResponse.json({ success: true, data: mapAlert(alert) });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}
