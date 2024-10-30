import { utils as codewaveUtils } from '@/init/utils';
const momentTZ = require('moment-timezone');
const moment = require('moment');



describe('当前日期时间系列函数', () => {
    test('CurrentDateTime', () => {
        // -11:00
        const aDateTime = codewaveUtils.FormatDateTime(codewaveUtils.CurrDateTime('noUse'), 'yyyy-MM-dd HH:mm:ss', 'Pacific/Midway');
        // +14:00
        const bDateTime = codewaveUtils.FormatDateTime(codewaveUtils.CurrDateTime('noUse'), 'yyyy-MM-dd HH:mm:ss', 'Pacific/Kiritimati');
        expect(codewaveUtils.DateDiff(new Date(bDateTime), new Date(aDateTime), 'h', false)).toBe(-25);
        expect(codewaveUtils.DateDiff(new Date(bDateTime), new Date(aDateTime), 'h')).toBe(25);

        const utcDate = momentTZ.tz(new Date(), 'UTC');
        const cDate = codewaveUtils.CurrDateTime('noUse');
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
        const aDate = codewaveUtils.CurrDate('Pacific/Midway');
        const a = momentTZ.tz(aDate, 'YYYY-MM-DD', 'Pacific/Midway').date();

        // +14:00
        const bDate = codewaveUtils.CurrDate('Pacific/Kiritimati');
        const b = momentTZ.tz(bDate, 'YYYY-MM-DD', 'Pacific/Kiritimati').date();

        if (b - a > 0) {
            expect([2, 1]).toContain(b - a);
        } else {
            // 跨月后是负数
            expect([-27, -28, -29, -30]).toContain(b - a);
        }

    });

    test('CurrentTime', () => {
        const nycTime = codewaveUtils.CurrTime('Etc/GMT+4');
        const a = momentTZ.tz(nycTime, 'HH:mm:ss', 'Etc/GMT+4').hours();

        const shTime = codewaveUtils.CurrTime('Asia/Shanghai');
        const b = momentTZ.tz(shTime, 'HH:mm:ss', 'Asia/Shanghai').hours();

        const utcTime = codewaveUtils.CurrTime('UTC');
        const c = momentTZ.tz(utcTime, 'HH:mm:ss', 'UTC').hours();

        expect([12, -12]).toContain(b - a);
        expect([8, -16]).toContain(b - c);
        expect([4, -20]).toContain(c - a);
    });
});
