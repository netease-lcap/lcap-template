import { Or } from '../../../src/init/dataTypes/utils';

describe('Or', () => {
  it('should return true if any condition is true', () => {
    const conditions = [false, true, false];
    const result = Or(...conditions);
    expect(result).toBe(true);
  });

  it('should return false if all conditions are false', () => {
    const conditions = [false, false, false];
    const result = Or(...conditions);
    expect(result).toBe(false);
  });

  it('should return false for an empty array', () => {
    const conditions = [];
    const result = Or(...conditions);
    expect(result).toBe(false);
  });

  it('should handle non-boolean values', () => {
    const conditions = [0, 'string', true];
    const result = Or(...conditions);
    expect(result).toBe(true);
  });

  it('should handle mixed types', () => {
    const conditions = [null, undefined, 1, 'true'];
    const result = Or(...conditions);
    expect(result).toBe(true);
  });
});
