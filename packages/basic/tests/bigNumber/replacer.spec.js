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
});
