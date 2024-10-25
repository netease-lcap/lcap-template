const moment = require('moment');
const momentTZ = require('moment-timezone');

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

export const sortAsync = (array = [], sortRule) => async (callback) => {
  const promises = array.map(async (current) => {
    const id = await callback(current);
    return { id, current };
  });
  const list = await Promise.all(promises);
  let res = list.sort((a, b) => sortRule(a.id, b.id))
  return res.map((item, index) => array[index] = item.current);
}

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
  if (validIANATimezoneCache[timezoneString])
    return true;
  try {
    new Intl.DateTimeFormat(undefined, { timeZone: timezoneString });
    validIANATimezoneCache[timezoneString] = true;
    return true;
  } catch (error) {
    return false;
  }
}
