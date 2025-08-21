/**
 * 低代码平台全局类型声明
 * 
 * 本文件定义了低代码平台中所有全局可用的类型、接口和扩展
 * 
 * @fileoverview 全局类型定义文件
 * @author LCAP Team
 */

import type { ComponentOptions } from 'vue';
import type { Route, RouteConfig } from 'vue-router';

/**
 * Window 对象的扩展接口
 * 定义了低代码平台在 Window 对象上添加的所有属性和方法
 * 
 * @group Window Extensions
 */
export interface WindowExtensions {
  /** Vue.js 应用实例 */
  appVue: typeof import('vue').default;
  
  /** Vue.js 构造函数 */
  Vue: typeof import('vue').default;
  
  /** Vue Router 实例 */
  VueRouterInstance: typeof import('vue-router').default;

  // ============ 生命周期事件 ============
  
  /** 应用渲染完成事件 */
  rendered: () => Promise<void>;
  
  /** 路由跳转前事件 */
  beforeRouter: (event: BeforeRouterEvent) => Promise<void>;
  
  /** 路由跳转后事件 */
  afterRouter: (to: Route, from: Route) => Promise<void>;
  
  /** 请求发送前事件 */
  preRequest: (event: PreRequestEvent, data: any) => Promise<any>;
  
  /** 请求完成后事件 */
  postRequest: (event: PostRequestEvent) => Promise<void>;

  // ============ 平台配置 ============
  
  /** 应用和平台配置信息 */
  appInfo: AppConfig & PlatformConfig;

  // ============ 全局服务 ============
  
  /** 全局状态和方法 */
  $global: LcapGlobal;
  
  /** 全局混入对象 */
  $mixins: LcapMixins;
  
  /** 业务逻辑服务集合 */
  $logics: Record<string, LcapService>;
  
  /** API 服务集合 */
  $service: Record<string, LcapService>;
  
  /** 权限服务 */
  $auth: LcapAuth;
  
  /** 工具函数集合 */
  $utils: LcapUtils;
  
  /** 从 Schema 生成初始化数据的函数 */
  $genInitFromSchema: GenInitFromSchema;
  
  /** 国际化实例 */
  $i18n: typeof import('vue-i18n').default;
  
  /** 页面跳转函数 */
  $destination: (url: string, target?: string, replace?: boolean) => void;
  
  /** 链接跳转函数 */
  $link: (url: string, target?: string) => void;

    $sleep: (ms: number) => Promise<void>;

  
  // ============ 微前端支持 ============
  
  /** 微前端配置（可选） */
  LcapMicro?: {
    /** 路由前缀 */
    routePrefix: string;
    /** 容器元素 */
    container: HTMLElement;
  }
}

/**
 * 全局类型扩展声明
 */
declare global {
  interface Window extends WindowExtensions {}
}

/**
 * 国际化配置信息
 * 
 * @group Platform Types
 */
export type I18nInfo = {
  locale: string;
  currentLocale: string;
  localeName: string;
  messages: Record<string, string>;
  enabled: boolean;
  I18nList: { id: string; name: string; }[];
};

export type AppConfig = {
  project: string;
  domainName: string;
  extendedConfig: Record<string, any>;
  envConfig: {
    lowcodeDomain: string;
    [key: string]: any;
  };
  tenant: string;
  i18nInfo: I18nInfo;

};

export type PlatformConfig = {
  appConfig: AppConfig;
  dnsAddr: string;
  tenant: string;
  documentTitle: string | null;
  documentIcon: string | null;
  env: string;
  hasUserCenter: boolean;
  hasAuth: boolean;
  authResourcePaths: string[];
  baseResourcePaths: string[];
  basePath: string;
  sysPrefixPath: string;
  frontendName: string;
};

