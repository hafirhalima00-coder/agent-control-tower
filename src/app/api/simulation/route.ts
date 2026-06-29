import { NextResponse } from 'next/server';
import { advanceSimulation, getSimulationState } from '@/lib/simulation';

export async function GET() {
  try {
    const newEvents = advanceSimulation();
    const state = getSimulationState();
    return NextResponse.json({ success: true, newEvents, state });
  } catch (error) {
    console.error('Error in simulation:', error);
    return NextResponse.json(
      { success: false, error: 'Simulation error' },
      { status: 500 }
    );
  }
}
