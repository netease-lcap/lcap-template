import { DateTime } from 'luxon';

// 不知道怎么对齐getWeekOfMonth， 还是沿用吧
export { getWeekOfMonth } from 'date-fns';

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
  return Math.floor(left.diff(right, 'years').years);
}

export function differenceInQuarters(dateLeft: Date, dateRight: Date): number {
  const left = DateTime.fromJSDate(dateLeft);
  const right = DateTime.fromJSDate(dateRight);
  return Math.floor(left.diff(right, 'quarters').quarters);
}

export function differenceInMonths(dateLeft: Date, dateRight: Date): number {
  const left = DateTime.fromJSDate(dateLeft);
  const right = DateTime.fromJSDate(dateRight);
  return Math.floor(left.diff(right, 'months').months);
}

export function differenceInWeeks(dateLeft: Date, dateRight: Date): number {
  const left = DateTime.fromJSDate(dateLeft);
  const right = DateTime.fromJSDate(dateRight);
  return Math.floor(left.diff(right, 'weeks').weeks);
}

export function differenceInDays(dateLeft: Date, dateRight: Date): number {
  const left = DateTime.fromJSDate(dateLeft);
  const right = DateTime.fromJSDate(dateRight);
  return Math.floor(left.diff(right, 'days').days);
}

export function differenceInHours(dateLeft: Date, dateRight: Date): number {
  const left = DateTime.fromJSDate(dateLeft);
  const right = DateTime.fromJSDate(dateRight);
  return Math.floor(left.diff(right, 'hours').hours);
}

export function differenceInMinutes(dateLeft: Date, dateRight: Date): number {
  const left = DateTime.fromJSDate(dateLeft);
  const right = DateTime.fromJSDate(dateRight);
  return Math.floor(left.diff(right, 'minutes').minutes);
}

export function differenceInSeconds(dateLeft: Date, dateRight: Date): number {
  const left = DateTime.fromJSDate(dateLeft);
  const right = DateTime.fromJSDate(dateRight);
  return Math.floor(left.diff(right, 'seconds').seconds);
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

export function getWeek(date: Date): number {
  // Luxon 的 weekNumber 始终遵循 ISO 标准（周一为一周起始日）
  return DateTime.fromJSDate(date).weekNumber;
}

export function getDate(date: Date): number {
  return DateTime.fromJSDate(date).day;
}

export function startOfWeek(date: Date, options?: { weekStartsOn?: number }): Date {
  const dt = DateTime.fromJSDate(date);
  return dt.startOf('week').toJSDate();
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
