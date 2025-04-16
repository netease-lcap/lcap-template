const momentTZ = require('moment-timezone');

const utils = global.sdkUtils;

describe('当前日期时间系列函数', () => {
  test.skip('CurrentDateTime', () => {
    // -11:00
    const aDateTime = utils.FormatDateTime(utils.CurrDateTime('noUse'), 'yyyy-MM-dd HH:mm:ss', 'Pacific/Midway');
    // +14:00
    const bDateTime = utils.FormatDateTime(utils.CurrDateTime('noUse'), 'yyyy-MM-dd HH:mm:ss', 'Pacific/Kiritimati');
    expect(utils.DateDiff(new Date(bDateTime), new Date(aDateTime), 'h', false)).toBe(-25);
    expect(utils.DateDiff(new Date(bDateTime), new Date(aDateTime), 'h')).toBe(25);

    const utcDate = momentTZ.tz(new Date(), 'UTC');
    const cDate = utils.CurrDateTime('noUse');
    if (utcDate.hours() > 10) {
      // 可能跨月：-30, -29, -28, -27
      expect([1, -30, -29, -28]).toContain(momentTZ.tz(cDate, 'Pacific/Kiritimati').date() - utcDate.date());
    } else {
      // 可能跨月
      expect([-1, 30, 29, 28, 27]).toContain(momentTZ.tz(cDate, 'Pacific/Midway').date() - utcDate.date());
    }
  });

  test('CurrentDate', () => {
    // - 11:00
    const aDate = utils.CurrDate('Pacific/Midway');
    const a = momentTZ.tz(aDate, 'YYYY-MM-DD', 'Pacific/Midway').date();

    // +14:00
    const bDate = utils.CurrDate('Pacific/Kiritimati');
    const b = momentTZ.tz(bDate, 'YYYY-MM-DD', 'Pacific/Kiritimati').date();

    if (b - a > 0) {
      expect([2, 1]).toContain(b - a);
    } else {
      // 跨月后是负数
      expect([-27, -28, -29, -30]).toContain(b - a);
    }
  });

  test('CurrentTime', () => {
    const nycTime = utils.CurrTime('Etc/GMT+4');
    const a = momentTZ.tz(nycTime, 'HH:mm:ss', 'Etc/GMT+4').hours();

    const shTime = utils.CurrTime('Asia/Shanghai');
    const b = momentTZ.tz(shTime, 'HH:mm:ss', 'Asia/Shanghai').hours();

    const utcTime = utils.CurrTime('UTC');
    const c = momentTZ.tz(utcTime, 'HH:mm:ss', 'UTC').hours();

    expect([12, -12]).toContain(b - a);
    expect([8, -16]).toContain(b - c);
    expect([4, -20]).toContain(c - a);
  });
});
