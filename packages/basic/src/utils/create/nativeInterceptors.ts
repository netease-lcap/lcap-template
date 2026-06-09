/**
 * 将 axios hooks 应用到原生 fetch 和 XMLHttpRequest
 * 这样即使不使用 axios 发起的请求也能使用 $axiosHookManager 中注册的拦截器
 */

interface Hook {
  onSuccess?: (config: any) => any;
  onError?: (error: any) => any;
  order?: number;
  registered?: boolean;
}

interface AxiosHookManager {
  requestHooks: Hook[];
  responseHooks: Hook[];
}

/**
 * 获取排序后的请求 hooks
 */
function getRequestHooks(): Hook[] {
  if (!window.$axiosHookManager?.requestHooks) {
    return [];
  }
  return window.$axiosHookManager.requestHooks
    .filter((hook: Hook) => hook && hook.onSuccess)
    .sort((a: Hook, b: Hook) => (a?.order || 0) - (b?.order || 0));
}

/**
 * 获取排序后的响应 hooks
 */
function getResponseHooks(): Hook[] {
  if (!window.$axiosHookManager?.responseHooks) {
    return [];
  }
  return window.$axiosHookManager.responseHooks
    .filter((hook: Hook) => hook && hook.onSuccess)
    .sort((a: Hook, b: Hook) => (a?.order || 0) - (b?.order || 0));
}

/**
 * 将 fetch 的 Request/Response 转换为类似 axios config 的格式
 */
function buildAxiosLikeConfig(requestInfo: {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: any;
}): any {
  return {
    url: requestInfo.url,
    method: requestInfo.method,
    headers: requestInfo.headers,
    data: requestInfo.body,
    params: {},
    baseURL: '',
  };
}

/**
 * 从 fetch 的 Response 构建类似 axios response 的格式
 */
function buildAxiosLikeResponse(response: Response, config: any, data?: any): any {
  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config,
    request: null,
    url: config.url,
  };
}

/**
 * 应用请求 hooks
 */
async function applyRequestHooks(config: any): Promise<any> {
  const hooks = getRequestHooks();
  let result = { ...config };

  for (const hook of hooks) {
    try {
      if (hook.onSuccess) {
        result = await hook.onSuccess(result);
      }
    } catch (error) {
      if (hook.onError) {
        result = await hook.onError(error);
      } else {
        throw error;
      }
    }
  }

  return result;
}

/**
 * 应用响应 hooks
 */
async function applyResponseHooks(response: any): Promise<any> {
  const hooks = getResponseHooks();
  let result = response;

  for (const hook of hooks) {
    try {
      if (hook.onSuccess) {
        result = await hook.onSuccess(result);
      }
    } catch (error) {
      if (hook.onError) {
        result = await hook.onError(error);
      } else {
        throw error;
      }
    }
  }

  return result;
}

/**
 * 应用响应错误 hooks
 */
async function applyResponseErrorHooks(error: any): Promise<any> {
  const hooks = getResponseHooks();
  let result = error;

  for (const hook of hooks) {
    try {
      if (hook.onError) {
        result = await hook.onError(result);
      }
    } catch (e) {
      result = e;
    }
  }

  throw result;
}

/**
 * 拦截原生 fetch
 */
function interceptFetch(): void {
  const originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const method = init?.method || 'GET';
    const headers: Record<string, string> = {};

    if (init?.headers) {
      if (init.headers instanceof Headers) {
        init.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(init.headers)) {
        init.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, init.headers);
      }
    }

    // 构建 axios 风格的 config
    let config = buildAxiosLikeConfig({
      url,
      method,
      headers,
      body: init?.body,
    });

    // 应用请求 hooks
    try {
      config = await applyRequestHooks(config);
    } catch (error) {
      return Promise.reject(error);
    }

    // 更新 init 对象
    const newInit: RequestInit = {
      ...init,
      method: config.method,
      headers: config.headers,
    };

    if (config.data !== undefined) {
      newInit.body = typeof config.data === 'string' ? config.data : JSON.stringify(config.data);
    }

    // 执行原始 fetch
    try {
      const response = await originalFetch.call(window, config.url, newInit);

      // 克隆响应以便读取数据
      const clonedResponse = response.clone();
      let responseData: any;

      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await clonedResponse.json();
        } else if (
          contentType &&
          (contentType.includes('text/') ||
            contentType.includes('application/xml') ||
            contentType.includes('application/javascript'))
        ) {
          responseData = await clonedResponse.text();
        } else {
          // 对于非 JSON 和非文本类型，不读取 body
          responseData = null;
        }
      } catch {
        responseData = null;
      }

      // 构建 axios 风格的 response
      const axiosLikeResponse = buildAxiosLikeResponse(response, config, responseData);

      // 应用响应 hooks
      const processedResponse = await applyResponseHooks(axiosLikeResponse);

      // 如果 hooks 修改了数据，需要创建新的 Response
      if (processedResponse.data !== responseData) {
        const newBody =
          typeof processedResponse.data === 'string' ? processedResponse.data : JSON.stringify(processedResponse.data);

        return new Response(newBody, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      }

      return response;
    } catch (error) {
      // 应用响应错误 hooks
      try {
        await applyResponseErrorHooks(error);
      } catch (processedError) {
        return Promise.reject(processedError);
      }
      return Promise.reject(error);
    }
  };
}

