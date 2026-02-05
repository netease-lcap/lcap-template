const { fromString, typeDefinitionMap } = require('../../../../src/init/dataTypes/tools');

describe('fromString function - Date/Time/DateTime parsing', () => {
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

  describe('DateTime parsing', () => {
    test('should parse standard datetime string', () => {
      const result = fromString('2026-02-05 12:00:00', 'nasl.core.DateTime');
      expect(result).toBe('2026-02-05T12:00:00.000+08:00');
    });

    test('should parse ISO datetime string', () => {
      const result = fromString('2024-01-15T04:00:00.000Z', 'nasl.core.DateTime');
      expect(result).toBe('2024-01-15T12:00:00.000+08:00');
    });

    test('should parse date-only string to DateTime', () => {
      const result = fromString('2024-01-15', 'nasl.core.DateTime');
      expect(result).toBe('2024-01-15T08:00:00.000+08:00');
    });
  });

  describe('Date parsing', () => {
    test('should parse standard date string', () => {
      const result = fromString('2024-01-15', 'nasl.core.Date');
      expect(result).toBe('2024-01-15');
    });

    test('should parse datetime string to Date (extracts date part)', () => {
      const result = fromString('2024-01-15 10:30:45', 'nasl.core.Date');
      expect(result).toBe('2024-01-15');
    });

    test('should parse ISO string to Date', () => {
      const result = fromString('2024-01-15T10:30:45.000Z', 'nasl.core.Date');
      expect(result).toBe('2024-01-15');
    });
  });

  describe('Time parsing', () => {
    test('should parse full time HH:mm:ss', () => {
      const result = fromString('14:30:45', 'nasl.core.Time');
      expect(result).toBe('14:30:45');
    });

    test('should parse partial time HH:mm:ss (with leading zeros)', () => {
      const result = fromString('09:05:03', 'nasl.core.Time');
      expect(result).toBe('09:05:03');
    });

    test('should parse midnight time', () => {
      const result = fromString('00:00:00', 'nasl.core.Time');
      expect(result).toBe('00:00:00');
    });

    test('should parse end of day time', () => {
      const result = fromString('23:59:59', 'nasl.core.Time');
      expect(result).toBe('23:59:59');
    });
  });

  describe('Edge cases and validation', () => {
    test('should handle numeric values for Integer', () => {
      typeDefinitionMap['nasl.core.Integer'] = { typeKind: 'primitive', typeName: 'Integer' };
      const result = fromString('12345', 'nasl.core.Integer');
      expect(result).toBe(12345);
    });

    test('should handle numeric values for Long', () => {
      typeDefinitionMap['nasl.core.Long'] = { typeKind: 'primitive', typeName: 'Long' };
      const result = fromString('123456789', 'nasl.core.Long');
      expect(result).toBe(123456789);
    });

    test('should handle decimal values', () => {
      typeDefinitionMap['nasl.core.Decimal'] = { typeKind: 'primitive', typeName: 'Decimal' };
      const result = fromString('123.456', 'nasl.core.Decimal');
      expect(result).toBe(123.456);
    });

    test('should handle boolean true', () => {
      typeDefinitionMap['nasl.core.Boolean'] = { typeKind: 'primitive', typeName: 'Boolean' };
      const result = fromString('true', 'nasl.core.Boolean');
      expect(result).toBe(true);
    });

    test('should handle boolean false', () => {
      typeDefinitionMap['nasl.core.Boolean'] = { typeKind: 'primitive', typeName: 'Boolean' };
      const result = fromString('false', 'nasl.core.Boolean');
      expect(result).toBe(false);
    });
  });
});
