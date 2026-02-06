const utils = global.Utils;

describe('反序列化函数', () => {
  test('JSON 反序列化兼容性测试，空值', () => {
    expect(utils.JsonDeserialize('')).toBe(undefined);
    expect(utils.JsonDeserialize(null)).toBe(null);
    expect(utils.JsonDeserialize(undefined)).toBe(undefined);
  });
});
