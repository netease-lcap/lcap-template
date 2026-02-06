const utils = global.Utils;

describe('字符串函数', () => {
  test('PadStart', () => {
    expect(utils.PadStart('abc', 10)).toBe('       abc');
    expect(utils.PadStart('abc', 10, 'foo')).toBe('foofoofabc');
    expect(utils.PadStart('abc', 6, '123465')).toBe('123abc');
    expect(utils.PadStart('abc', 8, '0')).toBe('00000abc');
    expect(utils.PadStart('abc', 1)).toBe('abc');
  });

  test('PadEnd', () => {
    expect(utils.PadEnd('abc', 10)).toBe('abc       ');
    expect(utils.PadEnd('abc', 10, 'foo')).toBe('abcfoofoof');
    expect(utils.PadEnd('abc', 6, '123465')).toBe('abc123');
    expect(utils.PadEnd('abc', 1)).toBe('abc');
  });

  test('TrimStart', () => {
    expect(utils.TrimStart('   abc')).toBe('abc');
    expect(utils.TrimStart('   abc   ')).toBe('abc   ');
    expect(utils.TrimStart('abc   ')).toBe('abc   ');
    expect(utils.TrimStart('    ')).toBe('');
  });

  test('TrimEnd', () => {
    expect(utils.TrimEnd('abc   ')).toBe('abc');
    expect(utils.TrimEnd('   abc   ')).toBe('   abc');
    expect(utils.TrimEnd('   abc')).toBe('   abc');
    expect(utils.TrimEnd('    ')).toBe('');
  });
});
