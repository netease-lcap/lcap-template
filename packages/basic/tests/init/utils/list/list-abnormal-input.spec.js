const utils = global.sdkUtils;

describe('测试所有列表函数的边界输入场景', () => {
  const fns = [
    utils.Concat,
    utils.Join,
    utils.Length,
    utils.Get,
    utils.Set,
    utils.Contains,
    utils.Add,
    utils.AddAll,
    utils.Insert,
    utils.Remove,
    utils.RemoveAt,
    utils.ListAverage,
    utils.ListDistinct,
    utils.ListDistinctBy,
    utils.ListFilter,
    utils.ListFind,
    utils.ListFindIndex,
    utils.ListFlatten,
    utils.ListGroupBy,
    utils.ListHead,
    utils.ListLast,
    utils.ListMax,
    utils.ListMin,
    utils.ListProduct,
    utils.ListReverse,
    utils.ListSlice,
    utils.ListSliceToPageOf,
    utils.ListSort,
    utils.ListSum,
    utils.ListToMap,
    utils.ListTransform,
  ];

  test('测试 undefined 和 null 输入', () => {
    fns.forEach((fn) => {
      try {
        expect(fn(undefined)).toBeNull;
      } catch (err) {
        expect(() => fn(undefined)).toThrow;
      }
    });

    fns.forEach((fn) => {
      try {
        expect(fn(null)).toBeNull;
      } catch (err) {
        expect(() => fn(null)).toThrow;
      }
    });
  });

  test('测试空数组输入', () => {
    fns.forEach((fn) => {
      try {
        expect(fn([])).toBeNull;
      } catch (err) {
        expect(() => fn([])).toThrow;
      }
    });
  });

  test('测试空数组+lambda的输入', () => {
    expect(JSON.stringify(utils.ListGroupBy([], (item) => item))).toBe('{}');
  });

  test('测试无效数组元素', () => {
    let __fns = fns.filter((fn) => fn !== utils.ListDistinctBy && fn !== utils.ListTransform);
    __fns.forEach((fn) => {
      try {
        expect(fn([undefined, null, null])).toBeNull;
      } catch (err) {
        expect(() => fn([undefined, null, null])).toThrow();
      }
    });
  });
});
