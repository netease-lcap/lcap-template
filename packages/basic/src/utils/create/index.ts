import axios from 'axios';
import type { AxiosRequestConfig, Method } from 'axios';
import { pick } from 'lodash';

import Service from '../request-pre';
import { formatMicroFrontUrl } from '../../init/router/microFrontUrl'; // 微前端路由方法

import cookie from '../cookie';
import { addConfigs } from './add.configs';
import paramsSerializer from './paramsSerializer';
import { createMockServiceByData } from './mockData';
import { sseRequester } from './sseRequester';

import Config from '../../config';
import { overwriteErrorMsgFieldIfSpecified, formatContentType } from './utils';
import { default as builtInInterceptors } from './interceptors';
import { download } from './download';
import transformRequest from './transform/request';
import transformResponse from './transform/response';

const getData = (str) => new Function('return ' + str)();

const parseCookie = (str) => {
  if (typeof str !== 'string') {
    return {};
  }

  return str
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, v) => {
      const getValue = (s) => {
        try {
          return decodeURIComponent(s?.trim());
        } catch (error) {
          return s?.trim();
        }
      };
      // 有key才保留
      if (getValue(v[0])) {
        acc[getValue(v[0])] = getValue(v[1]);
      }

      return acc;
    }, {});
};

const formatCookie = (cookieStr) => {
  const result = {};
  if (document.cookie.length <= 0) {
    return result;
  }
  const obj = parseCookie(cookieStr);
  Object.keys(obj).forEach((key) => {
    result[key] = {
      name: key,
      value: obj[key],
      domain: '', // 前端只能拿到k v 其他字段补齐即可
      cookiePath: '',
      sameSite: '',
      httpOnly: '',
      secure: '',
      maxAge: '',
    };
  });
  return result;
};

function formatCallConnectorPath(path: string, connectionName: string): string {
  const sysPrefixPath = window.appInfo?.sysPrefixPath;
  if (sysPrefixPath) {
    path = path?.replace(sysPrefixPath, '');
  }

  // /api/connectors/connector1/namespace1/getA
  const pathItemList = (path || '').split('/').filter((i) => i);
  if (pathItemList.length < 3) {
    throw Error('unexpected path when use CallConnector');
  }
  const [prefix1, prefix2, connectorName, ...rt] = pathItemList;
  return `${sysPrefixPath ? sysPrefixPath : ''}/${prefix1}/${prefix2}/${connectorName}/${connectionName}/${rt.join('/')}`;
}

export type RequestInfo = {
  config: {
    connectionName?: string;
    serviceType?: string;
    baseURL?: string;
    withCredentials?: boolean;
    onUploadProgress?: (progressEvent: any) => void;
    onDownloadProgress?: (progressEvent: any) => void;
    handleError?: boolean;
    errorMessage?: string;
  };
  url: {
    path: string;
    method: string;
    body?: Record<string, any>;
    headers?: Record<string, any>;
    query?: Record<string, any>;
  };
};

export function genBaseOptions(requestInfo: RequestInfo): AxiosRequestConfig {
  const { url, config = {} } = requestInfo;
  const { method, body = {}, headers = {}, query = {} } = url;
  const path = formatMicroFrontUrl(url.path);

  const baseURL = config.baseURL ? config.baseURL : '';
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  if (!headers.Authorization && cookie.get('authorization')) {
    headers.Authorization = cookie.get('authorization');
  }
  headers.DomainName = window.appInfo?.domainName;
  if (window.appInfo?.frontendName) headers['LCAP-FRONTEND'] = window.appInfo?.frontendName;
  // 用户本地时区信息，传递给后端
  headers.TimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  let data;
  const method2 = method.toUpperCase() as Method;
  if (Array.isArray(body) || Object.keys(body).length || ['PUT', 'POST', 'PATCH', 'DELETE'].includes(method2)) {
    data = formatContentType(headers['Content-Type'], body);
  }

  return {
    params: query,
    paramsSerializer,
    baseURL,
    method: method2,
    transformRequest: transformRequest(requestInfo),
    transformResponse: transformResponse(requestInfo),
    url: path,
    data,
    headers,
    withCredentials: config.withCredentials ?? !baseURL,
    xsrfCookieName: 'csrfToken',
    xsrfHeaderName: 'x-csrf-token',
    onUploadProgress: typeof config.onUploadProgress === 'function' ? config.onUploadProgress : () => {},
    onDownloadProgress: typeof config.onDownloadProgress === 'function' ? config.onDownloadProgress : () => {},
  };
}

