const utils = global.Utils;

describe('Split 函数', () => {
  test('Split 函数 保留末尾空串', () => {
    expect(utils.Split('', '.', true)).toEqual(['']);
    expect(utils.Split('', '', true)).toEqual([]);
    expect(utils.Split('1.', '.', true)).toEqual(['1', '']);
    expect(utils.Split('1..', '.', true)).toEqual(['1', '', '']);
    expect(utils.Split('1', '.', true)).toEqual(['1']);
  });

  test('Split 函数 舍弃末尾空串', () => {
    expect(utils.Split('', '.', false)).toEqual([]);
    expect(utils.Split('', '', false)).toEqual([]);
    expect(utils.Split('1.', '.', false)).toEqual(['1']);
    expect(utils.Split('1..', '.', false)).toEqual(['1', '']);
    expect(utils.Split('1', '.', false)).toEqual(['1']);
  });

  test('Split 换行处理', () => {
    expect(utils.Split('aaa\nbbb\nccc', '\n', false)).toEqual(['aaa', 'bbb', 'ccc']);
  });
});
