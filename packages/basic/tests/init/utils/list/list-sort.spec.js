const utils = global.sdkUtils;

const ascCallback = [
  (item) => {
    return { by: item, asc: true };
  },
];

const descCallback = [
  (item) => {
    return { by: item, asc: false };
  },
];

const multiCallback = [...ascCallback, ...descCallback];

describe('ListSort functions', () => {
  const testNumberArr = [-1, -1, 0, -5, 2, 3];
  const ascNumberArr = [-5, -1, -1, 0, 2, 3];
  const descNumberArr = [3, 2, 0, -1, -1, -5];
  test('List sort integers', () => {
    // 测试点 1，升序
    {
      const sortedArr = utils.ListSort(testNumberArr, ...ascCallback);
      expect(JSON.stringify(ascNumberArr)).toEqual(JSON.stringify(sortedArr));
    }
    // 测试点 2，降序
    {
      const sortedArr = utils.ListSort(testNumberArr, ...descCallback);
      expect(JSON.stringify(descNumberArr)).toEqual(JSON.stringify(sortedArr));
    }
    // 测试点 3，先升序，再降序
    {
      const sortedArr = utils.ListSort(testNumberArr, ...multiCallback);
      expect(JSON.stringify(descNumberArr)).toEqual(JSON.stringify(sortedArr));
    }
  });

  const testStringArr = ['a', 'aaa', 'aaaa', 'aaaaaa', 'aaaaaaaaa', 'aaaaaaaaaaaa'];
  const ascStringArr = ['a', 'aaa', 'aaaa', 'aaaaaa', 'aaaaaaaaa', 'aaaaaaaaaaaa'];
  const descStringArr = ['aaaaaaaaaaaa', 'aaaaaaaaa', 'aaaaaa', 'aaaa', 'aaa', 'a'];
  test('List sort strings', () => {
    // 测试点 1，升序
    {
      const sortedArr = utils.ListSort(testStringArr, ...ascCallback);
      expect(JSON.stringify(ascStringArr)).toEqual(JSON.stringify(sortedArr));
    }
    // 测试点 2，降序
    {
      const sortedArr = utils.ListSort(testStringArr, ...descCallback);
      expect(JSON.stringify(descStringArr)).toEqual(JSON.stringify(sortedArr));
    }
    // 测试点 3，先升序，再降序
    {
      const sortedArr = utils.ListSort(testStringArr, ...multiCallback);
      expect(JSON.stringify(descStringArr)).toEqual(JSON.stringify(sortedArr));
    }
  });

  const testPropertyArr = [
    {
      name: 'a',
      boolean: true,
      number: 1,
      decimal: 1.1,
      date: '2024-01-01',
      time: '00:00:00',
      dateTime: '2024-01-01 00:00:00',
      nullProperty: null,
      property9: null,
      property10: [],
      property11: {},
    },
    {
      name: 'aaa',
      boolean: true,
      number: 3,
      decimal: 1.3,
      date: '2024-01-03',
      time: '00:03:00',
      dateTime: '2024-01-03 00:00:00',
      nullProperty: null,
      property9: null,
      property10: [],
      property11: {},
    },
    {
      name: 'aa',
      boolean: false,
      number: 2,
      decimal: 1.2,
      date: '2024-01-02',
      time: '00:02:00',
      dateTime: '2024-01-02 00:00:00',
      nullProperty: null,
      property9: null,
      property10: [],
      property11: {},
    },
    {
      name: 'aaaaaaa',
      boolean: false,
      number: 6,
      decimal: 1.6,
      date: '2024-01-06',
      time: '00:06:00',
      dateTime: '2024-01-06 00:00:00',
      nullProperty: null,
      property9: null,
      property10: [],
      property11: {},
    },
    {
      name: 'aaaa',
      boolean: false,
      number: 4,
      decimal: 1.4,
      date: '2024-01-04',
      time: '00:04:00',
      dateTime: '2024-01-04 00:00:00',
      nullProperty: null,
      property9: null,
      property10: [],
      property11: {},
    },
    {
      name: 'aaaaa',
      boolean: true,
      number: 5,
      decimal: 1.5,
      date: '2024-01-05',
      time: '00:05:00',
      dateTime: '2024-01-05 00:00:00',
      nullProperty: null,
      property9: null,
      property10: [],
      property11: {},
    },
  ];

  const ascPropertyArr =
    '[{"name":"a","boolean":true,"number":1,"decimal":1.1,"date":"2024-01-01","time":"00:00:00","dateTime":"2024-01-01 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"aa","boolean":false,"number":2,"decimal":1.2,"date":"2024-01-02","time":"00:02:00","dateTime":"2024-01-02 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"aaa","boolean":true,"number":3,"decimal":1.3,"date":"2024-01-03","time":"00:03:00","dateTime":"2024-01-03 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"aaaa","boolean":false,"number":4,"decimal":1.4,"date":"2024-01-04","time":"00:04:00","dateTime":"2024-01-04 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"aaaaa","boolean":true,"number":5,"decimal":1.5,"date":"2024-01-05","time":"00:05:00","dateTime":"2024-01-05 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"aaaaaaa","boolean":false,"number":6,"decimal":1.6,"date":"2024-01-06","time":"00:06:00","dateTime":"2024-01-06 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}}]';

  const descPropertyArr =
    '[{"name":"aaaaaaa","boolean":false,"number":6,"decimal":1.6,"date":"2024-01-06","time":"00:06:00","dateTime":"2024-01-06 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"aaaaa","boolean":true,"number":5,"decimal":1.5,"date":"2024-01-05","time":"00:05:00","dateTime":"2024-01-05 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"aaaa","boolean":false,"number":4,"decimal":1.4,"date":"2024-01-04","time":"00:04:00","dateTime":"2024-01-04 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"aaa","boolean":true,"number":3,"decimal":1.3,"date":"2024-01-03","time":"00:03:00","dateTime":"2024-01-03 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"aa","boolean":false,"number":2,"decimal":1.2,"date":"2024-01-02","time":"00:02:00","dateTime":"2024-01-02 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"a","boolean":true,"number":1,"decimal":1.1,"date":"2024-01-01","time":"00:00:00","dateTime":"2024-01-01 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}}]';

  // 对象内单属性排序
  test.each([
    ['name', 'asc', ascPropertyArr],
    ['name', 'desc', descPropertyArr],
    ['number', 'asc', ascPropertyArr],
    ['number', 'desc', descPropertyArr],
    ['decimal', 'asc', ascPropertyArr],
    ['decimal', 'desc', descPropertyArr],
    ['date', 'asc', ascPropertyArr],
    ['date', 'desc', descPropertyArr],
    ['time', 'asc', ascPropertyArr],
    ['time', 'desc', descPropertyArr],
    ['dateTime', 'asc', ascPropertyArr],
    ['dateTime', 'desc', descPropertyArr],
    [
      'boolean',
      'asc',
      '[{"name":"aaaaaaa","boolean":false,"number":6,"decimal":1.6,"date":"2024-01-06","time":"00:06:00","dateTime":"2024-01-06 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"aaaa","boolean":false,"number":4,"decimal":1.4,"date":"2024-01-04","time":"00:04:00","dateTime":"2024-01-04 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"aa","boolean":false,"number":2,"decimal":1.2,"date":"2024-01-02","time":"00:02:00","dateTime":"2024-01-02 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"aaaaa","boolean":true,"number":5,"decimal":1.5,"date":"2024-01-05","time":"00:05:00","dateTime":"2024-01-05 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"aaa","boolean":true,"number":3,"decimal":1.3,"date":"2024-01-03","time":"00:03:00","dateTime":"2024-01-03 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"a","boolean":true,"number":1,"decimal":1.1,"date":"2024-01-01","time":"00:00:00","dateTime":"2024-01-01 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}}]',
    ],
    [
      'boolean',
      'desc',
      '[{"name":"aaaaa","boolean":true,"number":5,"decimal":1.5,"date":"2024-01-05","time":"00:05:00","dateTime":"2024-01-05 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"aaa","boolean":true,"number":3,"decimal":1.3,"date":"2024-01-03","time":"00:03:00","dateTime":"2024-01-03 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"a","boolean":true,"number":1,"decimal":1.1,"date":"2024-01-01","time":"00:00:00","dateTime":"2024-01-01 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"aaaaaaa","boolean":false,"number":6,"decimal":1.6,"date":"2024-01-06","time":"00:06:00","dateTime":"2024-01-06 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"aaaa","boolean":false,"number":4,"decimal":1.4,"date":"2024-01-04","time":"00:04:00","dateTime":"2024-01-04 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}},{"name":"aa","boolean":false,"number":2,"decimal":1.2,"date":"2024-01-02","time":"00:02:00","dateTime":"2024-01-02 00:00:00","nullProperty":null,"property9":null,"property10":[],"property11":{}}]',
    ],
  ])('List sort single Property with %s in %s order', (property, order, expectedArr) => {
    const callback = [
      (item) => {
        return { by: item?.[property], asc: order === 'asc' };
      },
    ];
    const sortedArr = utils.ListSort(testPropertyArr, ...callback);
    expect(expectedArr).toEqual(JSON.stringify(sortedArr));
  });

  // 对象内多属性排序
  const testMultiProperty = [
    {
      property1: 'B',
      property2: true,
      property3: 2,
      property4: 2.2,
      property5: '2024-02-02',
      property6: '00:00:00',
      property7: '2024-01-01 00:00:00',
      property8: null,
      property9: null,
      property10: [],
      property11: {},
    },
    {
      property1: 'A',
      property2: true,
      property3: 1,
      property4: 1.1,
      property5: '2024-01-03',
      property6: '00:03:00',
      property7: '2024-01-03 00:00:00',
      property8: null,
      property9: null,
      property10: [],
      property11: {},
    },
    {
      property1: 'B',
      property2: false,
      property3: 2,
      property4: 2.1,
      property5: '2024-01-02',
      property6: '00:02:00',
      property7: '2024-01-02 00:00:00',
      property8: null,
      property9: null,
      property10: [],
      property11: {},
    },
    {
      property1: 'F',
      property2: false,
      property3: 2,
      property4: 2.3,
      property5: '2024-01-06',
      property6: '00:06:00',
      property7: '2024-01-06 00:00:00',
      property8: null,
      property9: null,
      property10: [],
      property11: {},
    },
    {
      property1: 'D',
      property2: false,
      property3: 2,
      property4: 2.2,
      property5: '2024-02-01',
      property6: '00:04:00',
      property7: '2024-01-04 00:00:00',
      property8: null,
      property9: null,
      property10: [],
      property11: {},
    },
    {
      property1: 'E',
      property2: true,
      property3: 5,
      property4: 1.5,
      property5: '2024-01-05',
      property6: '00:05:00',
      property7: '2024-01-05 00:00:00',
      property8: null,
      property9: null,
      property10: [],
      property11: {},
    },
    {
      property1: 'D',
      property2: false,
      property3: 2,
      property4: 2.2,
      property5: '2024-01-01',
      property6: '00:04:00',
      property7: '2024-01-04 00:00:00',
      property8: null,
      property9: null,
      property10: [],
      property11: {},
    },
    {
      property1: 'D',
      property2: false,
      property3: 2,
      property4: 2.2,
      property5: '2024-04-01',
      property6: '00:04:00',
      property7: '2024-01-04 00:00:00',
      property8: null,
      property9: null,
      property10: [],
      property11: {},
    },
    {
      property1: 'D',
      property2: false,
      property3: 2,
      property4: 2.2,
      property5: '2024-04-01',
      property6: '00:04:00',
      property7: '2024-01-04 00:00:00',
      property8: null,
      property9: null,
      property10: [],
      property11: {},
    },
    {
      property1: 'D',
      property2: false,
      property3: 2,
      property4: 2.2,
      property5: '2024-04-01',
      property6: '00:04:00',
      property7: '2024-01-04 00:00:00',
      property8: null,
      property9: null,
      property10: [],
      property11: {},
    },
  ];
  const ascStructureListMultiExpect1 =
    '[{"property1":"A","property2":true,"property3":1,"property4":1.1,"property5":"2024-01-03","property6":"00:03:00","property7":"2024-01-03 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"B","property2":false,"property3":2,"property4":2.1,"property5":"2024-01-02","property6":"00:02:00","property7":"2024-01-02 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"D","property2":false,"property3":2,"property4":2.2,"property5":"2024-01-01","property6":"00:04:00","property7":"2024-01-04 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"D","property2":false,"property3":2,"property4":2.2,"property5":"2024-02-01","property6":"00:04:00","property7":"2024-01-04 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"B","property2":true,"property3":2,"property4":2.2,"property5":"2024-02-02","property6":"00:00:00","property7":"2024-01-01 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"D","property2":false,"property3":2,"property4":2.2,"property5":"2024-04-01","property6":"00:04:00","property7":"2024-01-04 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"D","property2":false,"property3":2,"property4":2.2,"property5":"2024-04-01","property6":"00:04:00","property7":"2024-01-04 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"D","property2":false,"property3":2,"property4":2.2,"property5":"2024-04-01","property6":"00:04:00","property7":"2024-01-04 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"F","property2":false,"property3":2,"property4":2.3,"property5":"2024-01-06","property6":"00:06:00","property7":"2024-01-06 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"E","property2":true,"property3":5,"property4":1.5,"property5":"2024-01-05","property6":"00:05:00","property7":"2024-01-05 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}}]';
  const ascStructureListMultiExpect2 =
    '[{"property1":"A","property2":true,"property3":1,"property4":1.1,"property5":"2024-01-03","property6":"00:03:00","property7":"2024-01-03 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"F","property2":false,"property3":2,"property4":2.3,"property5":"2024-01-06","property6":"00:06:00","property7":"2024-01-06 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"D","property2":false,"property3":2,"property4":2.2,"property5":"2024-01-01","property6":"00:04:00","property7":"2024-01-04 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"D","property2":false,"property3":2,"property4":2.2,"property5":"2024-02-01","property6":"00:04:00","property7":"2024-01-04 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"B","property2":true,"property3":2,"property4":2.2,"property5":"2024-02-02","property6":"00:00:00","property7":"2024-01-01 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"D","property2":false,"property3":2,"property4":2.2,"property5":"2024-04-01","property6":"00:04:00","property7":"2024-01-04 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"D","property2":false,"property3":2,"property4":2.2,"property5":"2024-04-01","property6":"00:04:00","property7":"2024-01-04 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"D","property2":false,"property3":2,"property4":2.2,"property5":"2024-04-01","property6":"00:04:00","property7":"2024-01-04 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"B","property2":false,"property3":2,"property4":2.1,"property5":"2024-01-02","property6":"00:02:00","property7":"2024-01-02 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}},{"property1":"E","property2":true,"property3":5,"property4":1.5,"property5":"2024-01-05","property6":"00:05:00","property7":"2024-01-05 00:00:00","property8":null,"property9":null,"property10":[],"property11":{}}]';

  // 整数、小数、日期参与排序
  test.each([
    ['property3', 'asc', 'property4', 'asc', 'property5', 'asc', ascStructureListMultiExpect1],
    ['property3', 'asc', 'property4', 'desc', 'property5', 'asc', ascStructureListMultiExpect2],
  ])(
    'List sort multiple Properties with %s in %s order, %s in %s order, %s in %s order',
    (property1, order1, property2, order2, property3, order3, expectedArr) => {
      const callback = [
        (item) => {
          return { by: item?.[property1], asc: order1 === 'asc' };
        },
        (item) => {
          return { by: item?.[property2], asc: order2 === 'asc' };
        },
        (item) => {
          return { by: item?.[property3], asc: order3 === 'asc' };
        },
      ];
      const sortedArr = utils.ListSort(testMultiProperty, ...callback);
      expect(expectedArr).toEqual(JSON.stringify(sortedArr));
    },
  );
});

describe('ListSortAsync functions', () => {
  const testNumberArr = [-1, -1, 0, -5, 2, 3];
  const ascNumberArr = [-5, -1, -1, 0, 2, 3];
  const descNumberArr = [3, 2, 0, -1, -1, -5];

  const ascCallback = [
    async (item) => {
      return { by: item, asc: true };
    },
  ];

  const descCallback = [
    async (item) => {
      return { by: item, asc: false };
    },
  ];

  const multiCallback = [...ascCallback, ...descCallback];

  test('List sort integers', async () => {
    // 测试点 1，升序
    {
      const sortedArr = await utils.ListSortAsync(testNumberArr, ...ascCallback);
      expect(JSON.stringify(ascNumberArr)).toEqual(JSON.stringify(sortedArr));
    }
    // 测试点 2，降序
    {
      const sortedArr = await utils.ListSortAsync(testNumberArr, ...descCallback);
      expect(JSON.stringify(descNumberArr)).toEqual(JSON.stringify(sortedArr));
    }
    // 测试点 3，先升序，再降序
    {
      const sortedArr = await utils.ListSortAsync(testNumberArr, ...multiCallback);
      expect(JSON.stringify(descNumberArr)).toEqual(JSON.stringify(sortedArr));
    }
  });
});
