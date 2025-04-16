const utils = global.sdkUtils;

describe('Map 测试', () => {
  test('MapGet MapPut', () => {
    {
      const testMap = {};
      utils.MapPut(testMap, 1.0, '123');
      utils.MapPut(testMap, 1.0, '456');
      expect(utils.Length(testMap)).toBe(1);
      expect(utils.MapGet(testMap, 1)).toBe('456');
    }
  });
});