const requester = function (requestInfo) {
  const { url, config = {} } = requestInfo;
  if (!url?.path) {
    throw Error('unexpected url path as', url?.path);
  }
  // 如果参数中存在 connectionName 则认为请求来自于 CallConnector
  const connectionName = config?.connectionName;
  if (connectionName && url) {
    url.path = formatCallConnectorPath(url.path, connectionName);
  }
  if (config.download) {
    return download(url);
  }
  if (config?.serviceType === 'sse') {
    return sseRequester(requestInfo);
  }

  const defaultErrorHandler = (error) => Promise.reject(error);

  // 内置拦截器
  builtInInterceptors.forEach((interceptor) => {
    const { request, response } = interceptor;
    if (request) {
      axios.interceptors.request.use(request.onSuccess, request.onError || defaultErrorHandler);
    }
    if (response) {
      axios.interceptors.response.use(response.onSuccess, response.onError || defaultErrorHandler);
    }
  });

  // 注意：$axiosHookManager 中的 hooks 已通过原生拦截器（fetch/XMLHttpRequest）应用
  // 不需要在 axios 中重复注册，避免重复执行

  const options = genBaseOptions(requestInfo);

  if (typeof window.axiosOptionsSetup === 'function') {
    window.axiosOptionsSetup(options);
  }

  // 自定义请求信息
  if (typeof Config.configureRequest === 'function') {
    Config.configureRequest(options, axios);
  }

  const req = axios(options);

  return req;
};

const service = new Service(requester);
// 注入配置，但是不会默认启用
addConfigs(service);

// 调整请求路径
const adjustPathWithSysPrefixPath = (apiSchemaList) => {
  const newApiSchemaMap = {};
  if (apiSchemaList) {
    for (const key in apiSchemaList) {
      if (!newApiSchemaMap[key]) {
        const { url, ...others } = apiSchemaList[key] || {};
        newApiSchemaMap[key] = {
          url: {
            ...url,
          },
          ...others,
        };
      }
      const newApiSchema = newApiSchemaMap[key];
      const path = newApiSchema?.url?.path;
      const sysPrefixPath = window.appInfo?.sysPrefixPath;
      if (path && path.startsWith('/') && sysPrefixPath) {
        newApiSchema.url.path = sysPrefixPath + path;
      }
    }
  }
  return newApiSchemaMap;
};

export function createService(apiSchemaList, serviceConfig?, dynamicServices?) {
  // 配置兼容空值
  serviceConfig = serviceConfig || {};
  // config 兼容空值
  serviceConfig.config = serviceConfig.config || {};
  Object.assign(serviceConfig.config, {
    formatResponse: true,
    httpCode: true,
    httpError: true,
    shortResponse: true,
    postRequestError: true,

    priority: {
      ...(serviceConfig.config.priority ?? {}),
      formatResponse: 1,
      postRequestError: 10,
    },
  });

  {
    service.postConfig.set('postRequestError', {
      async reject(error, params, requestInfo) {
        error.Code = error.code || error.status;
        const status = 'error';
        const { config } = requestInfo;

        if (!error.response) {
          throw error;
        }

        const { response } = error;

        if (response?.data?.Data) {
          overwriteErrorMsgFieldIfSpecified(response.data.Data, requestInfo?.config?.errorMessage);
        }

        const HttpResponse = {
          status: response.status + '',
          body: JSON.stringify(response.data),
          headers: response.headers,
          cookies: formatCookie(document.cookie),
        };

        let event = {
          response: HttpResponse,
          requestInfo,
          status,
          ...HttpResponse,
        };

        if (typeof window.postRequest === 'function') {
          await window.postRequest(event);
        }

        // 开启handleError时，不抛出错误，返回response
        if (config?.handleError) {
          let body = event?.response?.body || event?.body;
          try {
            error.data = JSON.parse(body);
          } catch (e) {
            // 解析不了则直接返回
            throw error;
          }
          // 此时跳过shortResponse中的兼容操作
          error.skipShortResponseCopy = true;
          error.headers = event?.response?.headers || event?.headers;
          return error;
        }

        throw error;
      },
    });
  }

  const newApiSchemaMap = adjustPathWithSysPrefixPath(apiSchemaList);
  let logicsInstance = service.generator(newApiSchemaMap, dynamicServices, serviceConfig);
  let mockInstance = {};

  if (window.appInfo.isPreviewFe) {
    if (window?.allMockData?.mock) {
      JSON.parse(window?.allMockData?.mock).map((v) => {
        createMockServiceByData(v.name, getData(v.mockData), mockInstance);
      });
      createMockServiceByData('GetUser', {}, mockInstance);
      createMockServiceByData('GetUserResources', {}, mockInstance);
      Object.keys(logicsInstance).map(
        (apiName) => !mockInstance[apiName] && (mockInstance[apiName] = logicsInstance[apiName]),
      );
    }
  } else {
    mockInstance = logicsInstance;
  }
  return mockInstance;
}

