import { NextResponse } from 'next/server';
import { DEMO_SCENARIOS } from '@/lib/demo-scenarios';

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    data: DEMO_SCENARIOS.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      icon: s.icon,
      eventCount: s.events.length,
    }))
  });
}
