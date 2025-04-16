const utils = global.sdkUtils;

describe('日期时间格式化函数', () => {
  const curTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (curTZ === 'Asia/Shanghai') {
    test('FormatDateTime，无时区，兼容性测试', () => {
      expect(utils.FormatDateTime(new Date('2023-09-18T01:01:56Z'), 'yyyy-MM-dd HH:mm:ss', 'user')).toBe(
        '2023-09-18 09:01:56',
      );
    });
  } else if (curTZ === 'America/New_York') {
    test('FormatDateTime，无时区，兼容性测试', () => {
      expect(utils.FormatDateTime(new Date('2023-09-18T01:01:56Z'), 'yyyy-MM-dd HH:mm:ss', 'user')).toBe(
        '2023-09-17 21:01:56',
      );
    });
  }

  test('FormatDateTime，有时区', () => {
    expect(utils.FormatDateTime(new Date('2023-09-18T01:01:56Z'), 'yyyy-MM-dd HH:mm:ss', 'Asia/Shanghai')).toBe(
      '2023-09-18 09:01:56',
    );
    expect(utils.FormatDateTime(new Date('2023-09-18T01:01:56Z'), 'yyyy-MM-dd HH:mm:ss', 'America/New_York')).toBe(
      '2023-09-17 21:01:56',
    );
  });
});
