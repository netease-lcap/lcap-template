const { genInitData, typeDefinitionMap } = require('../../../../src/init/dataTypes/tools');

describe('genInitData function - DateTime handling', () => {
  beforeAll(() => {
    // Mock typeDefinitionMap for testing
    typeDefinitionMap['nasl.core.DateTime'] = {
      typeKind: 'primitive',
      typeName: 'DateTime',
      typeNamespace: 'nasl.core',
    };
  });

  describe('DateTime initialization', () => {
    test('should handle Date object input', () => {
      const dateObj = new Date('2024-01-15T10:30:45.000Z');
      const result = genInitData('nasl.core.DateTime', dateObj);
      expect(result).toBe(dateObj);
    });

    test('should handle ISO string input', () => {
      const isoString = '2024-01-15T10:30:45.000Z';
      const result = genInitData('nasl.core.DateTime', isoString);
      expect(result).toBe(isoString);
    });

    test('should handle undefined input', () => {
      const result = genInitData('nasl.core.DateTime', undefined);
      expect(result).toBeUndefined();
    });

    test('should handle null input', () => {
      const result = genInitData('nasl.core.DateTime', null);
      expect(result).toBeNull();
    });

    test('should handle local datetime string', () => {
      const localString = '2024-01-15 10:30:45';
      const result = genInitData('nasl.core.DateTime', localString);
      expect(result).toBe(localString);
    });
  });

  describe('Edge cases', () => {
    test('should return undefined for empty string', () => {
      const result = genInitData('nasl.core.DateTime', '');
      expect(result).toBeUndefined();
    });
  });
});