export type UserResource = {
  resourceType: string;
  resourceValue: string;
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';

export type BeforeRouterEvent = {
  router: typeof import('vue-router').default;
  routes: RouteConfig[];
  to: Route;
  from: Route;
  next: (vm: typeof import('vue').default) => Promise<void>;
  authResourcePaths: string[];
  baseResourcePaths: string[];
  appConfig: AppConfig;
  parsePath: (path: string) => { path: string; query: string; hash: string };
  getBasePath: () => string;
  filterAuthResources: (resources: Array<UserResource>) => Array<UserResource>;
  findNoAuthView: (routes: RouteConfig[]) => RouteConfig | undefined;
  filterRoutes: (routes: RouteConfig[], ancestorPaths: string[], compareFn: (route: RouteConfig, ancestorPaths: string[]) => boolean) => RouteConfig[];
}

export type RequestInfo = {
    config: {
      serviceType: string;
      noErrorTip?: boolean;
      errorMessage?: string;
    },
    url: {
      method: Method;
      path: string;
      headers: Record<string, string>;
      body: Record<string, any>;
      query: Record<string, any>;
    }
  }

export type PostRequestEvent = {
  response: {
    status: string;
    body: string;
    headers: Record<string, string>;
    cookies: Record<string, { name: string, value: string }>;
  };
  requestInfo: RequestInfo;
  status: string;
  body: string;
  headers: Record<string, string>;
  cookies: Record<string, { name: string, value: string }>;
}

export type PreRequestEvent = {
  requestURI: string;
  requestMethod: string;
  body: string;
  headers: Record<string, string>;
  querys: string;
  cookies: Record<string, { name: string, value: string }>;
  requestInfo: RequestInfo;
}

export type UserInfo = {
  DisplayName: string;
  Email?: string;
  NickName?: string;
  Phone?: string;
  Result: boolean;
  UserId: string;
  UserName: string;
}

export type LcapGlobal = {
  userInfo: UserInfo;
  i18nInfo: I18nInfo;

  requestFullscreen(): void;
  exitFullscreen(): void;
  back(): void;
  go(delta: number): void;
  add(x: number, y: number): number;
  minus(x: number, y: number): number;
  multiply(x: number, y: number): number;
  divide(x: number, y: number): number;
  isEqual(x: any, y: any): boolean;
  getCustomConfig<T>(key: string): Promise<T>;
  getUserLanguage(): string;
  compareKeyboardInput(event: KeyboardEvent, targets: string[]): boolean;
  downloadFile(url: string, filename: string): Promise<void>;
  downloadFiles(urls: string[], filename: string): Promise<void>;
  setI18nLocale(locale: string): void;
  getI18nList(): I18nInfo['I18nList'];
  logout(): void;
}

export type LcapAuth = {
  start: () => void;
  getUserInfo: () => Promise<UserInfo>;
  getUserResources: (domain: string) => Promise<UserResource[]>;
  logout: () => Promise<void>;
  isInit: () => boolean;
  has: (path: string) => boolean;
  _setCustomResources?: (resources: UserResource[]) => void;
}

export type LcapUtils = {
  New: <T>(data: any) => ReturnType<GenInitFromSchema<T>>;
  EnumItemToText: (type: string, value: any) => string;
  EnumItemToStructure: (type: string, value: any) => { text: string, value: number | string };
  JsonSerialize: <T>(data: T) => string;
  JsonDeserialize: <T>(json: string) => T;
  Split(str: string, separator: string, trail?: boolean): string[];
  Join<T>(arr: T[], separator: string): string;
  Concat<T>(...args: T[]): string;
  Length(input: unknown): number | null;
  ToLower(input: string): string;
  ToUpper(input: string): string;
  Trim(input: string): string;
  Get<T>(arr: T[], index: number): T;
  Set<T>(arr: T[], index: number, item: T): T[];
  Contains<T>(arr: T[], item: T): boolean;
  Add<T>(arr: T[], item: T): void;
  AddAll<T>(arr: T[], items: T[]): number;
  Insert<T>(arr: T[], index: number, item: T): void;
  Remove<T>(arr: T[], item: T): void;
  RemoveAt<T>(arr: T[], index: number): T;
  ListHead<T>(arr: T[]): T;
  ListLast<T>(arr: T[]): T;
  ListFlatten<T>(arr: T[]): T[];
  ListTransform<T, U>(arr: T[], callback: (item: T) => U): U[];
  ListTransformAsync<T, U>(arr: T[], callback: (item: T) => Promise<U>): Promise<U[]>;
  ListFilter(arr: any, by: any): any[];
  ListFilterAsync(arr: any, by: any): Promise<any[]>;
  ListSum<T>(arr: T[]): any;
  ListProduct<T>(arr: T[]): any;
  ListAverage<T>(arr: T[]): number;
  ListMax<T>(arr: T[]): any;
  ListMin<T>(arr: T[]): any;
  ListRange(start: number, end: number, step: number): any[];
  ListRepeat<T>(item: T, length: number): any[];
  ListFind<T>(arr: T[], callback: (item: T) => boolean): T;
  ListFindAsync<T>(arr: T[], callback: (item: T) => Promise<boolean>): Promise<any>;
  ListFindIndex<T>(arr: T[], callback: (item: T) => boolean): number;
  ListFindIndexAsync<T>(arr: T[], callback: (item: T) => Promise<boolean>): Promise<number>;
  ListSlice<T>(arr: T[], start: number, end: number): T[];
  ListDistinctBy(arr: any, listGetVal: any): any[];
  ListDistinctByAsync(arr: any, listGetVal: any): Promise<any[]>;
  ListGroupBy(arr: any, getVal: any): {};
  ListGroupByAsync(arr: any, getVal: any): Promise<{}>;
  MapGet(map: any, key: any): any;
  MapPut(map: any, key: any, value: any): void;
  MapRemove(map: any, key: any): void;
  MapContains(map: any, key: any): boolean;
  MapKeys(map: any): 0 | string[];
  MapValues(map: any): any[];
  MapFilter(map: any, by: any): {};
  MapFilterAsync(map: any, by: any): Promise<{}>;
  MapTransform(map: any, toKey: any, toValue: any): {};
  MapTransformAsync(map: any, toKey: any, toValue: any): Promise<{}>;
  ListToMap(arr: any, toKey: any, toValue: any): {};
  ListToMapAsync(arr: any, toKey: any, toValue: any): Promise<{}>;
  ListReverse(arr: any): any;
  ListSort(arr: any, ...callbacks: any[]): any;
  ListSortAsync(arr: any, ...callbacks: any[]): Promise<any>;
  ListFindAll(arr: any, callback: any): any[];
  ListDistinct(arr: any): any;
  CurrDate(tz?: string): string;
  CurrTime(tz?: string): string;
  CurrDateTime(tz?: string): string;
  AddDays(date?: Date, amount?: number, converter?: string): any;
  AddMonths(date?: Date, amount?: number, converter?: string): any;
  SubDays(date?: Date, amount?: number, converter?: string): any;
  GetDateCountOld(dateStr: any, metric: any, tz?: any): number;
  GetDateCount(dateStr: any, metric: any, tz?: any): number;
  AlterDateTime(dateString: any, option: any, count: any, unit: any): string;
  GetSpecificDaysOfWeek(startdatetr: any, enddatetr: any, arr: any, tz?: any): string[];
  FormatDate(value: any, formatter: any): any;
  FormatTime(value: any, formatter: any): any;
  FormatDateTime(value: any, formatter: any, tz?: string): any;
  Clone<T>(obj: T): T;
  Clear(obj: any, mode: any, objType: any): any;
  ClearObject(obj: any): any;
  Merge(obj1: any, obj2: any): any;
  RandomInt(min: any, max: any): number;
  tryJSONParse(str: any): any;
  Convert(value: any, typeAnnotation: Partial<TypeAnnotation>): any;
  ToString(typeKey: any, value: any, tz?: any): any;
  FromString(value: any, typeKey: any): any;
  FormatNumber(value: any, digits: any, omit: any, showGroup: any, fix: any, unit: any): any;
  FormatPercent(value: any, digits: any, omit: any, showGroup: any): any;
  DateDiff(dateTime1: any, dateTime2: any, calcType: any, isAbs?: boolean): any;
  ConvertTimezone(dateTime: any, tz: any): string;
  IndexOf(str: any, search: any, fromIndex: any, ignoreCase: any): any;
  LastIndexOf(str: any, search: any, ignoreCase: any): any;
  Replace(str: any, search: any, replace: any): any;
  SubString(str: any, start: any, length: any): any;
  Round(value: any, mode: any): number;
  HasValue(...values: any[]): boolean;
  Ceil(x: number): number;
  Floor(x: number): number;
  Trunc(x: number): number;
  TruncDivide(x: number, y: number): number;
  Abs(x: number): number;
  Pow(x: number, y: number): number;
  Sqrt(x: number): number;
  Cbrt(x: number): number;
  Log(x: number): number;
  PadStart(str: string, targetLength: number, padString?: string): string;
  PadEnd(str: string, targetLength: number, padString?: string): string;
  TrimStart(str: string): string;
  TrimEnd(str: string): string;
}

export type LcapMixins = {
  localCacheVariableMixin: ComponentOptions;
} 

export type GenInitFromSchema = <T>(type: string, value?: any, parentLevel?: number) => T;

export type LcapService = (request?: {
  config?: {
    [key: string]: any;
  };
  method: Method;
  query?: {
    [key: string]: any;
  };
  body?: {
    [key: string]: any;
  };
  headers?: {
    [key: string]: any;
  };
  path?: {
    [key: string]: string;
  };
}) => Promise<any>;