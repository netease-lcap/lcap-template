import { DateTime } from 'luxon';

/**
 * Get the week of the month for a given date
 * @param date - The date to check
 * @param options - Options object
 * @param options.weekStartsOn - Index of the first day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * @returns The week of the month (1-indexed)
 * @example
 * // Which week of the month is June 2, 2024? (Sunday start)
 * getWeekOfMonth(new Date(2024, 5, 2)) // => 2
 *
 * // Which week of the month is June 2, 2024? (Monday start)
 * getWeekOfMonth(new Date(2024, 5, 2), { weekStartsOn: 1 }) // => 1
 */
export function getWeekOfMonth(date: Date, options?: { weekStartsOn?: number }): number {
  const weekStartsOn = options?.weekStartsOn ?? 0;

  // 将 Date 转换为 Luxon DateTime
  const dt = DateTime.fromJSDate(date);
  const currentDayOfMonth = dt.day; // 1-31

  // 获取月初
  const startOfMonth = dt.startOf('month');

  // 获取月初的星期几
  // Luxon: 1=周一, 7=周日
  // 需要转换为 JS 风格: 0=周日, 6=周六
  let startWeekDay = startOfMonth.weekday === 7 ? 0 : startOfMonth.weekday;

  // 计算第一周的最后一天
  let lastDayOfFirstWeek = weekStartsOn - startWeekDay;
  if (lastDayOfFirstWeek <= 0) lastDayOfFirstWeek += 7;

  // 计算第一周之后的剩余天数并返回周数
  const remainingDaysAfterFirstWeek = currentDayOfMonth - lastDayOfFirstWeek;
  return Math.ceil(remainingDaysAfterFirstWeek / 7) + 1;
}

// Luxon 辅助函数 - 替代 date-fns
export function addDays(date: Date, amount: number): Date {
  return DateTime.fromJSDate(date).plus({ days: amount }).toJSDate();
}

export function subDays(date: Date, amount: number): Date {
  return DateTime.fromJSDate(date).minus({ days: amount }).toJSDate();
}

export function addMonths(date: Date, amount: number): Date {
  return DateTime.fromJSDate(date).plus({ months: amount }).toJSDate();
}

export function addSeconds(date: Date, amount: number): Date {
  return DateTime.fromJSDate(date).plus({ seconds: amount }).toJSDate();
}

export function addMinutes(date: Date, amount: number): Date {
  return DateTime.fromJSDate(date).plus({ minutes: amount }).toJSDate();
}

export function addHours(date: Date, amount: number): Date {
  return DateTime.fromJSDate(date).plus({ hours: amount }).toJSDate();
}

export function addWeeks(date: Date, amount: number): Date {
  return DateTime.fromJSDate(date).plus({ weeks: amount }).toJSDate();
}

export function addQuarters(date: Date, amount: number): Date {
  return DateTime.fromJSDate(date).plus({ quarters: amount }).toJSDate();
}

export function addYears(date: Date, amount: number): Date {
  return DateTime.fromJSDate(date).plus({ years: amount }).toJSDate();
}

export function differenceInYears(dateLeft: Date, dateRight: Date): number {
  const left = DateTime.fromJSDate(dateLeft);
  const right = DateTime.fromJSDate(dateRight);
  return Math.trunc(left.diff(right, 'years').years);
}

export function differenceInQuarters(dateLeft: Date, dateRight: Date): number {
  const left = DateTime.fromJSDate(dateLeft);
  const right = DateTime.fromJSDate(dateRight);
  return Math.trunc(left.diff(right, 'quarters').quarters);
}

export function differenceInMonths(dateLeft: Date, dateRight: Date): number {
  const left = DateTime.fromJSDate(dateLeft);
  const right = DateTime.fromJSDate(dateRight);
  return Math.trunc(left.diff(right, 'months').months);
}

export function differenceInWeeks(dateLeft: Date, dateRight: Date): number {
  const left = DateTime.fromJSDate(dateLeft);
  const right = DateTime.fromJSDate(dateRight);
  return Math.trunc(left.diff(right, 'weeks').weeks);
}

export function differenceInDays(dateLeft: Date, dateRight: Date): number {
  const left = DateTime.fromJSDate(dateLeft);
  const right = DateTime.fromJSDate(dateRight);
  return Math.trunc(left.diff(right, 'days').days);
}

export function differenceInHours(dateLeft: Date, dateRight: Date): number {
  const left = DateTime.fromJSDate(dateLeft);
  const right = DateTime.fromJSDate(dateRight);
  return Math.trunc(left.diff(right, 'hours').hours);
}

export function differenceInMinutes(dateLeft: Date, dateRight: Date): number {
  const left = DateTime.fromJSDate(dateLeft);
  const right = DateTime.fromJSDate(dateRight);
  return Math.trunc(left.diff(right, 'minutes').minutes);
}

export function differenceInSeconds(dateLeft: Date, dateRight: Date): number {
  const left = DateTime.fromJSDate(dateLeft);
  const right = DateTime.fromJSDate(dateRight);
  return Math.trunc(left.diff(right, 'seconds').seconds);
}

export function getDayOfYear(date: Date): number {
  return DateTime.fromJSDate(date).ordinal;
}

export function getQuarter(date: Date): number {
  return DateTime.fromJSDate(date).quarter;
}

export function getMonth(date: Date): number {
  return DateTime.fromJSDate(date).month - 1; // date-fns returns 0-11, Luxon returns 1-12
}

