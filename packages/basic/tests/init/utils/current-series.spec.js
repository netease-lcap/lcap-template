const { DateTime } = require('luxon');

const utils = global.sdkUtils;

describe('当前日期时间系列函数', () => {
  test.skip('CurrentDateTime', () => {
    // -11:00
    const aDateTime = utils.FormatDateTime(utils.CurrDateTime('noUse'), 'yyyy-MM-dd HH:mm:ss', 'Pacific/Midway');
    // +14:00
    const bDateTime = utils.FormatDateTime(utils.CurrDateTime('noUse'), 'yyyy-MM-dd HH:mm:ss', 'Pacific/Kiritimati');
    expect(utils.DateDiff(new Date(bDateTime), new Date(aDateTime), 'h', false)).toBe(-25);
    expect(utils.DateDiff(new Date(bDateTime), new Date(aDateTime), 'h')).toBe(25);

    const utcDate = DateTime.now().setZone('UTC');
    const cDate = utils.CurrDateTime('noUse');
    if (utcDate.hour > 10) {
      // 可能跨月：-30, -29, -28, -27
      expect([1, -30, -29, -28]).toContain(DateTime.fromISO(cDate).setZone('Pacific/Kiritimati').day - utcDate.day);
    } else {
      // 可能跨月
      expect([-1, 30, 29, 28, 27]).toContain(DateTime.fromISO(cDate).setZone('Pacific/Midway').day - utcDate.day);
    }
  });

  test('CurrentDate', () => {
    // - 11:00
    const aDate = utils.CurrDate('Pacific/Midway');
    const a = DateTime.fromFormat(aDate, 'yyyy-MM-dd', { zone: 'Pacific/Midway' }).day;

    // +14:00
    const bDate = utils.CurrDate('Pacific/Kiritimati');
    const b = DateTime.fromFormat(bDate, 'yyyy-MM-dd', { zone: 'Pacific/Kiritimati' }).day;

    if (b - a > 0) {
      expect([2, 1]).toContain(b - a);
    } else {
      // 跨月后是负数
      expect([-27, -28, -29, -30]).toContain(b - a);
    }
  });

  test('CurrentTime', () => {
    const nycTime = utils.CurrTime('Etc/GMT+4');
    const a = DateTime.fromFormat(nycTime, 'HH:mm:ss', { zone: 'Etc/GMT+4' }).hour;

    const shTime = utils.CurrTime('Asia/Shanghai');
    const b = DateTime.fromFormat(shTime, 'HH:mm:ss', { zone: 'Asia/Shanghai' }).hour;

    const utcTime = utils.CurrTime('UTC');
    const c = DateTime.fromFormat(utcTime, 'HH:mm:ss', { zone: 'UTC' }).hour;

    expect([12, -12]).toContain(b - a);
    expect([8, -16]).toContain(b - c);
    expect([4, -20]).toContain(c - a);
  });
});
