import Decimal from 'decimal.js';

const utils = global.sdkUtils;

describe('FormatNumber 函数', () => {
  test('FormatNumber', () => {
    expect(utils.FormatNumber('1.005', 2, false, false, false, false)).toBe('1.01');
    expect(utils.FormatNumber('1.00', 2, true, false, false, false)).toBe('1');
    expect(utils.FormatNumber('1.001005', 3, true, false, false, false)).toBe('1.001');
    expect(utils.FormatNumber('1.001005', 4, true, false, false, false)).toBe('1.001');
    expect(utils.FormatNumber('1.001005', 4, false, false, false, false)).toBe('1.0010');
  });

  test('decimal js', () => {
    let d = new Decimal('10000');
    expect(d.toFixed(0).toString()).toBe('10000');
    expect(parseFloat(d) + '').toBe('10000');
  });
});
