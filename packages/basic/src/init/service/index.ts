import { isPlainObject } from 'lodash';

import { createService, initNativeRequestInterceptors } from '../../utils';
import Global from '../../global';
import Config from '../../config';

let $services;

function initService(
  options: {
    servicesMap?: Record<string, any>;
  } = {},
) {
  // 初始化原生请求拦截器，使 axios hooks 也能作用于 fetch 和 XMLHttpRequest
  if (window.$axiosHookManager && (window.$axiosHookManager.requestHooks || window.$axiosHookManager.responseHooks)) {
    initNativeRequestInterceptors();
  }

  const services = Object.assign({}, options.servicesMap);
  const keys = Object.keys(services);

  keys.forEach((key) => {
    if ($services && $services[key]) {
      throw new Error('services repeat:' + key);
    }

    const service = services[key];

    if (isPlainObject(service)) {
      services[key] = createService(service);
    }
  });

  if (keys.length) {
    $services = Object.assign({}, Config.globalProperties.get('$services'), services);

    Config.globalProperties.set('$services', $services);
  }

  return {
    services: $services,
  };
}

export { initService };
