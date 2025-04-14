import { utils as u } from '@/init/utils';

describe('Map 测试', () => {
  test('MapGet MapPut', () => {
    {
      const testMap = {};
      u.MapPut(testMap, 1.0, '123');
      u.MapPut(testMap, 1.0, '456');
      expect(u.Length(testMap)).toBe(1);
      expect(u.MapGet(testMap, 1)).toBe('456');
    }
  });
});
