import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/schema';
import { seedDatabase } from '@/lib/db/seed';
import { mapApprovalRequest } from '@/lib/db/mappers';

export async function GET(request: Request) {
  try {
    seedDatabase();
    const db = getDatabase();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    let query = 'SELECT * FROM approval_requests';
    const conditions: string[] = [];
    const values: unknown[] = [];
    
    if (status) {
      conditions.push('status = ?');
      values.push(status);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC LIMIT ?';
    values.push(limit);
    
    const requests = db.prepare(query).all(...values).map(mapApprovalRequest);
    
    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error('Error fetching approval requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch approval requests' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const db = getDatabase();
    const body = await request.json();
    const { id, status, reviewedBy } = body;
    
    db.prepare(`
      UPDATE approval_requests 
      SET status = ?, reviewed_by = ?, reviewed_at = ?
      WHERE id = ?
    `).run(status, reviewedBy, new Date().toISOString(), id);
    
    const approvalRequest = db.prepare('SELECT * FROM approval_requests WHERE id = ?').get(id);
    
    return NextResponse.json({ success: true, data: mapApprovalRequest(approvalRequest) });
  } catch (error) {
    console.error('Error updating approval request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update approval request' },
      { status: 500 }
    );
  }
}
