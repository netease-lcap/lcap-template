import _set from 'lodash/set';

// 用来mock Vue的构造函数
// @ts-ignore
const GlobalFn = typeof window.Vue === 'function' ? window.Vue : function MockVue() {};

export default GlobalFn;

export const global = new GlobalFn();
