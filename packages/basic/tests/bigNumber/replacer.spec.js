const JSONbig = require('../../src/utils/json-bigint');

describe('JSONbig replacer', () => {
  it('should replace undefined with null', () => {
    const obj = {
      a: 1,
      b: undefined,
      c: 'test',
    };

    const result = JSONbig.stringify(obj, (key, value) => {
      return value === undefined ? null : value;
    });

    expect(result).toBe('{"a":1,"b":null,"c":"test"}');
  });

  it('should handle undefined', () => {
    const result = JSONbig.stringify(undefined);
    expect(result).toBe(undefined);
  });

  it('should handle null', () => {
    const result = JSONbig.stringify(null);
    expect(result).toBe('null');
  });

  it('should handle empty string', () => {
    const result = JSONbig.stringify('');
    expect(result).toBe('""');
  });
});
