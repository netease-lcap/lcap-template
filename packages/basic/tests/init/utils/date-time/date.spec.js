const dateFns = require('date-fns');
const {
  getWeek,
  getWeekOfMonth,
  startOfWeek,
  differenceInDays,
  format,
} = require('../../../../src/sdk/modules/utils/date');

// 列举一些边缘日期进行测试，特别是跨月、跨年、闰年等情况
const dates = [
  '2026-02-08 12:00:00',
  '2026-02-28 12:00:00',
  '2026-03-01 12:00:00',
  '2026-12-31 23:59:59',
  '2024-02-29 12:00:00', // 闰年
  '2023-01-01 00:00:00',
  '2023-12-31 23:59:59',
  '2023-01-01 00:00:00',
];

for (const datetime of dates) {
  const jsDate = new Date(datetime);
  const isoDatetime = jsDate.toJSON(); // '2026-02-05T04:00:00.000Z'
  const [date, time] = datetime.split(' ');

  describe('日期时间函数与老版本的一致性测试，输入：' + datetime, () => {
    test('getWeek', () => {
      const before = dateFns.getWeek(jsDate, { weekStartsOn: 1 });
      const after = getWeek(jsDate, { weekStartsOn: 1 });
      expect(after).toBe(before);
    });

    test('getWeekOfMonth', () => {
      const before = dateFns.getWeekOfMonth(jsDate);
      const after = getWeekOfMonth(jsDate);
      expect(after).toBe(before);
    });

    test('differenceInDays', () => {
      const before = dateFns.differenceInDays(jsDate, dateFns.startOfWeek(jsDate, { weekStartsOn: 1 }));
      const after = differenceInDays(jsDate, startOfWeek(jsDate, { weekStartsOn: 1 }));
      expect(after).toBe(before);
    });
  });
}
