// 为 utils.ts 中迁移的函数创建测试
describe('Utils - Luxon migration (CurrDate, CurrTime, JsonSerialize)', () => {
  let Utils;

  beforeAll(() => {
    Utils = global.Utils;
  });

  describe('CurrDate', () => {
    test('should return current date in YYYY-MM-DD format', () => {
      const result = Utils.CurrDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('should return current date in global timezone', () => {
      const result = Utils.CurrDate('global');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('should return current date in specific timezone', () => {
      const result = Utils.CurrDate('Asia/Shanghai');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('should return current date in UTC', () => {
      const result = Utils.CurrDate('UTC');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('CurrTime', () => {
    test('should return current time in HH:mm:ss format', () => {
      const result = Utils.CurrTime();
      expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    test('should return current time in global timezone', () => {
      const result = Utils.CurrTime('global');
      expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    test('should return current time in specific timezone', () => {
      const result = Utils.CurrTime('Asia/Shanghai');
      expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('CurrDateTime', () => {
    test('should return current datetime in JSON format', () => {
      const result = Utils.CurrDateTime();
      expect(typeof result).toBe('string');
      // Should be ISO format or similar JSON-compatible format
    });

    test('should return current datetime with timezone', () => {
      const result = Utils.CurrDateTime('Asia/Shanghai');
      expect(typeof result).toBe('string');
    });
  });

  describe('JsonSerialize', () => {
    test('should serialize DateTime with UTC timezone (no tz parameter)', () => {
      const input = '2024-01-15T10:30:45.000Z';
      const result = Utils.JsonSerialize(input);
      const parsed = JSON.parse(result);
      expect(parsed).toBe('2024-01-15T10:30:45.000+00:00');
    });

    test('should serialize DateTime with explicit UTC timezone', () => {
      const input = '2024-01-15T10:30:45.000Z';
      const result = Utils.JsonSerialize(input, 'UTC');
      const parsed = JSON.parse(result);
      expect(parsed).toBe('2024-01-15T10:30:45.000+00:00');
    });

    test('should serialize DateTime with specific timezone', () => {
      const input = '2024-01-15T10:30:45.000Z';
      const result = Utils.JsonSerialize(input, 'Asia/Shanghai');
      const parsed = JSON.parse(result);
      expect(parsed).toBe('2024-01-15T18:30:45.000+08:00');
    });

    test('should serialize Date object', () => {
      const input = new Date('2024-01-15T10:30:45.000Z');
      const result = Utils.JsonSerialize(input);
      const parsed = JSON.parse(result);
      expect(parsed).toBe('2024-01-15T10:30:45.000+00:00');
    });

    test('should serialize local datetime string', () => {
      const input = '2024-01-15 12:00:00';
      const result = Utils.JsonSerialize(input);
      const parsed = JSON.parse(result);
      expect(parsed).toBe('2024-01-15T12:00:00.000+00:00');
    });

    test('should serialize pure time format', () => {
      const input = '10:30:45';
      const result = Utils.JsonSerialize(input);
      expect(JSON.parse(result)).toBe('10:30:45');
    });

    test('should serialize pure date format', () => {
      const input = '2024-01-15';
      const result = Utils.JsonSerialize(input);
      expect(JSON.parse(result)).toBe('2024-01-15');
    });

    test('should serialize other values as-is', () => {
      const input = 'some string';
      const result = Utils.JsonSerialize(input);
      expect(JSON.parse(result)).toBe('some string');
    });

    test('should serialize numbers', () => {
      const input = 12345;
      const result = Utils.JsonSerialize(input);
      expect(JSON.parse(result)).toBe(12345);
    });

    test('should serialize objects', () => {
      const input = { key: 'value' };
      const result = Utils.JsonSerialize(input);
      expect(JSON.parse(result)).toEqual({ key: 'value' });
    });
  });

  describe('GetSpecificDaysOfWeek', () => {
    test('should return DateTime format for datetime input', () => {
      const result = Utils.GetSpecificDaysOfWeek('2024-01-01T00:00:00.000Z', '2024-01-07T23:59:59.999Z', [1]);
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toBe('2024-01-01T00:00:00.000+08:00');
      }
    });

    test('should return Date format for date input', () => {
      const result = Utils.GetSpecificDaysOfWeek('2024-01-01', '2024-01-07', [1]);
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });
  });
});
