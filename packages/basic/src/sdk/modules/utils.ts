import type { TypeAnnotation } from '@lcap/nasl';
import moment from 'moment';
import momentTZ from 'moment-timezone';
import {
  addDays,
  subDays,
  addMonths,
  format,
  isValid,
  differenceInYears,
  differenceInQuarters,
  differenceInMonths,
  differenceInWeeks,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  getDayOfYear,
  getWeekOfMonth,
  getQuarter,
  startOfWeek,
  getMonth,
  getWeek,
  getDate,
  startOfQuarter,
  addSeconds,
  addMinutes,
  addHours,
  addQuarters,
  addYears,
  addWeeks,
  eachDayOfInterval,
  isMonday,
  isTuesday,
  isWednesday,
  isThursday,
  isFriday,
  isSaturday,
  isSunday,
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { isObject, set, isEqual, cloneDeep } from 'lodash';
import Decimal from 'decimal.js';
import {
  isInputValidNaslDateTime,
  getAppTimezone,
  mapAsync,
  findAsync,
  filterAsync,
  findIndexAsync,
  sortRule,
  convertJSDateInTargetTimeZone,
  safeNewDate,
  toValue,
  naslDateToLocalDate,
  isValidTimezoneIANAString,
  isDefList,
  isDefMap,
  isDefNumber,
  isDefString,
  isDefRegExp,
  RegExpLike,
} from '../helper';
import { dateFormatter } from '../Formatters';
import type { IOptions } from '../types';

export class Utils {
  private helpers: IOptions;

  constructor(optinos: IOptions) {
    this.helpers = optinos;
  }

  /**
   * 判断数组访问是否越界
   * @param arr
   * @param index
   * @param boundaryChecker
   * @returns
   */
  private isArrayInBounds<T>(arr: T[], index: number, boundaryChecker?: (index: number, arr: T[]) => boolean): boolean {
    if (!Array.isArray(arr)) {
      this.helpers.throwError('传入内容不是数组');
      return false;
    }

    if (typeof index !== 'number' || isNaN(index)) {
      this.helpers.throwError('传入下标不是数字');
      return false;
    }

    const defaultBoundaryChecker = (idx: number, array: T[]) => idx >= 0 && idx < array.length;
    const checker = boundaryChecker ?? defaultBoundaryChecker;

    if (!checker(index, arr)) {
      this.helpers.throwError(`列表访问越界，访问下标 ${index}，列表长度 ${arr.length}`);
      return false;
    }

    return true;
  }

  EnumItemToText(typeKey, value): string {
    if (typeKey) {
      return this.helpers.toString(typeKey, value) || '';
    }

    return '';
  }

  EnumItemToStructure(typeKey, value): { text: string; value: any; item: any } {
    if (typeKey) {
      const { typeName, typeNamespace } = this.helpers.typeDefinitionMap.get(typeKey) || {};

      let isToNumber = false;
      if (typeName === 'Long' && typeNamespace === 'nasl.core') {
        isToNumber = true;
      }

      return {
        text: this.helpers.toString(typeKey, value),
        value: isToNumber ? +value : value,
        item: isToNumber ? +value : value,
      };
    }

    return {
      text: '',
      value: '',
      item: '',
    };
  }

  ToEnumItem(value, typeAnnotation: Partial<TypeAnnotation>) {
    const { typeName, typeNamespace } = typeAnnotation;
    const { enumsMap } = this.helpers;

    if (typeName) {
      let enumName = typeName;
      if (typeNamespace?.startsWith('extensions') || typeNamespace?.startsWith('nasl')) {
        enumName = typeNamespace + '.' + enumName;
      }
      if (enumsMap[enumName] && enumsMap[enumName].hasOwnProperty(value)) {
        return value;
      }
      return null;
    }

    return null;
  }

  EnumToList(typeAnnotation: Partial<TypeAnnotation>) {
    const { typeName, typeNamespace } = typeAnnotation;
    const { dataTypesMap, toString } = this.helpers;

    let tempEnums = dataTypesMap[`${typeNamespace}.${typeName}`] || {};
    let tempName = tempEnums?.name;
    let enumName = typeName;
    if (typeName && typeNamespace?.startsWith('extensions')) {
      enumName = typeNamespace + '.' + enumName;
      tempName = enumName;
    }
    let isToNumber = false;
    if (
      enumName === tempName &&
      tempEnums.valueType?.typeName === 'Long' &&
      tempEnums.valueType?.typeNamespace === 'nasl.core'
    ) {
      isToNumber = true;
    }
    if (!Array.isArray(tempEnums.enumItems)) return [];
    else {
      return tempEnums.enumItems.map((enumItem) => ({
        text: toString(typeNamespace + '.' + typeName, enumItem.value),
        value: isToNumber ? +enumItem.value : enumItem.value,
        // 在nasl中item属性类型是Enum，例如 app.enums.Enum1
        item: isToNumber ? +enumItem.value : enumItem.value,
      }));
    }
  }

  JsonSerialize(v, tz?) {
    // 目前入参 v 的类型是 nasl.DateTime、nasl.Date、nasl.Time 时，都是 js 原生 string 类型
    // 只能使用 regex 粗略判断一下
    if (isInputValidNaslDateTime(v)) {
      // v3.3 老应用升级的场景，UTC 零时区，零时区展示上用 'Z'，后向兼容
      // v3.4 新应用，使用默认时区时选项，tz 为空
      if (!tz) {
        const d = momentTZ.tz(v, 'UTC').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        return JSON.stringify(d);
      }
      // 新应用，设置为零时区，零时区展示上用 'Z'，后向兼容.
      if (tz === 'UTC') {
        // TODO: 想用 "+00:00" 展示零时区
        const d = momentTZ.tz(v, 'UTC').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        return JSON.stringify(d);
      }
      // 新应用，设置为其他时区
      if (tz) {
        const d = momentTZ.tz(v, getAppTimezone(tz)).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        return JSON.stringify(d);
      }
    } else if (typeof v === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(v)) {
      // test if the input v is a pure time-format string in the form of hh:mm:ss
      return JSON.stringify(v);
    } else if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
      // test if the input v is a pure date-format string in the form of yyyy-MM-dd
      return JSON.stringify(v);
    } else {
      return JSON.stringify(v);
    }
  }

  JsonDeserialize(str) {
    try {
      return JSON.parse(str);
    } catch (error) {
      return;
    }
  }

  Split(str: string, separator: string | RegExpLike, trail?: boolean) {
    if (Object.prototype.toString.call(str) === '[object String]') {
      let res;
      if (isDefRegExp(separator)) {
        // @ts-expect-error
        const reg = new RegExp(separator.pattern, separator.flags);
        res = str.split(reg);
      } else {
        res = str.split(separator as string);
      }

      if (trail === true) {
        return res;
      } else {
        if (res.length > 0) {
          const lastStr = res[res.length - 1];
          if (lastStr.length === 0) {
            res.pop();
          }
          return res;
        } else {
          return [];
        }
      }
    }

    return [];
  }

  Join<T>(arr: T[], separator: string): string {
    if (Array.isArray(arr)) {
      return arr.join(separator);
    }

    return '';
  }

  Concat<T>(...args: T[]) {
    return args.join('');
  }

  Length(input: unknown) {
    // Map类型
    if (isObject(input)) {
      return Object.keys(input).length;
    }

    // @ts-expect-error
    if (input?.length !== undefined) {
      // @ts-expect-error
      return input.length;
    }

    return null;
  }

  ToLower(str: string) {
    return str && str.toLowerCase();
  }

  ToUpper(str: string) {
    return str && str.toUpperCase();
  }

  Trim(str: string) {
    return str && str.trim();
  }

  Get<T>(arr: T[], index: number): T | undefined {
    if (this.isArrayInBounds(arr, index)) {
      return arr[index];
    }
  }

  Set<T>(arr: T[], index: number, item: T) {
    if (this.isArrayInBounds(arr, index)) {
      if (typeof this.helpers.set === 'function') {
        return this.helpers.set(arr, index, item);
      }

      arr[index] = item;
      return arr;
    }
  }

  Contains<T>(arr: T[], item: T): boolean {
    if (!Array.isArray(arr)) {
      return false;
    }

    return arr.findIndex((i) => isEqual(i, item)) !== -1;
  }

  Add<T>(arr: T[], item: T) {
    if (Array.isArray(arr)) {
      arr.push(item);
    }
  }

  AddAll<T>(arr: T[], items: T[]) {
    if (Array.isArray(arr) && Array.isArray(items)) {
      arr.push(...items);
      return arr.length;
    }
  }

  Insert<T>(arr: T[], index: number, item: T) {
    const boundaryChecker = (idx: number, array: T[]) => idx >= 0 && idx <= array.length;
    if (this.isArrayInBounds(arr, index, boundaryChecker)) {
      arr.splice(index, 0, item);
    }
  }

  Remove<T>(arr: T[], item: T) {
    if (Array.isArray(arr)) {
      const index = arr.indexOf(item);
      ~index && arr.splice(index, 1);
    }
  }

  RemoveAt<T>(arr: T[], index: number) {
    if (this.isArrayInBounds(arr, index)) {
      return arr.splice(index, 1)[0];
    }
  }

  ListHead<T>(arr: T[]) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return null;
    } else {
      return arr[0];
    }
  }

  ListLast<T>(arr: T[]) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return null;
    } else {
      return arr[arr.length - 1];
    }
  }

  ListFlatten<T>(arr: T[]) {
    if (Array.isArray(arr) && arr.every((elem) => Array.isArray(elem))) {
      return arr.flat();
    } else {
      return null;
    }
  }

  ListTransform<T, U>(arr: T[], callback: (item: T) => U) {
    if (Array.isArray(arr)) {
      return arr.map((elem) => callback(elem));
    } else {
      return null;
    }
  }

  async ListTransformAsync<T, U>(arr: T[], callback: (item: T) => Promise<U>): Promise<U[]> {
    if (Array.isArray(arr)) {
      return await mapAsync(arr, (elem) => callback(elem));
    } else {
      return null;
    }
  }

  ListFilter(arr, by) {
    if (!Array.isArray(arr) || typeof by !== 'function') {
      return null;
    }
    return arr.filter(by);
  }

  async ListFilterAsync(arr, by) {
    if (!Array.isArray(arr) || typeof by !== 'function') {
      return null;
    }
    return await filterAsync(arr, by);
  }

  ListSum<T>(arr: T[]) {
    if (!Array.isArray(arr)) {
      return null;
    }

    const nullRemoved = this.ListFilter(arr, (elem) => elem !== null && elem !== undefined);
    return nullRemoved.length === 0
      ? null
      : nullRemoved
          .reduce(
            (prev, cur) =>
              // decimal 可解决 0.1 + 0.2 的精度问题，下同
              new Decimal(cur + '').plus(prev),
            new Decimal('0'),
          )
          .toNumber();
  }

  ListProduct<T>(arr: T[]) {
    if (!Array.isArray(arr)) {
      return null;
    }

    const nullRemoved = this.ListFilter(arr, (elem) => elem !== null && elem !== undefined);
    return nullRemoved.length === 0
      ? null
      : nullRemoved.reduce((prev, cur) => new Decimal(cur + '').mul(prev), new Decimal('1')).toNumber();
  }

  ListAverage<T>(arr: T[]) {
    if (!Array.isArray(arr)) {
      return null;
    }

    const nullRemoved = this.ListFilter(arr, (elem) => elem !== null && elem !== undefined);
    return nullRemoved.length === 0 ? null : new Decimal(this.ListSum(nullRemoved)).div(nullRemoved.length).toNumber();
  }

  ListMax<T>(arr: T[]) {
    if (!Array.isArray(arr)) {
      return null;
    }

    const nullRemoved = this.ListFilter(arr, (elem) => elem !== null && elem !== undefined);
    return nullRemoved.length === 0
      ? null
      : nullRemoved.reduce((prev, cur) => (prev >= cur ? prev : cur), nullRemoved[0]);
  }

  ListMin<T>(arr: T[]) {
    if (!Array.isArray(arr)) {
      return null;
    }

    const nullRemoved = this.ListFilter(arr, (elem) => elem !== null && elem !== undefined);
    return nullRemoved.length === 0
      ? null
      : nullRemoved.reduce((prev, cur) => (prev <= cur ? prev : cur), nullRemoved[0]);
  }

  ListRange(start: number, end: number, step: number) {
    if (step === 0) {
      return [];
    }
    const result = [];
    if (step > 0) {
      for (let i = start; i < end; i += step) {
        result.push(i);
      }
    } else {
      for (let i = start; i > end; i += step) {
        result.push(i);
      }
    }
    return result;
  }

  ListRepeat<T>(item: T, length: number) {
    if (typeof length !== 'number') {
      return [];
    }
    if (length <= 0) {
      return [];
    }
    return Array(length).fill(item);
  }

  ListFind<T>(arr: T[], callback: (item: T) => boolean) {
    if (Array.isArray(arr)) {
      if (typeof callback === 'function') {
        const value = arr.find(callback);
        return typeof value === 'undefined' ? null : value;
      }
    }
  }

  async ListFindAsync<T>(arr: T[], callback: (item: T) => Promise<boolean>) {
    if (Array.isArray(arr)) {
      if (typeof callback === 'function') {
        const value = await findAsync(arr, callback);
        return typeof value === 'undefined' ? null : value;
      }
    }
  }

  ListFindIndex<T>(arr: T[], callback: (item: T) => boolean) {
    if (Array.isArray(arr)) {
      if (typeof callback === 'function') {
        return arr.findIndex(callback);
      }
    }
  }

  async ListFindIndexAsync<T>(arr: T[], callback: (item: T) => Promise<boolean>) {
    if (Array.isArray(arr)) {
      if (typeof callback === 'function') {
        return await findIndexAsync(arr, callback);
      }
    }
  }

  ListSlice<T>(arr: T[], start: number, end: number) {
    // 由于 slice 的特性，end 要校验的是长度，而不是下标，所以要减 1
    if (this.isArrayInBounds(arr, start) && this.isArrayInBounds(arr, end - 1)) {
      return arr.slice(start, end);
    }
  }

  // 不修改原 list，返回新 list
  ListDistinctBy(arr, listGetVal) {
    // getVal : <A,B> . A => B 给一个 A 类型的数据，返回 A 类型中被用户选中的 field 的 value
    // listGetVal: getVal 这样的函数组成的 list

    if (!Array.isArray(arr)) {
      return null;
    }
    // item => List[item.userName, item.id]
    if (arr.length === 0) {
      return arr;
    }

    const res = [];
    const vis = new Set();
    for (const item of arr) {
      // eslint-disable-next-line no-return-await
      const hashArr = listGetVal.map((fn) => fn(item));
      // eslint-disable-next-line no-await-in-loop
      const hash = hashArr.join('');
      if (!vis.has(hash)) {
        vis.add(hash);
        res.push(item);
      }
    }
    return res;
  }

  async ListDistinctByAsync(arr, listGetVal) {
    // getVal : <A,B> . A => B 给一个 A 类型的数据，返回 A 类型中被用户选中的 field 的 value
    // listGetVal: getVal 这样的函数组成的 list

    if (!Array.isArray(arr)) {
      return null;
    }
    // item => List[item.userName, item.id]
    if (arr.length === 0) {
      return arr;
    }

    const res = [];
    const vis = new Set();
    for (const item of arr) {
      // eslint-disable-next-line no-return-await
      const hashArr = listGetVal.map(async (fn) => await fn(item));
      // eslint-disable-next-line no-await-in-loop
      const hash = (await Promise.all(hashArr)).join('');
      if (!vis.has(hash)) {
        vis.add(hash);
        res.push(item);
      }
    }
    return res;
  }

  ListGroupBy(arr, getVal) {
    // getVal : <A,B> . A => B 给一个 A 类型的数据，返回 A 类型中被用户选中的 field 的 value
    if (!arr || typeof getVal !== 'function') {
      return null;
    }
    const res = {};
    arr.forEach((e) => {
      const val = getVal(e);
      if (res[val]) {
        // res.get(val) 是一个 array
        res[val].push(e);
      } else {
        res[val] = [e];
      }
    });
    return res;
  }

  async ListGroupByAsync(arr, getVal) {
    // getVal : <A,B> . A => B 给一个 A 类型的数据，返回 A 类型中被用户选中的 field 的 value
    if (!arr || typeof getVal !== 'function') {
      return null;
    }
    const res = {};
    for (let i = 0; i < arr.length; i++) {
      const e = arr[i];
      const val = await getVal(e);
      if (Array.isArray(res[val])) {
        // res.get(val) 是一个 array
        res[val].push(e);
      } else {
        res[val] = [e];
      }
    }
    return res;
  }

  MapGet(map, key) {
    if (isObject(map)) {
      if (!map.hasOwnProperty(key)) {
        return null;
      }
      const value = map[key];
      return typeof value === 'undefined' ? null : value;
    }
  }

  MapPut(map, key, value) {
    if (isObject(map)) {
      if (typeof this.helpers.put === 'function') {
        this.helpers.put(map, key, value);
        return;
      }

      set(map, key, value);
    }
  }

  MapRemove(map, key) {
    if (isObject(map)) {
      if (typeof this.helpers.delete === 'function') {
        this.helpers.delete(map, key);
        return;
      }
      delete map[key];
    }
  }

  MapContains(map, key) {
    if (isObject(map)) {
      return map.hasOwnProperty(key);
    }
    return false;
  }

  MapKeys(map) {
    if (isObject(map)) {
      return Object.keys(map);
    }
    return 0;
  }

  MapValues(map) {
    if (!isObject(map)) {
      return [];
    }
    if ('values' in Object) {
      return Object.values(map);
    } else {
      const res = [];
      for (const key in map) {
        // @ts-ignore
        if (Object.hasOwnProperty.call(map, key)) {
          res.push(map[key]);
        }
      }
      return res;
    }
  }

  MapFilter(map, by) {
    if (!isObject(map) || typeof by !== 'function') {
      return null;
    }
    const res = {};
    for (const [k, v] of Object.entries(map)) {
      if (by(k, v)) {
        res[k] = v;
      }
    }
    return res;
  }

  async MapFilterAsync(map, by) {
    if (!isObject(map) || typeof by !== 'function') {
      return null;
    }
    const res = {};
    for (const [k, v] of Object.entries(map)) {
      if (await by(k, v)) {
        res[k] = v;
      }
    }
    return res;
  }

  MapTransform(map, toKey, toValue) {
    if (!isObject(map) || typeof toKey !== 'function' || typeof toValue !== 'function') {
      return null;
    }
    const res = {};
    for (const [k, v] of Object.entries(map)) {
      res[toKey(k, v)] = toValue(k, v);
    }
    return res;
  }

  async MapTransformAsync(map, toKey, toValue) {
    if (!isObject(map) || typeof toKey !== 'function' || typeof toValue !== 'function') {
      return null;
    }
    const res = {};
    for (const [k, v] of Object.entries(map)) {
      res[await toKey(k, v)] = await toValue(k, v);
    }
    return res;
  }

  ListToMap(arr, toKey, toValue) {
    if (!Array.isArray(arr) || typeof toKey !== 'function' || typeof toValue !== 'function') {
      return null;
    }
    const res = {};
    for (let i = arr.length - 1; i >= 0; i--) {
      const e = arr[i];
      if (toKey(e) !== undefined) {
        res[toKey(e)] = toValue(e);
      }
    }

    return res;
  }

  async ListToMapAsync(arr, toKey, toValue) {
    if (!Array.isArray(arr) || typeof toKey !== 'function' || typeof toValue !== 'function') {
      return null;
    }
    const res = {};
    for (let i = arr.length - 1; i >= 0; i--) {
      const e = arr[i];
      const key = await toKey(e);
      if (key !== undefined) {
        res[key] = await toValue(e);
      }
    }
    return res;
  }

  ListReverse(arr) {
    if (Array.isArray(arr)) {
      arr.reverse();
    }
    return arr;
  }

  ListSort(arr, ...callbacks) {
    if (!Array.isArray(arr) || !Array.isArray(callbacks)) return arr;
    return arr.sort((a, b) => {
      if (typeof a === 'object' && typeof b === 'object') {
        for (let cb of callbacks) {
          const { by: valueA, asc } = cb(a);
          const { by: valueB } = cb(b);
          if (valueA !== valueB) {
            return sortRule(valueA, valueB, asc);
          }
        }
        return 0;
      } else {
        const cb = callbacks[callbacks.length - 1];
        const { by: valueA, asc } = cb(a);
        const { by: valueB } = cb(b);
        if (valueA !== valueB) {
          return sortRule(valueA, valueB, asc);
        }
        return 0;
      }
    });
  }

  async ListSortAsync(arr, ...callbacks) {
    if (!Array.isArray(arr) || !Array.isArray(callbacks)) return arr;

    const list = await Promise.all(
      arr.map(async (item) => {
        const criteria = await Promise.all(callbacks.map((cb) => cb(item)));
        return { item, criteria };
      }),
    );

    list.sort((a, b) => {
      if (typeof a?.item === 'object' && typeof b?.item === 'object') {
        for (let i = 0; i < callbacks.length; i++) {
          const { by: byA, asc: ascA } = a.criteria[i];
          const { by: byB } = b.criteria[i];
          if (byA !== byB) {
            return sortRule(byA, byB, ascA);
          }
        }
        return 0;
      } else {
        const index = callbacks.length - 1;
        const { by: byA, asc: ascA } = a.criteria[index];
        const { by: byB } = b.criteria[index];
        if (byA !== byB) {
          return sortRule(byA, byB, ascA);
        }
      }
    });
    const result = list.map(({ item }) => item);
    arr.splice(0, arr.length, ...result);
    return result;
  }

  ListFindAll(arr, callback) {
    if (Array.isArray(arr)) {
      if (typeof callback === 'function') {
        return arr.filter(callback);
      }
    }
  }

  ListDistinct(arr) {
    if (Array.isArray(arr)) {
      const map = new Map();
      let i = 0;
      while (i < arr.length) {
        if (map.get(arr[i])) {
          arr.splice(i, 1);
          i--;
        } else {
          map.set(arr[i], true);
        }
        i++;
      }
    }
    return arr;
  }

  // 随着 PageOf 失效，可删除
  ListSliceToPageOf(arr, page, size) {
    if (Array.isArray(arr) && page) {
      const start = (page - 1) * size;
      const end = start + size;
      const content = arr.slice(start, end);
      const total = arr.length;
      const totalPages = Math.ceil(total / size);
      return {
        content,
        number: page,
        size,
        numberOfElements: content.length,
        totalPages,
        totalElements: total,
        last: page === totalPages,
        first: page === 1,
        empty: total,
      };
    }
  }

  SliceToListPage<T>(arr: T[], page: number, size: number): { list: T[]; total: number } {
    if (Array.isArray(arr) && page) {
      const start = (page - 1) * size;
      const end = start + size;
      const list = arr.slice(start, end);
      const total = arr.length;
      return { list, total };
    } else {
      return { list: [], total: 0 };
    }
  }

  CurrDate(tz = 'global') {
    const localDate = convertJSDateInTargetTimeZone(new Date(), tz);
    return moment(localDate).format('YYYY-MM-DD');
  }

  CurrTime(tz = 'global') {
    const localDate = convertJSDateInTargetTimeZone(new Date(), tz);
    return moment(localDate).format('HH:mm:ss');
  }

  CurrDateTime(tz = 'global') {
    const localDate = convertJSDateInTargetTimeZone(new Date(), tz);
    return localDate.toJSON();
  }

  AddDays(date = new Date(), amount = 1, converter = 'json') {
    return toValue.call(this, addDays(safeNewDate(date), amount), converter);
  }

  AddMonths(date = new Date(), amount = 1, converter = 'json') {
    /** 传入的值为标准的时间格式 */
    return toValue.call(this, addMonths(safeNewDate(date), amount), converter);
  }

  SubDays(date = new Date(), amount = 1, converter = 'json') {
    return toValue.call(this, subDays(safeNewDate(date), amount), converter);
  }

  // 兼容性策略：老应用升级到 3.10，保持老行为不变
  GetDateCountOld(dateStr, metric, tz?) {
    let date;
    if (isInputValidNaslDateTime(dateStr) && !tz) {
      // v3.3 老应用升级的场景，使用全局配置（全局配置一般默认是‘用户时区’）
      // v3.4 新应用，使用默认时区时选项，tz 为空
      date = convertJSDateInTargetTimeZone(dateStr, getAppTimezone('global'));
    } else if (isInputValidNaslDateTime(dateStr) && tz) {
      // v3.4 新应用，指定了默认值之外的时区选项，必然有时区参数 tz
      date = convertJSDateInTargetTimeZone(dateStr, tz);
    } else {
      // 针对 nasl.Date 类型
      date = naslDateToLocalDate(dateStr);
    }

    const [metric1, metric2] = metric.split('-');
    // 获取当年的最后一天的所在周会返回1，需要额外判断一下
    function getCurrentWeek(value) {
      let count = getWeek(value, { weekStartsOn: 1 });
      if (value.getMonth() + 1 === 12 && count === 1) {
        count = getWeek(addDays(value, -7), { weekStartsOn: 1 }) + 1;
      }
      return count;
    }
    switch (metric1) {
      case 'day':
        switch (metric2) {
          case 'week':
            return differenceInDays(date, startOfWeek(date, { weekStartsOn: 1 })) + 1;
          case 'month':
            return getDate(date);
          case 'quarter':
            return differenceInDays(date, startOfQuarter(date)) + 1;
          case 'year':
            return getDayOfYear(date);
        }
      case 'week':
        switch (metric2) {
          case 'month':
            return getWeekOfMonth(date);
          case 'quarter':
            return getCurrentWeek(date) - getWeek(startOfQuarter(date)) + 1;
          case 'year':
            return getCurrentWeek(date);
        }
      case 'month':
        switch (metric2) {
          case 'quarter':
            return getMonth(date) + 1 - (getQuarter(date) - 1) * 3;
          case 'year':
            return getMonth(date) + 1;
        }
      case 'quarter':
        return getQuarter(date);
      default:
        return null;
    }
  }

  GetDateCount(dateStr, metric, tz?) {
    let date;
    if (isInputValidNaslDateTime(dateStr) && !tz) {
      // v3.3 老应用升级的场景，使用全局配置（全局配置一般默认是‘用户时区’）
      // v3.4 新应用，使用默认时区时选项，tz 为空
      date = convertJSDateInTargetTimeZone(dateStr, getAppTimezone('global')); // date : Date
    } else if (isInputValidNaslDateTime(dateStr) && tz) {
      // v3.4 新应用，指定了默认值之外的时区选项，必然有时区参数 tz
      date = convertJSDateInTargetTimeZone(dateStr, tz);
    } else {
      // 针对 nasl.Date 类型
      date = naslDateToLocalDate(dateStr);
    }

    const [metric1, metric2] = metric.split('-');
    // 获取当年的最后一天的所在周会返回1，需要额外判断一下
    function getCurrentWeek(value) {
      let count = getWeek(value, { weekStartsOn: 1 });
      if (value.getMonth() + 1 === 12 && count === 1) {
        count = getWeek(addDays(value, -7), { weekStartsOn: 1 }) + 1;
      }
      return count;
    }
    switch (metric1) {
      case 'day':
        switch (metric2) {
          case 'week':
            return differenceInDays(date, startOfWeek(date, { weekStartsOn: 1 })) + 1;
          case 'month':
            return getDate(date);
          case 'quarter':
            return differenceInDays(date, startOfQuarter(date)) + 1;
          case 'year':
            return getDayOfYear(date);
        }
      case 'week':
        switch (metric2) {
          case 'month': {
            // 构造 date 所在月的第一天
            const startOfMonth = new Date(moment(date).startOf('month').format('YYYY-MM-DD hh:mm:ss'));
            // 获取该天是周几
            let wod = startOfMonth.getDay(); // 以为返回 1-7，实际返回 0-6；0 是星期天
            wod = wod === 0 ? 7 : wod;

            const daysOfFirstWeek = 7 - wod + 1;
            if (date.getDate() <= daysOfFirstWeek) {
              return 1;
            } else {
              return Math.ceil((date.getDate() - daysOfFirstWeek) / 7) + 1;
            }
          }
          case 'quarter':
            return getCurrentWeek(date) - getWeek(startOfQuarter(date)) + 1;
          case 'year':
            return getCurrentWeek(date);
        }
      case 'month':
        switch (metric2) {
          case 'quarter':
            return getMonth(date) + 1 - (getQuarter(date) - 1) * 3;
          case 'year':
            return getMonth(date) + 1;
        }
      case 'quarter':
        return getQuarter(date);
      default:
        return null;
    }
  }

  AlterDateTime(dateString, option, count, unit) {
    const date = safeNewDate(dateString);
    const amount = option === 'Increase' ? count : -count;
    let addDate;
    switch (unit) {
      case 'second':
        addDate = addSeconds(date, amount);
        break;
      case 'minute':
        addDate = addMinutes(date, amount);
        break;
      case 'hour':
        addDate = addHours(date, amount);
        break;
      case 'day':
        addDate = addDays(date, amount);
        break;
      case 'week':
        addDate = addWeeks(date, amount);
        break;
      case 'month':
        addDate = addMonths(date, amount);
        break;
      case 'quarter':
        addDate = addQuarters(date, amount);
        break;
      case 'year':
        addDate = addYears(date, amount);
        break;
    }
    if (typeof dateString === 'object' || isInputValidNaslDateTime(dateString)) {
      return format(addDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    } else {
      return format(addDate, 'yyyy-MM-dd');
    }
  }

  GetSpecificDaysOfWeek(startdatetr, enddatetr, arr, tz?) {
    if (!startdatetr) this.helpers.throwError(`内置函数GetSpecificDaysOfWeek入参错误：startDate不能为空`);
    if (!enddatetr) this.helpers.throwError(`内置函数GetSpecificDaysOfWeek入参错误：endDate不能为空`);
    if (!Array.isArray(arr)) {
      this.helpers.throwError(`内置函数GetSpecificDaysOfWeek入参错误：参数“指定”非合法数组`);
    }

    let startDate;
    let endDate;
    if (isInputValidNaslDateTime(startdatetr) && !tz) {
      // v3.3 老应用升级的场景，使用全局配置（全局配置一般默认是‘用户时区’）
      // v3.4 新应用，使用默认时区时选项，tz 为空
      startDate = convertJSDateInTargetTimeZone(startdatetr, getAppTimezone('global'));
      endDate = convertJSDateInTargetTimeZone(enddatetr, getAppTimezone('global'));
    } else if (isInputValidNaslDateTime(startdatetr) && tz) {
      // v3.4 新应用，指定了默认值之外的时区选项，必然有时区参数 tz
      startDate = convertJSDateInTargetTimeZone(startdatetr, getAppTimezone(tz));
      endDate = convertJSDateInTargetTimeZone(enddatetr, getAppTimezone(tz));
    } else {
      // 针对 nasl.Date 类型
      startDate = naslDateToLocalDate(startdatetr);
      endDate = naslDateToLocalDate(enddatetr);
    }

    if (startDate > endDate) {
      return [];
    }

    const fns = [isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, isSunday];
    const dateInRange = eachDayOfInterval({ start: startDate, end: endDate });
    arr = arr.map((item) => Number(item));
    const isDays = fns.filter((_, index) => arr.includes(index + 1));
    const filtereddate = dateInRange.filter((day) => isDays.some((fn) => fn(day)));
    if (typeof startdatetr === 'object' || startdatetr.includes('T')) {
      return filtereddate.map((date) => moment(date).format('YYYY-MM-DDTHH:mm:ss.SSSZ'));
    } else {
      return filtereddate.map((date) => moment(date).format('YYYY-MM-DD'));
    }
  }

  FormatDate(value, formatter) {
    if (!value) {
      return '-';
    }
    return dateFormatter.format(naslDateToLocalDate(value), formatter);
  }

  FormatTime(value, formatter) {
    if (!value) {
      return '-';
    }
    // 使用正则表达式提取时、分、秒
    const parts = value.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/);

    // 如果没有匹配到三个部分，则返回原始字符串
    if (!parts) {
      return value;
    }

    // 提取时、分、秒，并将它们转换成整数
    let hours = parseInt(parts[1], 10);
    let minutes = parseInt(parts[2], 10);
    let seconds = parseInt(parts[3], 10);

    // 根据需要格式化时、分、秒
    let formattedTime = formatter
      .replace('HH', hours.toString().padStart(2, '0'))
      .replace('H', hours.toString())
      .replace('mm', minutes.toString().padStart(2, '0'))
      .replace('m', minutes.toString())
      .replace('ss', seconds.toString().padStart(2, '0'))
      .replace('s', seconds.toString());
    return formattedTime;
  }

  FormatDateTime(value, formatter, tz = 'global') {
    if (!value) {
      return '-';
    }

    const date = convertJSDateInTargetTimeZone(value, tz);
    return dateFormatter.format(date, formatter);
  }

  Clone(obj) {
    return cloneDeep(obj);
  }

  /**
   * 将内容置空，array 置为 []; object 沿用 ClearObject 逻辑; 其他置为 undefined
   */
  Clear(obj, mode, objType) {
    function clearDeep(obj, seen = new Map()) {
      if (seen.has(obj)) {
        return seen.get(obj);
      }

      seen.set(obj, null);

      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            obj[key] = clearDeep(obj[key], seen);
          } else if (
            Array.isArray(obj[key]) ||
            typeof obj[key] === 'number' ||
            typeof obj[key] === 'string' ||
            typeof obj[key] === 'boolean'
          ) {
            obj[key] = null;
          }
        }
      }

      return obj;
    }

    let isMap = objType && ['nasl.collection.Map', 'nasl.collection.List'].find((t) => objType?.includes(t));
    if (mode && mode === 'deep' && !isMap) {
      return clearDeep(obj);
    }

    if (Array.isArray(obj)) {
      obj.splice(0, obj.length);
    } else if (isObject(obj)) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (isMap) {
            // 不太懂这块的作用
            if (typeof this.helpers.delete === 'function') {
              this.helpers.delete(obj, key);
            } else {
              delete obj[key];
            }
          } else {
            obj[key] = null;
          }
        }
      }
    } else {
      obj = undefined;
    }
    return obj;
  }

  /**
   * 保留 ClearObject，兼容老版本，将某个对象所有字段置为空，一般用于 filter
   */
  ClearObject(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) obj[key] = undefined;
    }
    return obj;
  }

  Merge(obj1, obj2) {
    return Object.assign(obj1, obj2);
  }

  RandomInt(min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }

    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('期望的参数类型为数字');
    }

    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  tryJSONParse(str) {
    let result;

    try {
      result = JSON.parse(str);
    } catch (e) {}

    return result;
  }

  Convert(value, typeAnnotation: Partial<TypeAnnotation>) {
    if (typeAnnotation && typeAnnotation.typeKind === 'primitive') {
      if (typeAnnotation.typeName === 'DateTime') return format(safeNewDate(value), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
      else if (typeAnnotation.typeName === 'Date') return format(safeNewDate(value), 'yyyy-MM-dd');
      else if (typeAnnotation.typeName === 'Time') {
        if (/^\d{2}:\d{2}:\d{2}$/.test(value))
          // 纯时间 12:30:00
          return format(safeNewDate('2022/01/01 ' + value), 'HH:mm:ss');
        else return format(safeNewDate(value), 'HH:mm:ss');
      } else if (typeAnnotation.typeName === 'String') return String(value);
      else if (typeAnnotation.typeName === 'Double' || typeAnnotation.typeName === 'Decimal')
        // 小数
        return parseFloat(String(+value));
      else if (typeAnnotation.typeName === 'Integer' || typeAnnotation.typeName === 'Long')
        // 日期时间格式特殊处理; 整数： format 'int' ; 长整数: format: 'long'
        return /^\d{4}-\d{2}-\d{2}(.*)+/.test(value) ? safeNewDate(value).getTime() : Math.round(+value);
      else if (typeAnnotation.typeName === 'Boolean')
        // 布尔值
        return !!value;
    }

    return value;
  }

  ToString(typeKey, value, tz?) {
    // v3.3 老应用升级的场景，使用全局配置（全局配置一般默认是‘用户时区’）
    // v3.4 新应用，使用默认时区时选项，tz 为空
    if (typeKey === 'nasl.core.DateTime' && !tz) {
      return this.helpers.toString(typeKey, value, 'global');
    } else {
      // v3.4 新应用，指定了默认值之外的时区选项，必然有时区参数 tz
      return this.helpers.toString(typeKey, value, getAppTimezone(tz));
    }
  }

  FromString(value, typeKey) {
    return this.helpers.fromString(value, typeKey);
  }

  /**
   * 数字格式化
   * @param {value} 数字
   * @param {digits} 小数点保留个数
   * @param {omit} 是否省略小数点后无效的0
   * @param {showGroup} 是否显示千位分割（默认逗号分隔）
   * @param {fix} 前缀（prefix）、后缀（suffix）
   * @param {unit} 单位
   */
  FormatNumber(value, digits, omit, showGroup, fix, unit) {
    if (!value) return value;
    if (parseFloat(value) === 0) return '0';
    if (isNaN(parseFloat(value)) || isNaN(parseInt(digits))) return;
    if (digits !== undefined) {
      value = new Decimal(value).toFixed(parseInt(digits));
      if (omit) {
        value = parseFloat(value) + ''; // 转字符串
      }
    }
    if (showGroup) {
      const temp = ('' + value).split('.');
      const right = temp[1];
      let left = temp[0]
        .split('')
        .reverse()
        .join('')
        .match(/(\d{1,3})/g)
        .join(',')
        .split('')
        .reverse()
        .join('');
      if (temp[0][0] === '-') left = '-' + left;
      if (right) left = left + '.' + right;
      value = left;
    }
    if (fix && unit) {
      switch (fix) {
        case 'prefix':
          value = unit + value;
          break;
        case 'suffix':
          value = value + unit;
          break;
        default:
          value = value + unit;
          break;
      }
    }
    return '' + value;
  }

  /**
   * 百分数格式化
   * @param {digits} 小数点保留个数
   * @param {omit} 是否隐藏末尾零
   * @param {showGroup} 是否显示千位分割（默认逗号分隔）
   */
  FormatPercent(value, digits, omit, showGroup) {
    if (parseFloat(value) === 0) return '0%';
    if (!value) return value;
    if (isNaN(parseFloat(value)) || isNaN(parseInt(digits))) return;
    value = value * 100;
    if (digits !== undefined) {
      value = Number(value).toFixed(parseInt(digits));
      if (omit) {
        value = parseFloat(value) + ''; // 转字符串
      }
    }
    if (showGroup) {
      const temp = ('' + value).split('.');
      const right = temp[1];
      let left = temp[0]
        .split('')
        .reverse()
        .join('')
        .match(/(\d{1,3})/g)
        .join(',')
        .split('')
        .reverse()
        .join('');
      if (temp[0][0] === '-') left = '-' + left;
      if (right) left = left + '.' + right;
      value = left;
    }
    return value + '%';
  }

  /**
   * 时间差
   * @param {dateTime1} 时间
   * @param {dateTime2} 时间
   * @param {calcType} 计算类型：年(y)、季度(q)、月(M)、星期(w)、天数(d)、小时数(h)、分钟数(m)、秒数(s)
   */
  DateDiff(dateTime1, dateTime2, calcType, isAbs = true) {
    if (!dateTime1) this.helpers.throwError(`内置函数DateDiff入参错误：dateTime1不能为空`);
    if (!dateTime2) this.helpers.throwError(`内置函数DateDiff入参错误：dateTime2不能为空`);
    // Time
    const timeReg = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
    if (timeReg.test(dateTime1) && timeReg.test(dateTime2)) {
      dateTime1 = `1970/01/01 ${dateTime1}`;
      dateTime2 = `1970/01/01 ${dateTime2}`;
    }
    if (!isValid(safeNewDate(dateTime1)) || !isValid(safeNewDate(dateTime2))) return;
    const map = {
      y: differenceInYears,
      q: differenceInQuarters,
      M: differenceInMonths,
      w: differenceInWeeks,
      d: differenceInDays,
      h: differenceInHours,
      m: differenceInMinutes,
      s: differenceInSeconds,
    };
    if (!map[calcType]) return;
    const method = map[calcType];
    const diffRes = method(safeNewDate(dateTime2), safeNewDate(dateTime1));
    return isAbs ? Math.abs(diffRes) : diffRes;
  }

  // 时区转换
  ConvertTimezone(dateTime, tz) {
    if (!dateTime) {
      this.helpers.throwError(`内置函数ConvertTimezone入参错误：指定日期为空`);
    }
    if (!isValid(safeNewDate(dateTime))) {
      this.helpers.throwError(`内置函数ConvertTimezone入参错误：指定日期不是合法日期类型`);
    }
    if (!isValidTimezoneIANAString(tz)) {
      this.helpers.throwError(`内置函数ConvertTimezone入参错误：传入时区${tz}不是合法时区字符`);
    }

    const result = formatInTimeZone(dateTime, tz, "yyyy-MM-dd'T'HH:mm:ssxxx");
    return result;
  }

  /**
   * 字符串查找
   * @param {string} str 字符串
   * @param {string} search 查找字符串
   * @param {number} fromIndex 开始位置
   * @param {boolean} ignoreCase 是否忽略大小写
   * @returns {number} 查找到的位置，没找到返回-1
   */
  IndexOf(str, search, fromIndex, ignoreCase) {
    if (typeof str !== 'string' || typeof search !== 'string') {
      return -1;
    }
    if (fromIndex === undefined || fromIndex < 0 || fromIndex % 1 !== 0) {
      fromIndex = 0;
    }
    if (ignoreCase) {
      str = str.toLowerCase();
      search = search.toLowerCase();
    }
    return str.indexOf(search, fromIndex);
  }

  /**
   * 倒序字符串查找
   * @param {string} str 字符串
   * @param {string} search 查找字符串
   * @param {boolean} ignoreCase 是否忽略大小写
   * @returns {number} 查找到的位置，没找到返回-1
   */
  LastIndexOf(str, search, ignoreCase) {
    if (typeof str !== 'string' || typeof search !== 'string') {
      return -1;
    }
    if (ignoreCase) {
      str = str.toLowerCase();
      search = search.toLowerCase();
    }
    return str.lastIndexOf(search);
  }

  /**
   * 注意是 ReplaceAll
   * @param {string} str 字符串
   * @param {string} search 查找字符串
   * @param {string} replace 替换字符串
   * @returns {string} 替换后的字符串
   */
  Replace(str: string, search: string | RegExpLike, replace: string) {
    // str必须是字符串类型
    if (typeof str !== 'string') {
      return str;
    }

    if (typeof search !== 'string' && !isDefRegExp(search)) {
      return str;
    }

    let pattern, flags;

    // search 字符串或者正则表达式
    if (typeof search === 'string') {
      pattern = search.replace(/([/,!\\^${}[\]().*+?|<>\-&])/g, '\\$&');
      flags = 'g';
    } else if (isDefRegExp(search)) {
      pattern = search.pattern;
      flags = search.flags;
    }

    // replace 中的 $ 符号需要转义
    replace = replace.replace(/\$/g, '$$$$');
    return str.replace(new RegExp(pattern, flags), replace);
  }

  /**
   * 正则表达式匹配
   * @param str
   * @param reg
   * @return {array} 匹配结果数组
   */
  MatchRegex(str: string, reg: RegExpLike) {
    // 检查参数类型
    if (typeof str !== 'string') {
      return [];
    }

    if (!isDefRegExp(reg)) {
      return [];
    }

    const pattern = reg.pattern;
    const flags = reg.flags;

    const regex = new RegExp(pattern, flags);

    let matches = [];
    let match = undefined;
    let index = undefined;
    let error = undefined;
    while ((match = regex.exec(str))) {
      if (index === regex.lastIndex) {
        error = {
          id: 'infinite',
          warning: true,
        };
        ++regex.lastIndex;
      }
      index = regex.lastIndex;

      matches.push(match?.[0]);

      if (!regex.global) {
        break;
      }
    }

    return matches;
  }

  /**
   *
   * @param {string} str 字符串
   * @param {number} start 开始位置
   * @param {number} length 长度
   * @returns {string} 截取后的字符串
   */
  SubString(str, start, length) {
    if (typeof str !== 'string') {
      return str;
    }
    if (start !== undefined && (start < 0 || start % 1 !== 0)) {
      start = 0;
    }
    if (length !== undefined && (length < 0 || length % 1 !== 0)) {
      length = 0;
    }
    return str.substr(start, length);
  }

  // 随着 PageOf 失效，可删除
  /**
   * List<T> 转换为 PageOf<T>
   * @param {List<T>} list 集合
   * @param {number} page 页数
   * @param {number} size 每页条数
   * @param {number} total 总数
   * @returns {PageOf<T>}
   */
  CreatePageOf(list, page, size, total) {
    const totalPages = Math.ceil(total / size);
    return {
      content: list,
      number: page,
      size,
      numberOfElements: list.length,
      totalPages,
      totalElements: total,
      last: page === totalPages,
      first: page === 1,
      empty: total,
    };
  }

  /**
   * List<T> 转换为 { list: List<T>, total: Integer }
   * @param {List<T>} list 集合
   * @param {number} total 总数
   * @returns {list: List<T>, total: Integer}
   */
  CreateListPage(list, total) {
    return { list, total };
  }

  /**
   * @param {number} value 内容
   * @param {string} mode 方式
   * @returns {number} 返回值
   */
  Round(value, mode) {
    const modeMap = {
      TowardsZero: Decimal.ROUND_DOWN,
      TowardsInfinity: Decimal.ROUND_UP,
      HalfUp: Decimal.ROUND_HALF_UP,
    };

    if (!value) {
      console.warn('Round 函数的 value 参数不能为空:', value);
      return 0;
    }

    return Number(new Decimal(value).toFixed(0, modeMap[mode]));
  }

  /**
   * 空值判断（与）
   * @param {Object[]} values 值
   * @returns {boolean} 返回值
   */
  HasValue(...values) {
    const hasValue = (value, typeKey) => {
      const typeDefinition = this.helpers.typeDefinitionMap[typeKey] || {};

      if (['nasl.core.Null'].includes(typeKey) || value === undefined || value === null) {
        return false;
      }
      if (['nasl.core.Boolean'].includes(typeKey) || value === true || value === false) {
        return true;
      }
      if (['nasl.core.DateTime'].includes(typeKey)) {
        return !!value;
      }
      if (isDefString(typeKey)) {
        return String(value).trim() !== '';
      }
      if (isDefNumber(typeKey)) {
        if ([''].includes(value)) {
          return false;
        }
        return !isNaN(Number(value));
      }
      if (isDefList(typeDefinition)) {
        return Array.isArray(value) && value.length > 0;
      }
      if (isDefMap(typeDefinition)) {
        return Object.keys(value).length > 0;
      }

      if (value === null || value === undefined) {
        return false;
      }

      if (typeof value === 'string') {
        return value.trim() !== '';
      }

      if (typeof value === 'number') {
        return !isNaN(value);
      }

      if (Array.isArray(value)) {
        return value && value.length > 0;
      }

      // structure/entity
      return !Object.keys(value).every((key) => {
        const v = value[key];

        // 空数组
        if (Array.isArray(v)) {
          return v.length === 0;
        }

        // 空对象
        if (typeof v === 'object' && v !== null) {
          return Object.keys(v).length === 0;
        }

        return v === null || v === undefined;
      });
    };

    let isValid = true;

    for (let i = 0; i < values.length; i += 1) {
      const { value, type } = values[i] || {};

      if (!hasValue(value, type)) {
        isValid = false;
        break;
      }
    }

    return isValid;
  }

  Ceil(x: number): number {
    x = +x;

    if (isNaN(x)) {
      throw new Error('SystemIllegalArgumentError');
    }

    return Math.ceil(x);
  }

  Floor(x: number): number {
    x = +x;

    if (isNaN(x)) {
      throw new Error('SystemIllegalArgumentError');
    }

    return Math.floor(x);
  }

  Trunc(x: number): number {
    x = +x;

    if (isNaN(x)) {
      throw new Error('SystemIllegalArgumentError');
    }

    return Math.trunc(x);
  }

  TruncDivide(x: number, y: number): number {
    x = +x;
    y = +y;

    if (isNaN(x) || isNaN(y)) {
      throw new Error('SystemIllegalArgumentError');
    }

    if (y === 0) {
      throw new Error('SystemArithmeticError');
    }

    // 余数
    const rest = x % y;

    return (x - rest) / y;
  }

  Abs(x: number): number {
    x = +x;

    if (isNaN(x)) {
      throw new Error('SystemIllegalArgumentError');
    }

    return Math.abs(x);
  }

  Pow(x: number, y: number): number {
    x = +x;
    y = +y;

    if (isNaN(x) || isNaN(y)) {
      throw new Error('SystemIllegalArgumentError');
    }

    return Math.pow(x, y);
  }

  Sqrt(x: number): number {
    x = +x;

    if (isNaN(x)) {
      throw new Error('SystemIllegalArgumentError');
    }

    return Math.sqrt(x);
  }

  Cbrt(x: number): number {
    x = +x;

    if (isNaN(x)) {
      throw new Error('SystemIllegalArgumentError');
    }

    return Math.cbrt(x);
  }

  Log(x: number): number {
    x = +x;

    if (isNaN(x)) {
      throw new Error('SystemIllegalArgumentError');
    }

    return Math.log(x);
  }

  PadStart(str: string, targetLength: number, padString?: string) {
    if (typeof str !== 'string') {
      return str;
    }

    return str.padStart(targetLength, padString);
  }

  PadEnd(str: string, targetLength: number, padString?: string) {
    if (typeof str !== 'string') {
      return str;
    }

    return str.padEnd(targetLength, padString);
  }

  TrimStart(str: string) {
    if (typeof str !== 'string') {
      return str;
    }

    return str.trimStart();
  }

  TrimEnd(str: string) {
    if (typeof str !== 'string') {
      return str;
    }

    return str.trimEnd();
  }
}
