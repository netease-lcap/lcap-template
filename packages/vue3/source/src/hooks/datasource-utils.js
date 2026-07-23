import { isEqual } from 'lodash';

export function useDataSourceUtils() {
  const cache = new Map();

  function __isShallowEqualArray(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((a, idx) => {
      const b = arr2[idx];
      // 类型不同直接返回 false
      if (typeof a !== typeof b) return false;
      // null 直接比较
      if (a === null || b === null) return a === b;
      if (typeof a === 'object') {
        return isEqual(a, b);
      }
      return Object.is(a, b);
    });
  }

  function __getDataSourceCacheFn(key, deps = []) {
    if (!deps.length) {
      return cache.get(key);
    }
    for (let [cacheKey, value] of cache.entries()) {
      if (!Array.isArray(cacheKey)) continue;
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

  function __getOrCreateDataSource(key, deps = [], fn) {
    let load = __getDataSourceCacheFn(key, deps);
    if (!load) {
      load = fn;
      __setDataSourceCacheFn(key, deps, load);
    }
    return load;
  }

  return {
    __getOrCreateDataSource,
    private_data_source_cache: cache,
  };
}
