import { 
  cn, 
  formatDate, 
  formatRelativeTime, 
  generateId, 
  getStatusColor, 
  getSeverityColor, 
  getRiskColor 
} from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn', () => {
    test('should merge class names', () => {
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).toBe('text-blue-500');
    });

    test('should handle conditional classes', () => {
      const result = cn('base', false && 'hidden', 'extra');
      expect(result).toContain('base');
      expect(result).toContain('extra');
      expect(result).not.toContain('hidden');
    });
  });

  describe('formatDate', () => {
    test('should format date string', () => {
      const date = '2024-01-15T10:30:00.000Z';
      const result = formatDate(date);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('should format Date object', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      const result = formatDate(date);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('formatRelativeTime', () => {
    test('should format recent time as "just now"', () => {
      const now = new Date().toISOString();
      const result = formatRelativeTime(now);
      expect(result).toBe('just now');
    });

    test('should format older time correctly', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const result = formatRelativeTime(fiveMinutesAgo);
      expect(result).toContain('m ago');
    });
  });

  describe('generateId', () => {
    test('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('getStatusColor', () => {
    test('should return correct color for active status', () => {
      const color = getStatusColor('active');
      expect(color).toBe('text-green-500');
    });

    test('should return correct color for error status', () => {
      const color = getStatusColor('error');
      expect(color).toBe('text-red-500');
    });

    test('should return default color for unknown status', () => {
      const color = getStatusColor('unknown');
      expect(color).toBe('text-gray-500');
    });
  });

  describe('getSeverityColor', () => {
    test('should return correct color for critical severity', () => {
      const color = getSeverityColor('critical');
      expect(color).toBe('bg-red-500');
    });

    test('should return correct color for low severity', () => {
      const color = getSeverityColor('low');
      expect(color).toBe('bg-blue-500');
    });
  });

  describe('getRiskColor', () => {
    test('should return correct color for high risk', () => {
      const color = getRiskColor('high');
      expect(color).toContain('text-orange-600');
      expect(color).toContain('bg-orange-50');
    });

    test('should return correct color for critical risk', () => {
      const color = getRiskColor('critical');
      expect(color).toContain('text-red-600');
      expect(color).toContain('bg-red-50');
    });
  });
});
