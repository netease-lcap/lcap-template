const {
  isFormData,
  isArrayBuffer,
  isBuffer,
  isStream,
  isFile,
  isBlob,
  isArrayBufferView,
} = require('../../src/utils/create/utils');

describe('request utils', () => {
  it('should utils correctly', () => {
    const data = {};

    expect(isFormData(data)).toBe(false);
    expect(isArrayBuffer(data)).toBe(false);
    expect(isBuffer(data)).toBe(false);
    expect(isStream(data)).toBe(false);
    expect(isFile(data)).toBe(false);
    expect(isBlob(data)).toBe(false);
    expect(isArrayBufferView(data)).toBe(false);
  });
});
