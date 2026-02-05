const { toString, typeDefinitionMap } = require('../../../../src/init/dataTypes/tools');

describe('toString function - Date/Time/DateTime handling', () => {
  beforeAll(() => {
    // Mock typeDefinitionMap for testing
    typeDefinitionMap['nasl.core.Date'] = { typeKind: 'primitive', typeName: 'Date', typeNamespace: 'nasl.core' };
    typeDefinitionMap['nasl.core.Time'] = { typeKind: 'primitive', typeName: 'Time', typeNamespace: 'nasl.core' };
    typeDefinitionMap['nasl.core.DateTime'] = {
      typeKind: 'primitive',
      typeName: 'DateTime',
      typeNamespace: 'nasl.core',
    };
  });

  describe('Date type', () => {
    test('should format Date in default timezone', () => {
      const result = toString('nasl.core.Date', '2024-01-15');
      expect(result).toBe('2024-01-15');
    });

    test('should format Date in Asia/Shanghai timezone', () => {
      const result = toString('nasl.core.Date', '2024-01-15', 'Asia/Shanghai');
      expect(result).toBe('2024-01-15');
    });

    test('should format Date in America/New_York timezone', () => {
      const result = toString('nasl.core.Date', '2024-01-15T00:00:00.000Z', 'America/New_York');
      // UTC midnight Jan 15 = New York 7pm Jan 14 (EST)
      expect(result).toBe('2024-01-14');
    });

    test('should format Date with time part (should ignore time)', () => {
      const result = toString('nasl.core.Date', '2024-01-15T10:30:00');
      expect(result).toBe('2024-01-15');
    });
  });

  describe('Time type', () => {
    test('should format full time HH:mm:ss', () => {
      const result = toString('nasl.core.Time', '14:30:45');
      expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    test('should format partial time HH:mm', () => {
      const result = toString('nasl.core.Time', '14:30');
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    test('should format single digit hour time', () => {
      const result = toString('nasl.core.Time', '9:30:45');
      expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    test('should handle Time in different timezones', () => {
      const result = toString('nasl.core.Time', '14:30:45', 'Asia/Shanghai');
      expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    test('should handle datetime string as Time', () => {
      const result = toString('nasl.core.Time', '2024-01-15 14:30:45');
      expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('DateTime type', () => {
    test('should format DateTime in default timezone', () => {
      const result = toString('nasl.core.DateTime', '2024-01-15T10:30:45.000Z');
      expect(result).toBe('2024-01-15 18:30:45');
    });

    test('should format DateTime in Asia/Shanghai timezone', () => {
      const result = toString('nasl.core.DateTime', '2024-01-15T10:30:45.000Z', 'Asia/Shanghai');
      expect(result).toBe('2024-01-15 18:30:45');
    });

    test('should format DateTime in America/New_York timezone', () => {
      const result = toString('nasl.core.DateTime', '2024-01-15T10:30:45.000Z', 'America/New_York');
      expect(result).toBe('2024-01-15 05:30:45');
    });

    test('should format DateTime with milliseconds', () => {
      const result = toString('nasl.core.DateTime', '2024-01-15T10:30:45.000Z', 'UTC');
      expect(result).toBe('2024-01-15 10:30:45');
    });

    test('should handle local datetime string', () => {
      const result = toString('nasl.core.DateTime', '2024-01-15 10:30:45');
      expect(result).toBe('2024-01-15 10:30:45');
    });
  });

  describe('Edge cases', () => {
    test('should handle undefined', () => {
      const result = toString('nasl.core.Date', undefined);
      expect(result).toBe('');
    });

    test('should handle null', () => {
      const result = toString('nasl.core.Date', null);
      expect(result).toBe('');
    });

    test('should handle tabSize > 0 for Date', () => {
      const result = toString('nasl.core.Date', '2024-01-15', undefined, 1);
      expect(result).toBe('"2024-01-15"');
    });
  });
});
