import { setConfig as setCommonConfig } from '@/common'

import { utils } from './plugins/dataTypes/index'
import { destination, back, go } from './plugins/router'

export function setConfig(options = {}) {
  const { app } = options

  return setCommonConfig({
    app,
    globalProperties: {
      set(key, value) {
        window[key] = value
        app.config.globalProperties[key] = value
      },
      get(key) {
        return app.config.globalProperties[key]
      },
    },
    toast: {
      show(msg) {
        console.log(msg)
      },
      error(msg) {
        console.error(msg)
      },
    },
    router: {
      destination,
      back,
      go,
    },
    utils: {
      ...utils(app),
    },
    configureRequest(options) {
      /**
       * options配置参考
       * https://axios-http.com/zh/docs/req_config
       */
      // 修改请求baseURL
      // options.baseURL = 'https://some-domain.com/api';
      // 增加额外的请求头
      // options.headers = {
      //     ...(options.headers || {}),
      //     key1: 'value1',
      // }
      // 增加额外的请求参数（带在请求链接上）
      // options.params = {
      //     ...(options.params || {}),
      //     key2: 'value2',
      // };
      // 增加额外的请求参数（带在请求体上）
      // options.data = {
      //     ...(options.data || {}),
      //     key3: 'value3',
      // }
    },
  })
}
