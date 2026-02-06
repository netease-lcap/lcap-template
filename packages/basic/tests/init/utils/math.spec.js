const utils = global.Utils;

describe('数学函数', () => {
  test('Ceil', () => {
    expect(utils.Ceil(2.5)).toBe(3);
    expect(utils.Ceil(-2.5)).toBe(-2);
  });

  test('Floor', () => {
    expect(utils.Floor(2.5)).toBe(2);
    expect(utils.Floor(-2.5)).toBe(-3);
  });

  test('Trunc', () => {
    expect(utils.Trunc(2.5)).toBe(2);
    expect(utils.Trunc(-2.5)).toBe(-2);
  });

  test('TruncDivide', () => {
    expect(utils.TruncDivide(5, 2)).toBe(2);
    expect(utils.TruncDivide(-5, 2)).toBe(-2);
  });
});
