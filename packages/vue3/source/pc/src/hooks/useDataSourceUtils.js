import { ref } from 'vue';
export function useDataSourceUtils() {
  const cache = ref(new Map());

  function __isShallowEqualArray(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((current, i) => {
      const other = arr2[i];
      if (typeof current !== typeof other) return false;
      if (typeof current === 'string') return current === other;
      if (typeof current === 'object') {
        return ['item', 'index', 'rowIndex', 'columnIndex', 'value'].every((key) => current[key] === other[key]);
      }
      return false;
    });
  };

  function __getDataSourceCacheFn(methodName, currentArray = []) {
    if (!currentArray.length) {
      return cache.value.get(methodName);
    }
    for (let [key, value] of cache.value.entries()) {
      if (__isShallowEqualArray(key, [methodName, ...currentArray])) {
        return value;
      }
    }
  };

  function __setDataSourceCacheFn(methodName, currentArray = [], fn) {
    if (!currentArray.length) {
      cache.value.set(methodName, fn);
      return;
    }
    cache.value.set([methodName, ...currentArray], fn);
  };

  function __getOrCreateDataSource(methodName, currentArray = [], newFn) {
    let fn = __getDataSourceCacheFn(methodName, currentArray);
    if (!fn) {
      fn = newFn;
      __setDataSourceCacheFn(methodName, currentArray, fn);
    }
    return fn;
  };

  return {
    __getOrCreateDataSource,
    private_data_source_cache: cache.value,
  }
}
