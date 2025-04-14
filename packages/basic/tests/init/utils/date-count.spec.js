import { utils as codewaveUtils } from '@/init/utils';

describe('日期时间计数函数', () => {
  test('给皇上修历法咯 新历法', () => {
    expect(codewaveUtils.GetDateCount('2024-06-01', 'week-month')).toBe(1);
    expect(codewaveUtils.GetDateCount('2024-06-02', 'week-month')).toBe(1);
    expect(codewaveUtils.GetDateCount('2024-06-03', 'week-month')).toBe(2);
    expect(codewaveUtils.GetDateCount('2024-06-24', 'week-month')).toBe(5);
    expect(codewaveUtils.GetDateCount('2024-06-30', 'week-month')).toBe(5);
    expect(codewaveUtils.GetDateCount('2024-09-30', 'week-month')).toBe(6);
  });

  test('给皇上修历法咯 旧历法', () => {
    expect(codewaveUtils.GetDateCountOld('2024-06-01', 'week-month')).toBe(1);
    expect(codewaveUtils.GetDateCountOld('2024-06-02', 'week-month')).toBe(2);
    expect(codewaveUtils.GetDateCountOld('2024-06-03', 'week-month')).toBe(2);
    expect(codewaveUtils.GetDateCountOld('2024-06-24', 'week-month')).toBe(5);
    expect(codewaveUtils.GetDateCountOld('2024-06-30', 'week-month')).toBe(6);
  });

  test('GetDateCount，Date 类型，无时区信息，兼容性测试', () => {
    expect(codewaveUtils.GetDateCount('2023-09-21', 'day-month')).toBe(21);
    expect(codewaveUtils.GetDateCount('2023-09-21', 'day-week')).toBe(4);
  });

  test('GetDateCount，DateTime 类型，有时区信息', () => {
    const d1 = new Date('2023-09-21T01:01:56.000Z');
    expect(codewaveUtils.GetDateCount(d1, 'day-month', 'Asia/Shanghai')).toBe(21);
    expect(codewaveUtils.GetDateCount(d1, 'day-month', 'America/New_York')).toBe(20);
    expect(codewaveUtils.GetDateCount(d1, 'day-week', 'Asia/Shanghai')).toBe(4);
    expect(codewaveUtils.GetDateCount(d1, 'day-week', 'America/New_York')).toBe(3);
  });

  test('GetDateCount，DateTime 类型，有时区信息，字符串输入', () => {
    const d1 = '2023-09-21T01:01:56.000Z';
    expect(codewaveUtils.GetDateCount(d1, 'day-month', 'Asia/Shanghai')).toBe(21);
    expect(codewaveUtils.GetDateCount(d1, 'day-month', 'America/New_York')).toBe(20);
    expect(codewaveUtils.GetDateCount(d1, 'day-week', 'Asia/Shanghai')).toBe(4);
    expect(codewaveUtils.GetDateCount(d1, 'day-week', 'America/New_York')).toBe(3);
  });

  test('GetSpecificDaysOfWeek，Date 类型，无时区信息，兼容性测试', () => {
    expect(codewaveUtils.GetSpecificDaysOfWeek('2023-09-18', '2023-09-24', [1, 7, 8])).toEqual([
      '2023-09-18',
      '2023-09-24',
    ]);
  });

  test('GetSpecificDaysOfWeek，DateTime 类型，有时区信息', () => {
    const d1 = new Date('2023-09-18T01:01:56.000Z');
    const d2 = new Date('2023-09-24T01:01:56.000Z');

    expect(codewaveUtils.GetSpecificDaysOfWeek(d1, d2, [1, 7, 8], 'Asia/Shanghai')).toEqual([
      '2023-09-18T00:00:00.000+08:00',
      '2023-09-24T00:00:00.000+08:00',
    ]); // 上海时间是 18 号到 24 号

    expect(codewaveUtils.GetSpecificDaysOfWeek(d1, d2, [1, 7, 8], 'America/New_York')).toEqual([
      '2023-09-17T00:00:00.000+08:00',
      '2023-09-18T00:00:00.000+08:00',
    ]); // 纽约时间是 17 号到 23 号
  });

  test('GetSpecificDaysOfWeek，DateTime 类型，有时区信息 2，字符串输入', () => {
    const d1 = '2023-09-18T01:01:56.000Z';
    const d2 = '2023-09-24T01:01:56.000Z';

    expect(codewaveUtils.GetSpecificDaysOfWeek(d1, d2, [1, 7, 8], 'Asia/Shanghai')).toEqual([
      '2023-09-18T00:00:00.000+08:00',
      '2023-09-24T00:00:00.000+08:00',
    ]); // 上海时间是 18 号到 24 号

    expect(codewaveUtils.GetSpecificDaysOfWeek(d1, d2, [1, 7, 8], 'America/New_York')).toEqual([
      '2023-09-17T00:00:00.000+08:00',
      '2023-09-18T00:00:00.000+08:00',
    ]); // 纽约时间是 17 号到 23 号
  });
});