/**
 * 拦截 XMLHttpRequest
 */
function interceptXHR(): void {
  const OriginalXHR = window.XMLHttpRequest;

  class InterceptedXHR extends OriginalXHR {
    private _config: any = {};
    private _requestHeaders: Record<string, string> = {};
    private _method: string = '';
    private _url: string = '';
    private _async: boolean = true;
    private _requestBody: any = null;

    open(
      method: string,
      url: string | URL,
      async: boolean = true,
      username?: string | null,
      password?: string | null,
    ): void {
      this._method = method;
      this._url = typeof url === 'string' ? url : url.toString();
      this._async = async;

      // 构建初始 config
      this._config = buildAxiosLikeConfig({
        url: this._url,
        method: this._method,
        headers: {},
      });

      super.open(method, url, async, username, password);
    }

    setRequestHeader(header: string, value: string): void {
      this._requestHeaders[header] = value;
      this._config.headers[header] = value;
      super.setRequestHeader(header, value);
    }

    send(body?: Document | BodyInit | null): void {
      this._requestBody = body;
      this._config.data = body;

      const executeRequest = async () => {
        try {
          // 应用请求 hooks
          const processedConfig = await applyRequestHooks(this._config);

          // 更新请求头和 URL
          this._url = processedConfig.url;
          this._method = processedConfig.method;

          // 重新设置请求头
          Object.entries(processedConfig.headers).forEach(([key, value]) => {
            if (value !== this._requestHeaders[key]) {
              super.setRequestHeader(key, String(value));
            }
          });

          // 更新请求体
          const newBody = processedConfig.data;

          // 设置响应处理
          this.addEventListener('load', async () => {
            try {
              let responseData: any;
              const contentType = this.getResponseHeader('content-type');

              try {
                if (contentType && contentType.includes('application/json')) {
                  responseData = JSON.parse(this.responseText);
                } else if (
                  contentType &&
                  (contentType.includes('text/') ||
                    contentType.includes('application/xml') ||
                    contentType.includes('application/javascript'))
                ) {
                  responseData = this.responseText;
                } else {
                  // 对于非 JSON 和非文本类型，不读取 body
                  responseData = null;
                }
              } catch {
                responseData = null;
              }

              // 构建 axios 风格的 response
              const axiosLikeResponse = {
                data: responseData,
                status: this.status,
                statusText: this.statusText,
                headers: this.getAllResponseHeaders(),
                config: processedConfig,
                request: this,
                url: processedConfig.url,
              };

              // 应用响应 hooks（但不阻塞原始事件）
              applyResponseHooks(axiosLikeResponse).catch(() => {
                // 忽略 hooks 错误，保持原始行为
              });
            } catch {
              // 忽略错误
            }
          });

          this.addEventListener('error', async (event) => {
            try {
              const error = {
                message: 'Network Error',
                config: processedConfig,
                request: this,
              };
              await applyResponseErrorHooks(error);
            } catch {
              // 忽略错误
            }
          });

          // 发送请求
          super.send(newBody);
        } catch (error) {
          // 创建错误事件并派发
          const errorEvent = new ErrorEvent('error', {
            error: error,
            message: String(error),
          });
          this.dispatchEvent(errorEvent);
        }
      };

      executeRequest();
    }
  }

  // 复制原生的静态属性和方法
  Object.setPrototypeOf(InterceptedXHR, OriginalXHR);
  Object.defineProperty(InterceptedXHR, 'name', {
    value: 'XMLHttpRequest',
    configurable: true,
  });

  // 替换全局 XMLHttpRequest
  window.XMLHttpRequest = InterceptedXHR as any;
}

/**
 * 初始化原生请求拦截器
 * 将 axios hooks 应用到 fetch 和 XMLHttpRequest
 */
export function initNativeRequestInterceptors(): void {
  // 确保只初始化一次
  if ((window as any).__nativeRequestInterceptorsInitialized) {
    return;
  }

  (window as any).__nativeRequestInterceptorsInitialized = true;

  // 拦截 fetch
  interceptFetch();

  // 拦截 XMLHttpRequest
  interceptXHR();
}

export default initNativeRequestInterceptors;
