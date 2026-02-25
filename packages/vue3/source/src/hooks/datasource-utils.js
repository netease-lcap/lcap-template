import _isEqual from 'lodash/isEqual';

export function useDataSourceUtils() {
  const cache = new Map();

  function __isShallowEqualArray(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((a, idx) => {
      const b = arr2[idx];
      if (typeof a !== typeof b) return false;
      if (typeof a === 'string') return a === b;
      if (typeof a === 'object') {
        return _isEqual(a, b);
      }
      return false;
    });
  }

  function __getDataSourceCacheFn(key, deps = []) {
    if (!deps.length) {
      return cache.get(key);
    }
    for (let [cacheKey, value] of cache.entries()) {
      if (__isShallowEqualArray(cacheKey, [key, ...deps])) {
        return value;
      }
    }
  }

  function __setDataSourceCacheFn(key, deps = [], fn) {
    if (!deps.length) {
      cache.set(key, fn);
      return;
    }
    cache.set([key, ...deps], fn);
  }

  function __getOrCreateDataSource(key, deps = [], newFn) {
    let fn = __getDataSourceCacheFn(key, deps);
    if (!fn) {
      fn = newFn;
      __setDataSourceCacheFn(key, deps, fn);
    }
    return fn;
  }

  return {
    __getOrCreateDataSource,
    private_data_source_cache: cache,
  };
}
