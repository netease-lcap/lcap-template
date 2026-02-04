import { isNil, camelCase, upperFirst, lowerFirst } from 'es-toolkit';

import errHandles from './errHandles';

export const isPromise = function (func) {
  return func && typeof func.then === 'function';
};

/**
 * has side effects
 * change response data keys to support different casing
 * @param response
 * @returns
 */
export function formatResponseData(response): void {
  const result = response?.data;

  // 遍历字段，兼容类似大小写 （通用场景）
  Object.keys(result || {}).forEach((key) => {
    const value = result[key];

    // 驼峰
    const camelKey = camelCase(key);
    if (camelKey !== key && !(camelKey in result)) {
      result[camelKey] = value;
    }

    // 首字母大写
    const upperFirstKey = upperFirst(camelKey);
    if (upperFirstKey !== camelKey && !(upperFirstKey in result)) {
      result[upperFirstKey] = value;
    }

    // 首字母小写
    const lowerFirstKey = lowerFirst(camelKey);
    if (lowerFirstKey !== camelKey && !(lowerFirstKey in result)) {
      result[lowerFirstKey] = value;
    }
  });

  // 可枚举的特殊场景
  const data = result?.Data ?? result?.data;
  const msg = result?.Message ?? result?.msg ?? result?.message;
  const code = result?.Code ?? result?.code;
  const errorType = result?.ErrorType ?? result?.errorType;

  if (data || msg || code || errorType) {
    // 兼容大小写Code、Data、Message
    response.data = {
      ...(result || {}),

      data,
      Data: data,

      msg,
      message: msg,
      Message: msg,

      code,
      Code: code,

      errorType,
      ErrorType: errorType,
    };
  }
}

const formatResponse = {
  resolve(response) {
    formatResponseData(response);

    return response;
  },
  reject(error) {
    const { response } = error;
    formatResponseData(response);

    return Promise.reject(error);
  },
};

export function httpCode(response, params, requestInfo) {
  const { config } = requestInfo;
  const serviceType = config?.serviceType;
  if (serviceType && serviceType === 'external') {
    return response;
  }
  const data = response.data; // cloneDeep(response.data, (value) => value === null ? undefined : value);
  const code = data.code || data.Code;
  const noRepeatHrefChange = (path) => {
    if (!location.pathname.includes(path)) {
      location.href = path;
    }
  };
  if (code === undefined || code === 'Success' || (code + '').startsWith('2')) {
    return response;
  } else if (String(code) === '401') {
    noRepeatHrefChange('/login');
  } else if (String(code) === '403') {
    noRepeatHrefChange('/noAuth');
  }
  return Promise.reject({
    code,
    msg: data.msg || data.Message,
  });
}

export function shortResponse(response, params, requestInfo) {
  const result = response.data;

  if (response.skipShortResponseCopy || requestInfo.config?.concept === 'Logic') {
    if (!isNil(result?.data) || !isNil(result?.Data)) {
      return result.Data ?? result.data;
    }
  }

  return result;
}

// 给流程系统接口使用
export const shortResponseForSystemProcess = (response) => {
  return response?.data || response?.Data || response;
};

export const httpError = {
  reject(err, params, requestInfo) {
    const { url, config = {} } = requestInfo;
    const { method, body = {}, headers = {} } = url;
    // 处理code
    if (err === 'expired request') {
      throw err;
    }
    let handle;
    if (!err.response) {
      handle = errHandles.remoteError;
    } else if (err.code === undefined) {
      if (err.response) {
        const code = err.response.data && (err.response.data.code || err.response.data.Code);
        if (typeof code === 'number') {
          const status = err.response.status;
          handle = errHandles[code] || errHandles[status] || errHandles.remoteError;
        } else {
          handle = errHandles.remoteError;
        }
      } else {
        handle = errHandles.remoteError;
      }
    } else {
      const code = (err.response && err.response.status) || err.code;
      handle = errHandles[code];
      if (!handle) handle = errHandles.defaults;
    }
    const handleOut = handle(
      {
        config,
        baseURL: config.baseURL || '',
        url,
        method,
        body,
        headers,
      },
      (err.response && err.response.data) || err,
    );

    if (isPromise(handleOut)) return handleOut;

    throw err;
  },
};

export function addConfigs(service) {
  if (process.env.NODE_ENV === 'development') {
    service.preConfig.set('baseURL', (requestInfo, baseURL) => {
      if (!baseURL.startsWith('http')) {
        throw new Error('set baseURL only support cross domain');
      }
    });
  }

  service.postConfig.set('formatResponse', formatResponse);
  service.postConfig.set('httpCode', httpCode);
  service.postConfig.set('httpError', httpError);
  service.postConfig.set('shortResponse', shortResponse);
  service.postConfig.set('shortResponseForSystemProcess', shortResponseForSystemProcess);
}
