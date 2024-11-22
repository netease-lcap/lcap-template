import errHandles from "./errHandles";

export const isPromise = function (func) {
  return func && typeof func.then === "function";
};

export function httpCode(response, params, requestInfo) {
  const { config } = requestInfo;
  const serviceType = config?.serviceType;
  if (serviceType && serviceType === "external") {
    return response;
  }
  const data = response.data; // cloneDeep(response.data, (value) => value === null ? undefined : value);
  const code = data.code || data.Code;
  const noRepeatHrefChange = (path) => {
    if (!location.pathname.includes(path)) {
      location.href = path;
    }
  };
  if (code === undefined || code === "Success" || (code + "").startsWith("2")) {
    return response;
  } else if (String(code) === "401") {
    noRepeatHrefChange("/login");
  } else if (String(code) === "403") {
    noRepeatHrefChange("/noAuth");
  }
  return Promise.reject({
    code,
    msg: data.msg || data.Message,
  });
}

export function shortResponse(response, params, requestInfo) {
  if (requestInfo.config?.concept === "Logic" || requestInfo.config?.handleError) {
    // 1. 原logic接口返回不变
    // 2. handleError为true时，返回Data
    return response.data?.Data !== undefined ? response.data?.Data : response.data;
  }

  const data = response?.data;

  // 兼容新Code、Data、Message
  if (data?.Code !== undefined) {
    data.code = data.Code;
  }
  if (data?.Data !== undefined) {
    data.data = data.Data;
  }
  if (data?.Message !== undefined) {
    data.message = data.Message;
    data.msg = data.Message;
  }

  return data;
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
    if (err === "expired request") {
      throw err;
    }
    let handle;
    if (!err.response) {
      handle = errHandles.remoteError;
    } else if (err.code === undefined) {
      if (err.response) {
        const code = err.response.data && (err.response.data.code || err.response.data.Code);
        if (typeof code === "number") {
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
        baseURL: config.baseURL || "",
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
  if (process.env.NODE_ENV === "development") {
    service.preConfig.set("baseURL", (requestInfo, baseURL) => {
      if (!baseURL.startsWith("http")) {
        throw new Error("set baseURL only support cross domain");
      }
    });
  }
  service.postConfig.set("httpCode", httpCode);
  service.postConfig.set("httpError", httpError);
  service.postConfig.set("shortResponse", shortResponse);
  service.postConfig.set("shortResponseForSystemProcess", shortResponseForSystemProcess);
}
