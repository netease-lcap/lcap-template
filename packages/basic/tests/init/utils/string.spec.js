import { utils as codewaveUtils } from '@/init/utils';

describe('字符串函数', () => {
  test('PadStart', () => {
    expect(codewaveUtils.PadStart('abc', 10)).toBe('       abc');
    expect(codewaveUtils.PadStart('abc', 10, 'foo')).toBe('foofoofabc');
    expect(codewaveUtils.PadStart('abc', 6, '123465')).toBe('123abc');
    expect(codewaveUtils.PadStart('abc', 8, '0')).toBe('00000abc');
    expect(codewaveUtils.PadStart('abc', 1)).toBe('abc');
  });

  test('PadEnd', () => {
    expect(codewaveUtils.PadEnd('abc', 10)).toBe('abc       ');
    expect(codewaveUtils.PadEnd('abc', 10, 'foo')).toBe('abcfoofoof');
    expect(codewaveUtils.PadEnd('abc', 6, '123465')).toBe('abc123');
    expect(codewaveUtils.PadEnd('abc', 1)).toBe('abc');
  });

  test('TrimStart', () => {
    expect(codewaveUtils.TrimStart('   abc')).toBe('abc');
    expect(codewaveUtils.TrimStart('   abc   ')).toBe('abc   ');
    expect(codewaveUtils.TrimStart('abc   ')).toBe('abc   ');
    expect(codewaveUtils.TrimStart('    ')).toBe('');
  });

  test('TrimEnd', () => {
    expect(codewaveUtils.TrimEnd('abc   ')).toBe('abc');
    expect(codewaveUtils.TrimEnd('   abc   ')).toBe('   abc');
    expect(codewaveUtils.TrimEnd('   abc')).toBe('   abc');
    expect(codewaveUtils.TrimEnd('    ')).toBe('');
  });
});
