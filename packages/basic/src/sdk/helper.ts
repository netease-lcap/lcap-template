import { DateTime } from 'luxon';
import { isObject } from 'lodash';

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
  const result: any[] = [];
  for (let i = 0; i < arr.length; i++) {
    const mappedValue = await callback(arr[i], i, arr);
    result.push(mappedValue);
  }
  return result;
};

export const filterAsync = async (arr, callback) => {
  const result: any[] = [];
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

/**
 * 获取应用的时区
 * 逻辑：
 * 1. 如果输入的时区是 'global'，则使用应用配置的时区（window.appInfo.appTimeZone）
 * 2. 如果输入的时区是其他非 'user' 的值，则使用该值作为时区
 * 3. 如果输入的时区是 'user' 或者没有输入，则使用用户本地的时区（Intl.DateTimeFormat().resolvedOptions().timeZone）
 */
export const getAppTimezone = (tz?: string) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const globalTimeZone =
    (window?.appInfo?.appTimeZone === 'user' ? userTimeZone : window?.appInfo?.appTimeZone) ?? userTimeZone;

  tz = tz ?? 'user';
  switch (tz) {
    case 'global':
      return globalTimeZone;
    case 'user':
      return userTimeZone;
    default:
      return tz;
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
  // 仅日期部分
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const localDate = DateTime.fromFormat(date, 'yyyy-MM-dd', { zone: localTZ });
    return safeNewDate(localDate.toFormat('yyyy-MM-dd HH:mm:ss'));
  }

  // 日期时间
  if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(date)) {
    const localDate = DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm:ss', { zone: localTZ });
    return safeNewDate(localDate.toFormat('yyyy-MM-dd HH:mm:ss'));
  }

  // ISO 字符串
  if (typeof date === 'string' && date.includes('T')) {
    const localDate = DateTime.fromISO(date, { zone: localTZ });
    return safeNewDate(localDate.toFormat('yyyy-MM-dd HH:mm:ss'));
  }

  // 其他情况直接转换
  const localDate = DateTime.fromJSDate(safeNewDate(date), { zone: localTZ });
  return safeNewDate(localDate.toFormat('yyyy-MM-dd HH:mm:ss'));
}

export function convertJSDateInTargetTimeZone(date, tz) {
  return safeNewDate(
    DateTime.fromJSDate(safeNewDate(date)).setZone(getAppTimezone(tz)).toFormat('yyyy-MM-dd HH:mm:ss'),
  );
}

export const safeNewDate = (dateStr) => {
  // 如果输入是字符串形式的时间戳，则先转换为时间戳
  if (typeof dateStr === 'string' && /^\d+$/.test(dateStr)) {
    const date = new Date(parseInt(dateStr, 10));
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  const isValidDate = (date) => {
    return !['Invalid Date', 'Invalid time value', 'invalid date'].includes(date.toString());
  };
  const fallback = new Date(null);
  try {
    // 尝试第一次转日期
    let res = new Date(dateStr);
    // 如果是无效日期，则尝试替换 '-' 为 '/' 再转
    if (!isValidDate(res)) {
      res = new Date(dateStr.replaceAll('-', '/'));
      // 如果还是无效日期，则返回 fallback
      if (!isValidDate(res)) {
        return fallback;
      }
    }

    return res;
  } catch (err) {
    return fallback;
  }
};

// 类型定义是否属于基础类型
export const isDefPrimitive = (typeKey) =>
  [
    'nasl.core.Boolean',
    'nasl.core.Long',
    'nasl.core.Decimal',
    'nasl.core.String',
    'nasl.core.Text',
    'nasl.core.Binary',
    'nasl.core.Date',
    'nasl.core.Time',
    'nasl.core.DateTime',
    'nasl.core.Email',
  ].includes(typeKey);

// 类型定义是否属于字符串大类
export const isDefString = (typeKey) =>
  [
    'nasl.core.String',
    'nasl.core.Text',
    'nasl.core.Binary',
    'nasl.core.Date',
    'nasl.core.Time',
    'nasl.core.DateTime',
    'nasl.core.Email',
  ].includes(typeKey);

export type RegExpLike = {
  pattern: string;
  flags?: string;
  $type: 'nasl.util.Regex';
};

export const isDefRegExp: (obj: unknown) => boolean = (obj: unknown) => {
  // @ts-expect-error
  return isObject(obj) && obj.$type === 'nasl.util.Regex';
};

// 类型定义是否属于数字大类
export const isDefNumber = (typeKey) => ['nasl.core.Long', 'nasl.core.Decimal'].includes(typeKey);

// 类型定义是否属于数组
export const isDefList = (typeDefinition) => {
  const { typeKind, typeNamespace, typeName } = typeDefinition || {};
  return typeKind === 'generic' && typeNamespace === 'nasl.collection' && typeName === 'List';
};

// 类型定义是否属于Map
export const isDefMap = (typeDefinition) => {
  const { typeKind, typeNamespace, typeName } = typeDefinition || {};
  return typeKind === 'generic' && typeNamespace === 'nasl.collection' && typeName === 'Map';
};

export function isInputValidNaslDateTime(input) {
  return (
    input instanceof Date ||
    (typeof input === 'string' && /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/.test(input)) ||
    (typeof input === 'string' && /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/.test(input))
  );
}

export function toValue(date, typeKey) {
  if (!date) return date;
  if (typeKey === 'format')
    return DateTime.fromJSDate(date).toFormat('yyyy-MM-dd'); // value 的真实格式
  else if (typeKey === 'json') return this.JsonSerialize(date);
  else if (typeKey === 'timestamp') return date.getTime();
  else return date;
}
