import { setConfig as setCommonConfig } from '@/common';

import { utils } from './plugins/data-types/index';
import { destination, back, go } from './plugins/router';

export function setConfig(options = {}) {
  const { app } = options;

  return setCommonConfig({
    app,
    globalProperties: {
      set(key, value) {
        window[key] = value;
        app.config.globalProperties[key] = value;
      },
      get(key) {
        return app.config.globalProperties[key];
      },
    },
    toast: {
      show(msg) {
        app.config.globalProperties.$message?.info?.(msg);
      },
      error(msg) {
        app.config.globalProperties.$message?.error?.(msg);
      },
    },
    router: {
      destination,
      back,
      go,
    },
    utils: {
      ...utils(app),
      showMessage(msg) {
        app.config.globalProperties.$message?.info?.(msg);
      },
    },
    configureRequest(_options) {
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
}
