import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/schema';

export async function GET() {
  try {
    const db = getDatabase();
    
    const entries = db.prepare(`
      SELECT 
        id, agent_id, agent_name, action, decision, "user", 
        confidence, result, metadata, timestamp,
        systems_affected, decision_reasoning, risk_assessment, human_override
      FROM audit_log 
      ORDER BY timestamp DESC
      LIMIT 1000
    `).all() as any[];

    const csvRows = [
      'id,agent_id,agent_name,action,decision,user,confidence,result,timestamp,systems_affected,decision_reasoning,risk_assessment,human_override',
      ...entries.map(e => [
        e.id,
        e.agent_id,
        `"${e.agent_name}"`,
        `"${e.action}"`,
        `"${e.decision}"`,
        e.user,
        e.confidence,
        e.result,
        e.timestamp,
        `"${e.systems_affected || ''}"`,
        `"${(e.decision_reasoning || '').replace(/"/g, '""')}"`,
        e.risk_assessment,
        e.human_override,
      ].join(','))
    ];

    return new NextResponse(csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="agentops-audit-log.csv"',
      },
    });
  } catch (error) {
    console.error('Error exporting audit log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export audit log' },
      { status: 500 }
    );
  }
}