export const createLogicService = function createLogicService(apiSchemaList, serviceConfig?, dynamicServices?) {
  // 配置兼容空值
  serviceConfig = serviceConfig || {};
  // config 兼容空值
  serviceConfig.config = serviceConfig.config || {};
  Object.assign(serviceConfig.config, {
    concept: 'Logic',
    formatResponse: true,
    shortResponse: true,
    preRequest: true,
    postRequest: true,
    postRequestError: true,
    lcapLocation: true,

    priority: {
      ...(serviceConfig.config.priority ?? {}),
      formatResponse: 1,
      lcapLocation: 1,
      postRequest: 10,
      postRequestError: 10,
    },
  });

  const newApiSchemaMap = adjustPathWithSysPrefixPath(apiSchemaList);

  if (window.preRequest) {
    service.preConfig.set('preRequest', {
      async resolve(requestInfo, preData) {
        const HttpRequest = {
          requestURI: requestInfo.url.path,
          remoteIp: '',
          requestMethod: requestInfo.url.method,
          body: JSON.stringify(requestInfo.url.body),
          headers: requestInfo.url.headers,
          querys: JSON.stringify(requestInfo.url.query),
          cookies: formatCookie(document.cookie),
          requestInfo,
        };

        let data = preData;
        if (typeof window.preRequest === 'function') {
          data = await window.preRequest(HttpRequest, preData);
        }

        return data || preData;
      },
    });
  }

  if (window.postRequest) {
    service.postConfig.set('postRequest', {
      async resolve(response, params, requestInfo) {
        if (!response) {
          return Promise.reject();
        }

        if (requestInfo?.config?.serviceType === 'sse') {
          return response;
        }

        const status = 'success';
        const { config } = requestInfo;
        const serviceType = config?.serviceType;
        if (serviceType && serviceType === 'external') {
          return response;
        }
        const HttpResponse = {
          status: response.status + '',
          body: JSON.stringify(response.data),
          headers: response.headers,
          cookies: formatCookie(document.cookie),
        };
        let event = {
          response: HttpResponse,
          requestInfo,
          status,
          ...HttpResponse,
        };

        if (typeof window.postRequest === 'function') {
          await window.postRequest(event);
        }

        let body = event?.response?.body || event?.body;
        try {
          response.data = JSON.parse(body);
        } catch (error) {
          response.data = body;
        }
        response.headers = event?.response?.headers || event?.headers;
        return response;
      },
    });
    service.postConfig.set('postRequestError', {
      async reject(error, params, requestInfo) {
        if (requestInfo?.config?.serviceType === 'sse') {
          throw Error('远端调用异常');
        }

        error.Code = error.code || error.status;
        const status = 'error';
        const { config } = requestInfo;

        if (error === 'expired request') {
          throw error;
        }
        if (!error.response) {
          if (!config.noErrorTip) {
            // instance.show('系统错误，请查看日志！');
            Config.toast.error('系统错误，请查看日志！');
            // 得抛错，否则会走成功回调，然后shortResponse会报错
            throw error;
          }
        }
        if (window.LcapMicro?.loginFn) {
          if (error.Code === 401 && error.Message === 'token.is.invalid') {
            window.LcapMicro.loginFn();
            return;
          }
          if (error.Code === 'InvalidToken' && error.Message === 'Token is invalid') {
            window.LcapMicro.loginFn();
            return;
          }
        }
        if (error.Code === 501 && error.Message === 'abort') {
          throw Error('程序中止');
        }

        if (!error.response) {
          throw error;
        }

        const { response } = error;

        if (response?.data?.Data) {
          overwriteErrorMsgFieldIfSpecified(response.data.Data, requestInfo?.config?.errorMessage);
        }

        const HttpResponse = {
          status: response.status + '',
          body: JSON.stringify(response.data),
          headers: response.headers,
          cookies: formatCookie(document.cookie),
        };

        let event = {
          response: HttpResponse,
          requestInfo,
          status,
          ...HttpResponse,
        };

        if (typeof window.postRequest === 'function') {
          await window.postRequest(event);
        }
        // 开启handleError时，不抛出错误，返回response
        if (config?.handleError) {
          let body = event?.response?.body || event?.body;
          try {
            error.data = JSON.parse(body);
          } catch (e) {
            // 解析不了则直接返回
            throw error;
          }
          error.headers = event?.response?.headers || event?.headers;
          return error;
        }

        throw error;
      },
    });
  }

  service.postConfig.set('lcapLocation', (response, params, requestInfo) => {
    const lcapLocation = response?.headers?.['lcap-location'];
    if (lcapLocation) {
      location.href = lcapLocation;
    }
    return response;
  });

  let logicsInstance = service.generator(newApiSchemaMap, dynamicServices, serviceConfig);
  let mockInstance = {};
  if (window.appInfo.isPreviewFe) {
    if (window?.allMockData?.mock) {
      let mockApiList = JSON.parse(window?.allMockData?.mock).map((v) => v.name);
      JSON.parse(window?.allMockData?.mock).map((v) => {
        createMockServiceByData(v.name, getData(v.mockData), mockInstance);
      });
      Object.keys(logicsInstance).map(
        (apiName) => !mockInstance[apiName] && (mockInstance[apiName] = logicsInstance[apiName]),
      );
    }
  } else {
    mockInstance = logicsInstance;
  }
  return mockInstance;
};

