import _isEqual from 'lodash/isEqual';

export function useDataSourceUtils() {
  const cache = new Map();

  function __isShallowEqualArray(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((current, i) => {
      const other = arr2[i];
      if (typeof current !== typeof other) return false;
      if (typeof current === 'string') return current === other;
      if (typeof current === 'object') {
        return _isEqual(current, other);
      }
      return false;
    });
  }

  function __getDataSourceCacheFn(methodName, currentArray = []) {
    if (!currentArray.length) {
      return cache.get(methodName);
    }
    for (let [key, value] of cache.entries()) {
      if (__isShallowEqualArray(key, [methodName, ...currentArray])) {
        return value;
      }
    }
  }

  function __setDataSourceCacheFn(methodName, currentArray = [], fn) {
    if (!currentArray.length) {
      cache.set(methodName, fn);
      return;
    }
    cache.set([methodName, ...currentArray], fn);
  }

  function __getOrCreateDataSource(methodName, currentArray = [], newFn) {
    let fn = __getDataSourceCacheFn(methodName, currentArray);
    if (!fn) {
      fn = newFn;
      __setDataSourceCacheFn(methodName, currentArray, fn);
    }
    return fn;
  }

  return {
    __getOrCreateDataSource,
    private_data_source_cache: cache,
  };
}