/**
 * Get the week year for a given date
 * @param date - The date to check
 * @param options - Options object
 * @param options.weekStartsOn - Index of the first day of the week (0 = Sunday)
 * @param options.firstWeekContainsDate - Day of January which is always in the first week
 * @returns The week year
 */
function getWeekYear(date: Date, options?: { weekStartsOn?: number; firstWeekContainsDate?: number }): number {
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? 1; // Default: 1 (January 1st is always in the first week)

  const year = date.getFullYear();

  // Get the start of first week of this year
  const firstWeekOfThisYear = new Date(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);

  // Get the start of first week of next year
  const firstWeekOfNextYear = new Date(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);

  // Determine which week-numbering year this date belongs to
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

/**
 * Get the start of the week-numbering year for a given date
 * @param date - The date to check
 * @param options - Options object
 * @param options.weekStartsOn - Index of the first day of the week (0 = Sunday)
 * @param options.firstWeekContainsDate - Day of January which is always in the first week
 * @returns The start of the week-numbering year
 */
function startOfWeekYear(date: Date, options?: { weekStartsOn?: number; firstWeekContainsDate?: number }): Date {
  const weekStartsOn = options?.weekStartsOn ?? 0;
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? 1; // Default: 1 (January 1st is always in the first week)

  const year = getWeekYear(date, options);
  const firstWeek = new Date(year, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);

  return startOfWeek(firstWeek, { weekStartsOn });
}

/**
 * Get the local week index of the given date
 * @param date - The date to check
 * @param options - Options object
 * @param options.weekStartsOn - Index of the first day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * @param options.firstWeekContainsDate - Day of January which is always in the first week (1-7, default: 1)
 * @returns The week number (1-indexed)
 * @example
 * // Which week of the local week numbering year is 2 January 2005?
 * getWeek(new Date(2005, 0, 2)) // => 2
 *
 * // Which week is it if Monday is the first day of the week?
 * getWeek(new Date(2005, 0, 2), { weekStartsOn: 1, firstWeekContainsDate: 4 }) // => 53
 */
export function getWeek(date: Date, options?: { weekStartsOn?: number; firstWeekContainsDate?: number }): number {
  const defaultedOptions = { weekStartsOn: 1, firstWeekContainsDate: 1 };
  const mergedOptions = {
    ...defaultedOptions,
    ...(options || {}),
  };

  const MILLISECONDS_IN_WEEK = 604800000; // 7 * 24 * 60 * 60 * 1000

  const startOfWeekDate = startOfWeek(date, mergedOptions);
  const startOfWeekYearDate = startOfWeekYear(date, mergedOptions);

  const diff = startOfWeekDate.getTime() - startOfWeekYearDate.getTime();

  return Math.floor(diff / MILLISECONDS_IN_WEEK) + 1;
}

export function getDate(date: Date): number {
  return DateTime.fromJSDate(date).day;
}

export function startOfWeek(date: Date, options?: { weekStartsOn?: number }): Date {
  const weekStartsOn = options?.weekStartsOn ?? 0;
  const dt = DateTime.fromJSDate(date);

  // Luxon weekday: 1 (Monday) - 7 (Sunday)
  // JS getDay: 0 (Sunday) - 6 (Saturday)
  // Convert Luxon weekday to JS-style
  const currentWeekday = dt.weekday === 7 ? 0 : dt.weekday;

  // Calculate how many days to subtract to get to the start of the week
  let daysToSubtract = currentWeekday - weekStartsOn;
  if (daysToSubtract < 0) {
    daysToSubtract += 7;
  }

  return dt.minus({ days: daysToSubtract }).startOf('day').toJSDate();
}

export function startOfQuarter(date: Date): Date {
  return DateTime.fromJSDate(date).startOf('quarter').toJSDate();
}

export function eachDayOfInterval(interval: { start: Date; end: Date }): Date[] {
  const start = DateTime.fromJSDate(interval.start).startOf('day');
  const end = DateTime.fromJSDate(interval.end).startOf('day');
  const days: Date[] = [];

  let current = start;
  while (current <= end) {
    days.push(current.toJSDate());
    current = current.plus({ days: 1 });
  }

  return days;
}

export function isMonday(date: Date): boolean {
  return DateTime.fromJSDate(date).weekday === 1;
}

export function isTuesday(date: Date): boolean {
  return DateTime.fromJSDate(date).weekday === 2;
}

export function isWednesday(date: Date): boolean {
  return DateTime.fromJSDate(date).weekday === 3;
}

export function isThursday(date: Date): boolean {
  return DateTime.fromJSDate(date).weekday === 4;
}

export function isFriday(date: Date): boolean {
  return DateTime.fromJSDate(date).weekday === 5;
}

export function isSaturday(date: Date): boolean {
  return DateTime.fromJSDate(date).weekday === 6;
}

export function isSunday(date: Date): boolean {
  return DateTime.fromJSDate(date).weekday === 7;
}

export function format(date: Date, formatStr: string): string {
  const dt = DateTime.fromJSDate(date);
  return dt.toFormat(formatStr);
}

export function isValid(date: Date): boolean {
  if (!date) {
    return false;
  }
  if (!(date instanceof Date)) {
    return false;
  }
  const dt = DateTime.fromJSDate(date);
  return dt.isValid && !isNaN(date.getTime());
}