export function createLogics(logicsMap) {
  const apis = Object.assign({}, logicsMap);

  Object.keys(apis)
    .filter((key) =>
      /app\.dataSources\.[^.]+.entities.[^.]+.logics.(update|updateBy|createOrUpdate|batchUpdate)/.test(key),
    )
    .forEach((key) => {
      apis[key].config.preprocess = (info) => {
        const body = info.url.body;
        if (body.properties) {
          if (body.entity) body.entity = pick(body.entity, body.properties);
          if (body.entities) body.entities = body.entities.map((entity) => pick(entity, body.properties));
        }
        return info;
      };
    });

  const logics = createLogicService(apis);

  return logics;
}

interface LCAPRequestOptions {
  url: string;
  method: string;
  headers: Record<string, any>;
  data: Record<string, any>;
  params: Record<string, string | number | boolean>;

  pathSlot?: Record<string, string>;
  extraConfig: Record<string, any>;
}

export { initNativeRequestInterceptors } from './nativeInterceptors';

export function request(options: LCAPRequestOptions) {
  // 注册接口
  const key = `${options.method}:${options.url}`;
  const api = {
    config: options.extraConfig || {},
    url: {
      path: options.url,
      method: options.method,
    },
  };

  // 判断是否是外部接口
  const isExternal = options.extraConfig?.serviceType === 'external';

  const service = isExternal ? createService({ [key]: api }) : createLogics({ [key]: api });

  return service[key]({
    headers: options.headers,
    body: options.data,
    query: options.params,
    path: options.pathSlot,
  });
}
