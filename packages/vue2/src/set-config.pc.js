import Vue from 'vue';
import { setConfig } from '@/common';

import { utils } from './plugins/data-types';
import { destination, back, go } from './plugins/router';

/**
 * 给基础库设置当前平台（PC端）相关特性配置
 */
setConfig({
  // 全局toast
  toast: {
    show(msg) {
      if (typeof Vue.prototype?.$toast?.show === 'function') {
        return Vue.prototype.$toast.show(msg);
      }

      console.warn('请在Vue.prototype上挂载$toast.show方法');
    },
    error(msg) {
      if (typeof Vue.prototype?.$toast?.error === 'function') {
        return Vue.prototype.$toast.error(msg);
      }

      console.warn('请在Vue.prototype上挂载$toast.error方法');
    },
  },
  // 路由跳转
  router: {
    destination,
    back,
    go,
  },
  // 工具函数
  utils: {
    ...utils,
    showMessage(msg) {
      if (typeof Vue.prototype?.$toast?.show === 'function') {
        return Vue.prototype.$toast.show(msg);
      }

      console.warn('请在Vue.prototype上挂载$toast.show方法');
    },
  },
  /**
   * 构造响应式对象
   * 主要给全局变量提供响应式支持
   */
  reactive: (obj) => {
    return new Vue({
      data: {
        obj,
      },
    });
  },
  /**
   * 全局属性设置
   */
  globalProperties: {
    set(key, value) {
      window[key] = value;
      Vue.prototype[key] = value;
    },
    get(key) {
      return Vue.prototype[key];
    },
  },
  /**
   * 自定义配置axios
   * 可覆盖基础库内置的axios配置
   */
  configureRequest(_options, _axios) {
    /**
     * options配置参考
     * https://axios-http.com/zh/docs/req_config
     */
    // 修改请求baseURL
    // _options.baseURL = 'https://some-domain.com/api';
    // 增加额外的请求头
    // _options.headers = {
    //     ...(_options.headers || {}),
    //     key1: 'value1',
    // }
    // 增加额外的请求参数（带在请求链接上）
    // _options.params = {
    //     ...(_options.params || {}),
    //     key2: 'value2',
    // };
    // 增加额外的请求参数（带在请求体上）
    // _options.data = {
    //     ...(_options.data || {}),
    //     key3: 'value3',
    // }
  },
});
