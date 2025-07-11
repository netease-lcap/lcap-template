const private_data_source_cache = new Map();

export default (scope) => {
  let pageCahche = new Map();
  if (!private_data_source_cache.get(scope)) {
    private_data_source_cache.set(scope, pageCahche);
  } else {
    pageCahche = private_data_source_cache.get(scope);
  }

  function __isShallowEqualArray(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    return arr1.every((current, i) => {
      const other = arr2[i];
      if (typeof current !== typeof other) {
        return false;
      }
      if (typeof current === 'string') {
        return current === other;
      }
      if (typeof current === 'object') {
        return ['item', 'index', 'rowIndex', 'columnIndex', 'value'].every((key) => current[key] === other[key]);
      }
      return false;
    });
  }
  function __getDataSourceCacheFn(methodName, currentArray = []) {
    if (!currentArray.length) {
      return pageCahche.get(methodName);
    }
    for (let [key, value] of pageCahche.entries()) {
      if (__isShallowEqualArray(key, [methodName, ...currentArray])) {
        return value;
      }
    }
  }
  function __setDataSourceCacheFn(methodName, currentArray, fn) {
    currentArray = currentArray || [];
    if (!currentArray.length) {
      pageCahche.set(methodName, fn);
      return;
    }
    pageCahche.set([methodName, ...currentArray], fn);
  }
  function __getOrCreateDataSource(methodName, currentArray, newFn) {
    currentArray = currentArray || [];
    let fn = __getDataSourceCacheFn(methodName, currentArray);
    if (!fn) {
      fn = newFn;
      __setDataSourceCacheFn(methodName, currentArray, fn);
    }
    return fn;
  }

  return {
    __getOrCreateDataSource,
  };
};
