const paramsSerializer = require('../../src/utils/create/paramsSerializer').default;

describe('paramsSerializer', () => {
  it('should serialize params correctly', () => {
    const params = {
      name: 'John',
      age: 30,
    };
    const serialized = paramsSerializer(params);
    expect(serialized).toBe('name=John&age=30');
  });

  it('should handle empty params', () => {
    const params = {};
    const serialized = paramsSerializer(params);
    expect(serialized).toBe('');
  });

  it('should handle empty properties', () => {
    const params = {
      name: '',
      age: null,
      hobbies: undefined,
    };
    const serialized = paramsSerializer(params);
    expect(serialized).toBe('name=&age=&hobbies=');
  });
});
