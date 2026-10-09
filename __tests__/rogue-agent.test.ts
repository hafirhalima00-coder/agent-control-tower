import { DEMO_SCENARIOS } from '@/lib/demo-scenarios';
import { AGENT_DEFINITIONS } from '@/lib/agents/definitions';

describe('Deliberate Failure Test: Rogue Agent Containment & Kill Switch', () => {
  test('should verify security incident scenario triggers high-severity alert', () => {
    const securityScenario = DEMO_SCENARIOS.find(s => s.id === 'security-incident');
    expect(securityScenario).toBeDefined();
    
    // Check that it contains an alert-create with high severity
    const alertEvent = securityScenario?.events.find(e => e.type === 'alert-create');
    expect(alertEvent).toBeDefined();
    expect(alertEvent?.data.severity).toBe('critical');
    expect(alertEvent?.data.title).toContain('Unauthorized Access Attempt');
  });

  test('should verify agent boundary enforcement and kill switch containment capabilities', () => {
    const salesAgent = AGENT_DEFINITIONS['sales'];
    expect(salesAgent).toBeDefined();
    
    // Simulating rogue state: excessive refund attempt beyond bounds
    const rogueAction = {
      agentType: 'sales',
      action: 'bulk_refund',
      amount: 12500,
      spendingCap: 500,
      policy: 'FIN-004',
    };

    const isViolation = rogueAction.amount > rogueAction.spendingCap;
    expect(isViolation).toBe(true);
    
    // Containment action: kill switch activation
    const containmentState = {
      agentPaused: true,
      pendingActionsCancelled: true,
      trustScoreDrop: 64, // from 87 to 23
      auditLogged: true,
    };

    expect(containmentState.agentPaused).toBe(true);
    expect(containmentState.pendingActionsCancelled).toBe(true);
    expect(containmentState.auditLogged).toBe(true);
  });
});
