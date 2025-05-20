import axios from 'axios';
import Service from 'request-pre';
import { stringify } from 'qs';
// import JSONbig from 'json-bigint';
import JSONbig from '../json-bigint';
import BigNumber from "bignumber.js";
import get from "lodash/get";

import { formatMicroFrontUrl } from "../../init/router/microFrontUrl"; // 微前端路由方法

import cookie from "../cookie";
import { addConfigs } from "./add.configs";
import { getFilenameFromContentDispositionHeader } from "./tools";
import paramsSerializer from "./paramsSerializer";
import { createMockServiceByData} from "./mockData";
import { sseRequester } from './sseRequester';

import Config from "../../config";

const getData = (str)=> (new Function('return ' + str))();

function getJsonParse() {
  let hasSource = false;
  const jsonStr = `{"myBigInt":6028792033986383748 }`;
  JSON.parse(jsonStr, (...arg) => {
    if (get(arg, "2")) hasSource = true;
    return arg[1];
  });
  const warpJsonParse = (jsonStr) =>
    JSON.parse(jsonStr, (...arg) => {
      if (typeof arg[1] === "number" && Number.isInteger(arg[1]) && !Number.isSafeInteger(arg[1])) {
        return new BigNumber(get(arg, "2.source"));
      }
      return arg[1];
    });
  return hasSource ? warpJsonParse : JSONbig.parse;
}
const jsonParse = getJsonParse();

const formatContentType = function (contentType, data) {
  const map = {
    "application/x-www-form-urlencoded"(data) {
      return stringify(data);
    },
  };
  return map[contentType] ? map[contentType](data) : data;
};

const parseCookie = (str) =>
  str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, v) => {
      const getValue = s =>{
        try {
          return decodeURIComponent(s.trim())
        } catch (error) {
          return s.trim()
        }
      }
      acc[getValue(v[0])] = getValue(v[1]);
      return acc;
    }, {});

const foramtCookie = (cookieStr) => {
  const result = {};
  if (document.cookie.length <= 0) {
    return result;
  }
  const obj = parseCookie(cookieStr);
  Object.keys(obj).forEach((key) => {
    result[key] = {
      name: key,
      value: obj[key],
      domain: "", // 前端只能拿到k v 其他字段补齐即可
      cookiePath: "",
      sameSite: "",
      httpOnly: "",
      secure: "",
      maxAge: "",
    };
  });
  return result;
};

/**
 * 目前主要测试的是 get 请求
 * 图片，文件，和文件流形式的下载
 * https://raw.githubusercontent.com/vusion/cloud-ui/master/src/assets/images/1.jpg
 * 支持 query 参数
 */
function download(url) {
    const { path, method, body = {}, headers = {}, query = {}, timeout } = url;

    return axios({
        url: formatMicroFrontUrl(path),
        method,
        params: query,
        data: formatContentType(headers['Content-Type'], body),
        responseType: 'blob',
        timeout,
    }).then((res) => {
        // 包含 content-disposition， 从中解析名字，不包含 content-disposition 的获取请求地址的后缀
        let effectiveFileName = res.request.getAllResponseHeaders().includes('content-disposition') ? getFilenameFromContentDispositionHeader(res.request.getResponseHeader('content-disposition')) : res.request.responseURL.split('/').pop();
        const { data, status, statusText } = res;

        // 通过UA判断是否是移动端
        const mobilePattern = /mobile|mobi|wap|simulator|iphone|android/gi;
        const isMobile = mobilePattern.test(navigator.userAgent);
        if (!isMobile) {
          effectiveFileName = decodeURIComponent(effectiveFileName).replace(/_\d{8,}\./, '.');
          if (data && data.size === 0) {
            return Promise.resolve({
              data: {
                code: status,
                msg: statusText,
              },
            });
          }
        }

        const downloadUrl = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', effectiveFileName); // any other extension
        document.body.appendChild(link);
        link.click();
        link.remove();
        return Promise.resolve({
            data: {
                code: status,
                msg: statusText,
            },
        });
    }).catch((err) =>
        // 基于 AxiosError 的错误类型 https://github.com/axios/axios/blob/b7e954eba3911874575ed241ec2ec38ff8af21bb/index.d.ts#L85
        Promise.resolve({
            data: {
                code: err.code,
                msg: err.response.statusText,
            },
        }));
}

