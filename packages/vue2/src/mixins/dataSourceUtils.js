export default () => ({
  data() {
    return {
      private_data_source_cache: new Map(),
    };
  },
  methods: {
    __isShallowEqualArray(arr1, arr2) {
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
    },
    __getDataSourceCacheFn(methodName, currentArray = []) {
      if (!currentArray.length) {
        return this.private_data_source_cache.get(methodName);
      }
      for (let [key, value] of this.private_data_source_cache.entries()) {
        if (this.__isShallowEqualArray(key, [methodName, ...currentArray])) {
          return value;
        }
      }
    },
    __setDataSourceCacheFn(methodName, currentArray, fn) {
      currentArray = currentArray || [];
      if (!currentArray.length) {
        this.private_data_source_cache.set(methodName, fn);
        return;
      }
      this.private_data_source_cache.set([methodName, ...currentArray], fn);
    },
    __getOrCreateDataSource(methodName, currentArray, newFn) {
      currentArray = currentArray || [];
      let fn = this.__getDataSourceCacheFn(methodName, currentArray);
      if (!fn) {
        fn = newFn;
        this.__setDataSourceCacheFn(methodName, currentArray, fn);
      }
      return fn;
    },
  },
});
