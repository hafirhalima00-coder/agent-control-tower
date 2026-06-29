import { AGENT_DEFINITIONS, AGENT_TYPES } from '@/lib/agents/definitions';
import { AgentType } from '@/types';

describe('Agent Definitions', () => {
  test('should have definitions for all agent types', () => {
    expect(AGENT_TYPES.length).toBe(6);
    
    const expectedTypes: AgentType[] = [
      'customer-support',
      'sales',
      'crm',
      'email',
      'whatsapp',
      'scheduling',
    ];
    
    expectedTypes.forEach((type) => {
      expect(AGENT_TYPES).toContain(type);
    });
  });

  test('should have valid definitions for each agent type', () => {
    AGENT_TYPES.forEach((type) => {
      const def = AGENT_DEFINITIONS[type];
      
      expect(def).toBeDefined();
      expect(def.type).toBe(type);
      expect(typeof def.name).toBe('string');
      expect(def.name.length).toBeGreaterThan(0);
      expect(typeof def.description).toBe('string');
      expect(def.description.length).toBeGreaterThan(0);
      expect(Array.isArray(def.capabilities)).toBe(true);
      expect(def.capabilities.length).toBeGreaterThan(0);
      expect(def.defaultConfidence).toBeGreaterThan(0);
      expect(def.defaultConfidence).toBeLessThanOrEqual(1);
      expect(def.healthRange).toBeDefined();
      expect(def.healthRange[0]).toBeLessThan(def.healthRange[1]);
    });
  });

  test('should have customer-support agent with correct properties', () => {
    const def = AGENT_DEFINITIONS['customer-support'];
    
    expect(def.name).toBe('Customer Support Agent');
    expect(def.capabilities).toContain('Ticket Classification');
    expect(def.capabilities).toContain('Sentiment Analysis');
  });

  test('should have sales agent with correct properties', () => {
    const def = AGENT_DEFINITIONS['sales'];
    
    expect(def.name).toBe('Sales Agent');
    expect(def.capabilities).toContain('Lead Scoring');
    expect(def.capabilities).toContain('Email Outreach');
  });

  test('should have CRM agent with correct properties', () => {
    const def = AGENT_DEFINITIONS['crm'];
    
    expect(def.name).toBe('CRM Agent');
    expect(def.capabilities).toContain('Contact Deduplication');
    expect(def.capabilities).toContain('Data Enrichment');
  });

  test('should have email agent with correct properties', () => {
    const def = AGENT_DEFINITIONS['email'];
    
    expect(def.name).toBe('Email Agent');
    expect(def.capabilities).toContain('Email Classification');
    expect(def.capabilities).toContain('Auto-Reply Generation');
  });

  test('should have WhatsApp agent with correct properties', () => {
    const def = AGENT_DEFINITIONS['whatsapp'];
    
    expect(def.name).toBe('WhatsApp Agent');
    expect(def.capabilities).toContain('Message Processing');
    expect(def.capabilities).toContain('Quick Reply Generation');
  });

  test('should have scheduling agent with correct properties', () => {
    const def = AGENT_DEFINITIONS['scheduling'];
    
    expect(def.name).toBe('Scheduling Agent');
    expect(def.capabilities).toContain('Calendar Management');
    expect(def.capabilities).toContain('Conflict Resolution');
  });
});
