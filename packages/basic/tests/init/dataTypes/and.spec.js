import { And } from '../../../src/init/dataTypes/utils';

describe('And', () => {
  it('should return true if all conditions are true', () => {
    const conditions = [true, true, true];
    const result = And(...conditions);
    expect(result).toBe(true);
  });

  it('should return false if any condition is false', () => {
    const conditions = [true, false, true];
    const result = And(...conditions);
    expect(result).toBe(false);
  });

  it('should return false for an empty array', () => {
    const conditions = [];
    const result = And(...conditions);
    expect(result).toBe(false);
  });

  it('should handle non-boolean values', () => {
    const conditions = [1, 'string', true];
    const result = And(...conditions);
    expect(result).toBe(true);
  });
});
