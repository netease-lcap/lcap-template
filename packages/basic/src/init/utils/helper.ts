import momentTZ from 'moment-timezone';
import moment from 'moment';

export const findAsync = async (arr, callback) => {
  for (let i = 0; i < arr.length; i++) {
    const result = await callback(arr[i], i, arr);
    if (result) {
      return arr[i];
    }
  }
  return undefined;
};

export const mapAsync = async (arr, callback) => {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const mappedValue = await callback(arr[i], i, arr);
    result.push(mappedValue);
  }
  return result;
};

export const filterAsync = async (arr, callback) => {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const filteredValue = await callback(arr[i], i, arr);
    if (filteredValue) {
      result.push(arr[i]);
    }
  }
  return result;
};

export const findIndexAsync = async (arr, callback) => {
  for (let i = 0; i < arr.length; i++) {
    const result = await callback(arr[i], i, arr);
    if (result) {
      return i;
    }
  }
  return -1;
};

export const sortRule = (valueA, valueB, sort) => {
  if (
    Number.isNaN(valueA) ||
    Number.isNaN(valueB) ||
    typeof valueA === 'undefined' ||
    typeof valueB === 'undefined' ||
    valueA === null ||
    valueB === null
  ) {
    return 1;
  } else {
    if (valueA >= valueB) {
      if (sort) {
        return 1;
      }
      return -1;
    } else {
      if (sort) {
        return -1;
      }
      return 1;
    }
  }
};

export const getAppTimezone = (inputTz) => {
  const _appTimeZone = window?.appInfo?.appTimeZone;
  const tz = inputTz === 'global' ? _appTimeZone : inputTz;

  if (tz && tz !== 'user') {
    // 指定的固定的时区
    return tz;
  } else {
    // 用户本地时区，包括 tz 是 null 的场景
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
};

const validIANATimezoneCache = {};
// 判断是否是有效的时区字符
export function isValidTimezoneIANAString(timezoneString) {
  if (validIANATimezoneCache[timezoneString]) return true;
  try {
    new Intl.DateTimeFormat(undefined, { timeZone: timezoneString });
    validIANATimezoneCache[timezoneString] = true;
    return true;
  } catch (error) {
    return false;
  }
}

export function naslDateToLocalDate(date) {
  const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localDate = momentTZ.tz(date, 'YYYY-MM-DD', localTZ);
  return safeNewDate(localDate.format('YYYY-MM-DD HH:mm:ss'));
}

export function convertJSDateInTargetTimeZone(date, tz) {
  return safeNewDate(momentTZ.tz(safeNewDate(date), getAppTimezone(tz)).format('YYYY-MM-DD HH:mm:ss'));
}

export const safeNewDate = (dateStr) => {
  // 如果输入是字符串形式的时间戳，则先转换为时间戳
  if (typeof dateStr === 'string' && /^\d+$/.test(dateStr)) {
    const date = new Date(parseInt(dateStr, 10));
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  try {
    const res = new Date(dateStr.replaceAll('-', '/'));
    if (['Invalid Date', 'Invalid time value', 'invalid date'].includes(res.toString())) {
      return new Date(dateStr);
    } else {
      return res;
    }
  } catch (err) {
    return new Date(dateStr);
  }
};
