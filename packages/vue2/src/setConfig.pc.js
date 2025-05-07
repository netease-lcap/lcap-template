import Vue from 'vue';
import { setConfig } from '@/common';

import { utils } from './plugins/dataTypes/index';
import { destination, back, go } from './plugins/router';
import { createRouter } from './router';

setConfig({
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
  router: {
    destination,
    back,
    go,
    createRouter,
  },
  utils: {
    ...utils,
    showMessage(msg) {
      if (typeof Vue.prototype?.$toast?.show === 'function') {
        return Vue.prototype.$toast.show(msg);
      }

      console.warn('请在Vue.prototype上挂载$toast.show方法');
    },
  },
  reactive: (obj) => {
    return new Vue({
      data: {
        obj,
      },
    });
  },
  globalProperties: {
    set(key, value) {
      window[key] = value;
      Vue.prototype[key] = value;
    },
    get(key) {
      return Vue.prototype[key];
    },
  },
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
