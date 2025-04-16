const utils = global.sdkUtils;

describe('Convert 函数', () => {
  test('Convert 函数，string 到 string', () => {});

  test('Convert 函数，string 到 Integer', () => {
    expect(utils.Convert('123.4', { typeKind: 'primitive', typeName: 'Long' })).toBe(123);
    expect(utils.Convert('1234.5', { typeKind: 'primitive', typeName: 'Long' })).toBe(1235);
  });

  test('Convert 函数，string 到 Decimal', () => {
    expect(utils.Convert('123.4', { typeKind: 'primitive', typeName: 'Decimal' })).toBe(123.4);
    expect(utils.Convert('1.01', { typeKind: 'primitive', typeName: 'Decimal' })).toBe(1.01);
  });

  test('Convert 函数，时间戳 到 DateTime', () => {
    const t = '1699952685877';

    expect(utils.Convert(t, { typeKind: 'primitive', typeName: 'DateTime' })).toBe('2023-11-14T17:04:45.877+08:00');
  });

  test('Convert 函数，时间戳 到 DateTime', () => {
    const t = 1699952685877;

    expect(utils.Convert(t, { typeKind: 'primitive', typeName: 'DateTime' })).toBe('2023-11-14T17:04:45.877+08:00');
  });

  test('Convert 函数，时间戳 到 DateTime', () => {
    const t = '2016-03-13T15:00:01.000+00:00';

    expect(utils.Convert(t, { typeKind: 'primitive', typeName: 'DateTime' })).toBe('2016-03-13T23:00:01.000+08:00');
  });

  test('Convert 函数，时间戳 到 DateTime', () => {
    const t = '2016-03-13T15:00:01.000';

    expect(utils.Convert(t, { typeKind: 'primitive', typeName: 'DateTime' })).toBe('2016-03-13T15:00:01.000+08:00');
  });

  test('Convert 函数，时间戳 到 DateTime', () => {
    const t = '2016-03-13T15:00:01+00:00';

    expect(utils.Convert(t, { typeKind: 'primitive', typeName: 'DateTime' })).toBe('2016-03-13T23:00:01.000+08:00');
  });

  test('Convert 函数，时间戳 到 DateTime', () => {
    const t = '2016-03-13T15:00:01';

    expect(utils.Convert(t, { typeKind: 'primitive', typeName: 'DateTime' })).toBe('2016-03-13T15:00:01.000+08:00');
  });

  test('Convert 函数，时间戳 到 DateTime', () => {
    const t = '2016-03-13 15:00:01';

    expect(utils.Convert(t, { typeKind: 'primitive', typeName: 'DateTime' })).toBe('2016-03-13T15:00:01.000+08:00');
  });

  //     test('Convert 函数，string 到 Date', () => {
  //         const str = '2019-09-09 11:00:00';

  //         expect(utils.Convert(str, { typeKind: 'primitive', typeName: 'Date' }))
  //             .toBe('2019-09-09');

  //         expect(utils.ToString('nasl.core.Date',
  //                 utils.Convert(str, { typeKind: 'primitive', typeName: 'Date' })))
  //             .toBe('2019-09-09');
  //     });

  //     test('Convert 函数，string 到 Time', () => {
  //         const str = '2019-09-09 11:00:00';

  //         expect(utils.Convert(str, { typeKind: 'primitive', typeName: 'Time' }))
  //             .toBe('11:00:00');

  //         expect(utils.ToString('nasl.core.Time',
  //                 utils.Convert(str, { typeKind: 'primitive', typeName: 'Time' })))
  //             .toBe('11:00:00');
  //     });
});