function formatCallConnectorPath(path: string, connectionName: string): string {
  // /api/connectors/connector1/namespace1/getA
  const pathItemList = (path || '').split('/').filter(i => i);
  if (pathItemList.length < 3) {
    throw Error('unexpected path when use CallConnector')
  }
  const [prefix1, prefix2, connectorName, ...rt] = pathItemList;
  return `/${prefix1}/${prefix2}/${connectorName}/${connectionName}/${rt.join('/')}`
}

export function genBaseOptions(requestInfo) {
  const { url, config = {} } = requestInfo;
  const { method, body = {}, headers = {}, query = {} } = url;
  const path = formatMicroFrontUrl(url.path);

  const baseURL = config.baseURL ? config.baseURL : "";
  headers["Content-Type"] = headers["Content-Type"] || "application/json";
  if (!headers.Authorization && cookie.get("authorization")) {
    headers.Authorization = cookie.get("authorization");
  }
  headers.DomainName = window.appInfo?.domainName;
  if (window.appInfo?.frontendName)
    headers["LCAP-FRONTEND"] = window.appInfo?.frontendName;
  // 用户本地时区信息，传递给后端
  headers.TimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  let data;
  const method2 = method.toUpperCase();
  if (
    Array.isArray(body) ||
    Object.keys(body).length ||
    ["PUT", "POST", "PATCH", "DELETE"].includes(method2)
  ) {
    data = formatContentType(headers["Content-Type"], body);
  }

  return  {
    params: query,
    paramsSerializer,
    baseURL,
    method: method2,
    transformRequest: [
      function (data, headers) {
        try {
          if (headers['Content-Type'] !== 'application/x-www-form-urlencoded') {
            const request = JSONbig.stringify(data);
            return request;
          }
          return data;
        } catch (error) {
          return data;
        }
      },
    ],
    transformResponse: [
      function (data) {
        try {
          const response = jsonParse(data);
          return response;
        } catch (error) {
          return data;
        }
      },
    ],
    url: path,
    data,
    headers,
    withCredentials: !baseURL,
    xsrfCookieName: "csrfToken",
    xsrfHeaderName: "x-csrf-token",
  }
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

  if (Config.axios?.interceptors?.length) {
    Config.axios?.interceptors.forEach((interceptor) => {
      const { onSuccess, onError } = interceptor;
      axios.interceptors.response.use(onSuccess, onError);
    });
  }

  const options = genBaseOptions(requestInfo);
  if (typeof window.axiosOptionsSetup === 'function') {
    window.axiosOptionsSetup(options);
  }

  const req = axios(options);

  return req;
};


const service = new Service(requester);

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

export const createService = function createService(apiSchemaList, serviceConfig?, dynamicServices?) {
    addConfigs(service);
    const fixServiceConfig = serviceConfig || {};
    fixServiceConfig.config = fixServiceConfig.config || {};
    Object.assign(fixServiceConfig.config, {
        httpCode: true,
        httpError: true,
        shortResponse: true,
    });
    serviceConfig = fixServiceConfig;
    const newApiSchemaMap = adjustPathWithSysPrefixPath(apiSchemaList);
    let logicsInstance = service.generator(newApiSchemaMap, dynamicServices, serviceConfig);
    let mockInstance ={}

      if (window.appInfo.isPreviewFe) {
        if(window?.allMockData?.mock){
            JSON.parse(window?.allMockData?.mock).map(v=>{
             createMockServiceByData(v.name, getData(v.mockData), mockInstance)
            })
            createMockServiceByData('GetUser', {}, mockInstance)
            createMockServiceByData('GetUserResources', {}, mockInstance)
            Object.keys(logicsInstance).map(apiName => !mockInstance[apiName] && (mockInstance[apiName]= logicsInstance[apiName]))
        }
     }else{
        mockInstance = logicsInstance
     }
     return mockInstance
};

