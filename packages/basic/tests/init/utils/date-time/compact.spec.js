const OldBasic = require('./old-basic');

OldBasic.initDataTypes({
  dataTypesMap: {
    'nasl.core.DateTime': { typeName: 'DateTime' },
  },
});
const { utils: OldUtils } = OldBasic.initUtils({
  typeDefinitionMap: new Map(),
  enumsMap: {},
  dataTypesMap: {},

  toString: OldBasic.Tools.toString,
  fromString: OldBasic.Tools.fromString,
});

const Utils = global.Utils;

const datetime = '2026-02-05 12:00:00';
const jsDate = new Date(datetime);
const isoDatetime = jsDate.toJSON(); // '2026-02-05T04:00:00.000Z'
const [date, time] = datetime.split(' ');

describe('测试与老版本的一致性', () => {
  test('JsonSerialize', () => {
    const timezone = 'Asia/Tokyo';
    // 普通日期时间（无时区）
    const before = OldUtils.JsonSerialize(datetime);
    const after = Utils.JsonSerialize(datetime);
    expect(after).toBe(before);
    expect(after).toMatchSnapshot();

    // 普通日期时间（有时区）
    const beforeTZ = OldUtils.JsonSerialize(datetime, timezone);
    const afterTZ = Utils.JsonSerialize(datetime, timezone);
    expect(afterTZ).toBe(beforeTZ);
    expect(afterTZ).toMatchSnapshot();

    // ISO 格式日期时间（无时区）
    const beforeISO = OldUtils.JsonSerialize(isoDatetime);
    const afterISO = Utils.JsonSerialize(isoDatetime);
    expect(afterISO).toBe(beforeISO);
    expect(afterISO).toMatchSnapshot();

    // ISO 格式日期时间（有时区）
    const beforeISOTZ = OldUtils.JsonSerialize(isoDatetime, timezone);
    const afterISOTZ = Utils.JsonSerialize(isoDatetime, timezone);
    expect(afterISOTZ).toBe(beforeISOTZ);
    expect(afterISOTZ).toMatchSnapshot();

    // Date 对象
    const beforeDate = OldUtils.JsonSerialize(jsDate);
    const afterDate = Utils.JsonSerialize(jsDate);
    expect(afterDate).toBe(beforeDate);
    expect(afterDate).toMatchSnapshot();

    // Date 对象，指定时区
    const beforeDateTZ = OldUtils.JsonSerialize(jsDate, timezone);
    const afterDateTZ = Utils.JsonSerialize(jsDate, timezone);
    expect(afterDateTZ).toBe(beforeDateTZ);
    expect(afterDateTZ).toMatchSnapshot();
  });

  test('CurrDate', () => {
    // 无时区
    const before = OldUtils.CurrDate();
    const after = Utils.CurrDate();
    expect(after).toBe(before);
    expect(after).toMatchSnapshot();

    // 有时区
    const timezone = 'Asia/Tokyo';
    const beforeTZ = OldUtils.CurrDate(timezone);
    const afterTZ = Utils.CurrDate(timezone);
    expect(afterTZ).toBe(beforeTZ);
    expect(afterTZ).toMatchSnapshot();
  });

  // 可能存在先后顺序，先skip
  test.skip('CurrTime', () => {
    // 无时区
    const before = OldUtils.CurrTime();
    const after = Utils.CurrTime();
    expect(after).toBe(before);

    // 有时区
    const timezone = 'Asia/Tokyo';
    const beforeTZ = OldUtils.CurrTime(timezone);
    const afterTZ = Utils.CurrTime(timezone);
    expect(afterTZ).toBe(beforeTZ);
  });

  test('AddDays', () => {
    // dateTime 字符串
    const before = OldUtils.AddDays(datetime, 5);
    const after = Utils.AddDays(datetime, 5);
    expect(after).toBe(before);
    expect(after).toMatchSnapshot();

    // Date 对象
    const beforeDate = OldUtils.AddDays(jsDate, 5);
    const afterDate = Utils.AddDays(jsDate, 5);
    expect(afterDate).toBe(beforeDate);
    expect(afterDate).toMatchSnapshot();

    // ISO 字符串
    const beforeISO = OldUtils.AddDays(isoDatetime, 5);
    const afterISO = Utils.AddDays(isoDatetime, 5);
    expect(afterISO).toBe(beforeISO);
    expect(afterISO).toMatchSnapshot();
  });

  test('AddMonths', () => {
    // dateTime 字符串
    const before = OldUtils.AddMonths(datetime, 2);
    const after = Utils.AddMonths(datetime, 2);
    expect(after).toBe(before);
    expect(after).toMatchSnapshot();

    // Date 对象
    const beforeDate = OldUtils.AddMonths(jsDate, 2);
    const afterDate = Utils.AddMonths(jsDate, 2);
    expect(afterDate).toBe(beforeDate);
    expect(afterDate).toMatchSnapshot();

    // ISO 字符串
    const beforeISO = OldUtils.AddMonths(isoDatetime, 2);
    const afterISO = Utils.AddMonths(isoDatetime, 2);
    expect(afterISO).toBe(beforeISO);
    expect(afterISO).toMatchSnapshot();
  });

  // SubDays
  test('SubDays', () => {
    // dateTime 字符串
    const before = OldUtils.SubDays(datetime, 5);
    const after = Utils.SubDays(datetime, 5);
    expect(after).toBe(before);
    expect(after).toMatchSnapshot();

    // Date 对象
    const beforeDate = OldUtils.SubDays(jsDate, 5);
    const afterDate = Utils.SubDays(jsDate, 5);
    expect(afterDate).toBe(beforeDate);
    expect(afterDate).toMatchSnapshot();

    // ISO 字符串
    const beforeISO = OldUtils.SubDays(isoDatetime, 5);
    const afterISO = Utils.SubDays(isoDatetime, 5);
    expect(afterISO).toBe(beforeISO);
    expect(afterISO).toMatchSnapshot();
  });

  // GetDateCountOld
  test('GetDateCountOld', () => {
    const metrics = ['day-month', 'day-week', 'week-month', 'week-year', 'month-year'];
    for (const metric of metrics) {
      // dateTime 字符串
      const before = OldUtils.GetDateCountOld(datetime, metric);
      const after = Utils.GetDateCountOld(datetime, metric);
      expect(after).toBe(before);
      expect(after).toMatchSnapshot();

      // Date 对象
      const beforeDate = OldUtils.GetDateCountOld(jsDate, metric);
      const afterDate = Utils.GetDateCountOld(jsDate, metric);
      expect(afterDate).toBe(beforeDate);
      expect(afterDate).toMatchSnapshot();

      // ISO 字符串
      const beforeISO = OldUtils.GetDateCountOld(isoDatetime, metric);
      const afterISO = Utils.GetDateCountOld(isoDatetime, metric);
      expect(afterISO).toBe(beforeISO);
      expect(afterISO).toMatchSnapshot();

      const timezone = 'Asia/Tokyo';
      // dateTime 字符串，带时区
      const beforeTZ = OldUtils.GetDateCountOld(datetime, metric, timezone);
      const afterTZ = Utils.GetDateCountOld(datetime, metric, timezone);
      expect(afterTZ).toBe(beforeTZ);
      expect(afterTZ).toMatchSnapshot();

      // Date 对象，带时区
      const beforeDateTZ = OldUtils.GetDateCountOld(jsDate, metric, timezone);
      const afterDateTZ = Utils.GetDateCountOld(jsDate, metric, timezone);
      expect(afterDateTZ).toBe(beforeDateTZ);
      expect(afterDateTZ).toMatchSnapshot();

      // ISO 字符串，带时区
      const beforeISOTZ = OldUtils.GetDateCountOld(isoDatetime, metric, timezone);
      const afterISOTZ = Utils.GetDateCountOld(isoDatetime, metric, timezone);
      expect(afterISOTZ).toBe(beforeISOTZ);
      expect(afterISOTZ).toMatchSnapshot();
    }
  });

  // GetDateCount
  test('GetDateCount', () => {
    const metrics = ['day-month', 'day-week', 'week-month', 'week-year', 'month-year'];
    for (const metric of metrics) {
      // dateTime 字符串
      const before = OldUtils.GetDateCount(datetime, metric);
      const after = Utils.GetDateCount(datetime, metric);
      expect(after).toBe(before);
      expect(after).toMatchSnapshot();

      // Date 对象
      const beforeDate = OldUtils.GetDateCount(jsDate, metric);
      const afterDate = Utils.GetDateCount(jsDate, metric);
      expect(afterDate).toBe(beforeDate);
      expect(afterDate).toMatchSnapshot();

      // ISO 字符串
      const beforeISO = OldUtils.GetDateCount(isoDatetime, metric);
      const afterISO = Utils.GetDateCount(isoDatetime, metric);
      expect(afterISO).toBe(beforeISO);
      expect(afterISO).toMatchSnapshot();

      const timezone = 'Asia/Tokyo';
      // dateTime 字符串，带时区
      const beforeTZ = OldUtils.GetDateCount(datetime, metric, timezone);
      const afterTZ = Utils.GetDateCount(datetime, metric, timezone);
      expect(afterTZ).toBe(beforeTZ);
      expect(afterTZ).toMatchSnapshot();

      // Date 对象，带时区
      const beforeDateTZ = OldUtils.GetDateCount(jsDate, metric, timezone);
      const afterDateTZ = Utils.GetDateCount(jsDate, metric, timezone);
      expect(afterDateTZ).toBe(beforeDateTZ);
      expect(afterDateTZ).toMatchSnapshot();

      // ISO 字符串，带时区
      const beforeISOTZ = OldUtils.GetDateCount(isoDatetime, metric, timezone);
      const afterISOTZ = Utils.GetDateCount(isoDatetime, metric, timezone);
      expect(afterISOTZ).toBe(beforeISOTZ);
      expect(afterISOTZ).toMatchSnapshot();
    }
  });

  // AlterDateTime
  test('AlterDateTime', () => {
    const units = ['year', 'month', 'day', 'hour', 'minute', 'second'];

    for (const unit of units) {
      // dateTime 字符串
      const before = OldUtils.AlterDateTime(datetime, 'Increase', 3, unit);
      const after = Utils.AlterDateTime(datetime, 'Increase', 3, unit);
      expect(after).toBe(before);
      expect(after).toMatchSnapshot();

      // Date 对象
      const beforeDate = OldUtils.AlterDateTime(jsDate, 'Increase', 3, unit);
      const afterDate = Utils.AlterDateTime(jsDate, 'Increase', 3, unit);
      expect(afterDate).toBe(beforeDate);
      expect(afterDate).toMatchSnapshot();

      // ISO 字符串
      const beforeISO = OldUtils.AlterDateTime(isoDatetime, 'Increase', 3, unit);
      const afterISO = Utils.AlterDateTime(isoDatetime, 'Increase', 3, unit);
      expect(afterISO).toBe(beforeISO);
      expect(afterISO).toMatchSnapshot();
    }
  });

  // GetSpecificDaysOfWeek
  test('GetSpecificDaysOfWeek', () => {
    const daysOfWeek = [1, 3, 5]; // 周一、周三、周五
    const datetime2 = '2026-02-15 12:00:00';
    const jsDate2 = new Date(datetime2);
    const isoDatetime2 = jsDate2.toJSON();

    const timezone = 'Asia/Tokyo';

    // dateTime 字符串
    const before = OldUtils.GetSpecificDaysOfWeek(datetime, datetime2, daysOfWeek);
    const after = Utils.GetSpecificDaysOfWeek(datetime, datetime2, daysOfWeek);
    expect(after).toEqual(before);
    expect(after).toMatchSnapshot();

    // dateTime 字符串，带时区
    const beforeTZ = OldUtils.GetSpecificDaysOfWeek(datetime, datetime2, daysOfWeek, timezone);
    const afterTZ = Utils.GetSpecificDaysOfWeek(datetime, datetime2, daysOfWeek, timezone);
    expect(afterTZ).toEqual(beforeTZ);
    expect(afterTZ).toMatchSnapshot();

    // Date 对象
    const beforeDate = OldUtils.GetSpecificDaysOfWeek(jsDate, jsDate2, daysOfWeek);
    const afterDate = Utils.GetSpecificDaysOfWeek(jsDate, jsDate2, daysOfWeek);
    expect(afterDate).toEqual(beforeDate);
    expect(afterDate).toMatchSnapshot();

    // Date 对象，带时区
    const beforeDateTZ = OldUtils.GetSpecificDaysOfWeek(jsDate, jsDate2, daysOfWeek, timezone);
    const afterDateTZ = Utils.GetSpecificDaysOfWeek(jsDate, jsDate2, daysOfWeek, timezone);
    expect(afterDateTZ).toEqual(beforeDateTZ);
    expect(afterDateTZ).toMatchSnapshot();

    // ISO 字符串
    const beforeISO = OldUtils.GetSpecificDaysOfWeek(isoDatetime, isoDatetime2, daysOfWeek);
    const afterISO = Utils.GetSpecificDaysOfWeek(isoDatetime, isoDatetime2, daysOfWeek);
    expect(afterISO).toEqual(beforeISO);
    expect(afterISO).toMatchSnapshot();

    // ISO 字符串，带时区
    const beforeISOTZ = OldUtils.GetSpecificDaysOfWeek(isoDatetime, isoDatetime2, daysOfWeek, timezone);
    const afterISOTZ = Utils.GetSpecificDaysOfWeek(isoDatetime, isoDatetime2, daysOfWeek, timezone);
    expect(afterISOTZ).toEqual(beforeISOTZ);
    expect(afterISOTZ).toMatchSnapshot();
  });

  // FormatDate
  test('FormatDate', () => {
    const formatters = ['YYYY-MM-dd', 'dd/MM/YYYY', 'MM-dd-YYYY', 'yyyyMMdd'];

    for (const format of formatters) {
      // dateTime 字符串
      const before = OldUtils.FormatDate(datetime, format);
      const after = Utils.FormatDate(datetime, format);
      expect(after).toBe(before);
      expect(after).toMatchSnapshot();

      // Date 对象
      const beforeDate = OldUtils.FormatDate(jsDate, format);
      const afterDate = Utils.FormatDate(jsDate, format);
      expect(afterDate).toBe(beforeDate);
      expect(afterDate).toMatchSnapshot();

      // ISO 字符串
      const beforeISO = OldUtils.FormatDate(isoDatetime, format);
      const afterISO = Utils.FormatDate(isoDatetime, format);
      expect(afterISO).toBe(beforeISO);
      expect(afterISO).toMatchSnapshot();
    }
  });

  // FormatTime
  test('FormatTime', () => {
    const formatters = ['HH:mm:ss', 'hh:mm', 'HHmmss'];

    for (const format of formatters) {
      // time 字符串
      const before = OldUtils.FormatTime(time, format);
      const after = Utils.FormatTime(time, format);
      expect(after).toBe(before);
      expect(after).toMatchSnapshot();
    }
  });

  // FormatDateTime
  test('FormatDateTime', () => {
    const formatters = ['YYYY-MM-dd HH:mm:ss', `yyyy-MM-dd'T'HH:mm:ss.SSSxxx`];
    for (const format of formatters) {
      // dateTime 字符串
      const before = OldUtils.FormatDateTime(datetime, format);
      const after = Utils.FormatDateTime(datetime, format);
      expect(after).toBe(before);
      expect(after).toMatchSnapshot();

      // Date 对象
      const beforeDate = OldUtils.FormatDateTime(jsDate, format);
      const afterDate = Utils.FormatDateTime(jsDate, format);
      expect(afterDate).toBe(beforeDate);
      expect(afterDate).toMatchSnapshot();

      // ISO 字符串
      const beforeISO = OldUtils.FormatDateTime(isoDatetime, format);
      const afterISO = Utils.FormatDateTime(isoDatetime, format);
      expect(afterISO).toBe(beforeISO);
      expect(afterISO).toMatchSnapshot();
    }
  });

  // DateDiff
  test('DateDiff', () => {
    const calcTypes = ['y', 'q', 'M', 'w', 'd', 'h'];

    for (const calcType of calcTypes) {
      const datetime2 = '2026-02-10 12:00:00';
      const jsDate2 = new Date(datetime2);
      const isoDatetime2 = jsDate2.toJSON();

      // dateTime 字符串
      const before = OldUtils.DateDiff(datetime, datetime2, calcType);
      const after = Utils.DateDiff(datetime, datetime2, calcType);
      expect(after).toBe(before);
      expect(after).toMatchSnapshot();

      // Date 对象
      const beforeDate = OldUtils.DateDiff(jsDate, jsDate2, calcType);
      const afterDate = Utils.DateDiff(jsDate, jsDate2, calcType);
      expect(afterDate).toBe(beforeDate);
      expect(afterDate).toMatchSnapshot();

      // ISO 字符串
      const beforeISO = OldUtils.DateDiff(isoDatetime, isoDatetime2, calcType);
      const afterISO = Utils.DateDiff(isoDatetime, isoDatetime2, calcType);
      expect(afterISO).toBe(beforeISO);
      expect(afterISO).toMatchSnapshot();
    }
  });

  // ToString
  test('ToString', () => {
    const typeKey = 'nasl.core.DateTime';
    // dateTime 字符串
    const before = OldUtils.ToString(typeKey, datetime);
    const after = Utils.ToString(typeKey, datetime);
    expect(after).toBe(before);
    expect(after).toMatchSnapshot();

    // dateTime 字符串，带时区
    const timezone = 'Asia/Tokyo';
    const beforeTZ = OldUtils.ToString(typeKey, datetime, timezone);
    const afterTZ = Utils.ToString(typeKey, datetime, timezone);
    expect(afterTZ).toBe(beforeTZ);
    expect(afterTZ).toMatchSnapshot();

    // Date 对象
    const beforeDate = OldUtils.ToString(typeKey, jsDate);
    const afterDate = Utils.ToString(typeKey, jsDate);
    expect(afterDate).toBe(beforeDate);
    expect(afterDate).toMatchSnapshot();

    // Date 对象，带时区
    const beforeDateTZ = OldUtils.ToString(typeKey, jsDate, timezone);
    const afterDateTZ = Utils.ToString(typeKey, jsDate, timezone);
    expect(afterDateTZ).toBe(beforeDateTZ);
    expect(afterDateTZ).toMatchSnapshot();

    // ISO 字符串
    const beforeISO = OldUtils.ToString(typeKey, isoDatetime);
    const afterISO = Utils.ToString(typeKey, isoDatetime);
    expect(afterISO).toBe(beforeISO);
    expect(afterISO).toMatchSnapshot();

    // ISO 字符串，带时区
    const beforeISOTZ = OldUtils.ToString(typeKey, isoDatetime, timezone);
    const afterISOTZ = Utils.ToString(typeKey, isoDatetime, timezone);
    expect(afterISOTZ).toBe(beforeISOTZ);
    expect(afterISOTZ).toMatchSnapshot();
  });

  // FromString
  test('FromString', () => {
    const typeKey = 'nasl.core.DateTime';
    // dateTime 字符串
    const before = OldUtils.FromString(datetime, typeKey);
    const after = Utils.FromString(datetime, typeKey);
    expect(after).toBe(before);
    expect(after).toMatchSnapshot();

    // Date 对象
    const beforeDate = OldUtils.FromString(jsDate, typeKey);
    const afterDate = Utils.FromString(jsDate, typeKey);
    expect(afterDate).toBe(beforeDate);
    expect(afterDate).toMatchSnapshot();

    // ISO 字符串
    const beforeISO = OldUtils.FromString(isoDatetime, typeKey);
    const afterISO = Utils.FromString(isoDatetime, typeKey);
    expect(afterISO).toBe(beforeISO);
    expect(afterISO).toMatchSnapshot();
  });

  // genInitData
  test.skip('genInitData', () => {});
});