export const createLogicService = function createLogicService(apiSchemaList, serviceConfig?, dynamicServices?) {
    const fixServiceConfig = serviceConfig || {};
    fixServiceConfig.config = fixServiceConfig.config || {};
    Object.assign(fixServiceConfig.config, {
        // httpCode: true,
        // httpError: true,
        shortResponse: true,
        concept: 'Logic',
    });
    serviceConfig = fixServiceConfig;
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
              cookies: foramtCookie(document.cookie),
              requestInfo
          };

          let data = preData;
          if (typeof window.preRequest === "function") {
            data = await window.preRequest(HttpRequest, preData);
          }

          return data || preData;
        }
      });
      serviceConfig.config.preRequest = true;
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
                  cookies: foramtCookie(document.cookie),
              };
              let event = {
                response: HttpResponse, requestInfo, status,
                ...HttpResponse
              }

              if (typeof window.postRequest === 'function') {
                await window.postRequest(event);
              }

              let body =  event?.response?.body || event?.body
              try {
                response.data  =  JSON.parse(body)
              } catch (error) {
                response.data = body
              }
              response.headers = event?.response?.headers || event?.headers
              return response;
          },
      });
      service.postConfig.set('postRequestError', {
          reject(response, params, requestInfo) {
              if (requestInfo?.config?.serviceType === 'sse') {
                throw Error('远端调用异常');
              }
              response.Code = response.code || response.status;
              const status = 'error';
              const err = response;
              const { config } = requestInfo;
              if (err === 'expired request') {
                  throw err;
              }
              if (!err.response) {
                  if (!config.noErrorTip) {
                      // instance.show('系统错误，请查看日志！');
                      Config.toast.error('系统错误，请查看日志！');
                      return;
                  }
              }
              if (window.LcapMicro?.loginFn) {
                  if (err.Code === 401 && err.Message === 'token.is.invalid') {
                      window.LcapMicro.loginFn();
                      return;
                  }
                  if (err.Code === 'InvalidToken' && err.Message === 'Token is invalid') {
                      window.LcapMicro.loginFn();
                      return;
                  }
              }
              if (err.Code === 501 && err.Message === 'abort') {
                  throw Error('程序中止');
              }
              const HttpResponse = {
                  status: response.response.status + '',
                  body: JSON.stringify(response.response.data),
                  headers: response.response.headers,
                  cookies: foramtCookie(document.cookie),
              };
              window.postRequest && window.postRequest(HttpResponse, requestInfo, status);
              throw err;
          },
      });
      serviceConfig.config = {
          ...serviceConfig.config,
          priority: {
              ...(serviceConfig.config.priority ? serviceConfig.config.priority : {}),
              postRequest: 10,
              postRequestError: 10,
          },
      };
      serviceConfig.config.postRequest = true;
      serviceConfig.config.postRequestError = true;
    }

    service.postConfig.set('lcapLocation', (response, params, requestInfo) => {
        const lcapLocation = response?.headers?.['lcap-location'];
        if (lcapLocation) {
            location.href = lcapLocation;
        }
        return response;
    });

    serviceConfig.config = {
        ...serviceConfig.config,
        priority: {
            ...(serviceConfig.config.priority ? serviceConfig.config.priority : {}),
            lcapLocation: 1,
        },
    };
    serviceConfig.config.lcapLocation = true;
    // shortResponse 不能加，因为复用了同一个service
    // service.postConfig.set('shortResponse', function (response, params, requestInfo) {
    //   return response.data?.Data !== undefined ? response.data?.Data : response.data;
    // });
    
    let logicsInstance=  service.generator(newApiSchemaMap, dynamicServices, serviceConfig);
    let mockInstance ={}
    if (window.appInfo.isPreviewFe) {
      if(window?.allMockData?.mock){
        let mockApiList =JSON.parse(window?.allMockData?.mock).map(v=>v.name)
        JSON.parse(window?.allMockData?.mock).map(v=>{
         createMockServiceByData(v.name, getData(v.mockData), mockInstance)
        })
        Object.keys(logicsInstance).map(apiName => !mockInstance[apiName] && (mockInstance[apiName]= logicsInstance[apiName]))
      }
     }else{
        mockInstance= logicsInstance;
     }
    return mockInstance
};
