import JSONbig from '../../json-bigint';
import {
  isFormData,
  isArrayBuffer,
  isBuffer,
  isStream,
  isFile,
  isBlob,
  isArrayBufferView,
  isObject,
  normalizeHeaderName,
} from '../utils';
import type { RequestInfo } from '../index';

function defaultTransform(data, headers) {
  try {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (isFormData(data) || isArrayBuffer(data) || isBuffer(data) || isStream(data) || isFile(data) || isBlob(data)) {
      return data;
    }

    if (isArrayBufferView(data)) {
      return data.buffer;
    }

    if (isObject(data) || headers['Content-Type'].includes('application/json')) {
      // 对于 JSON 请求，序列化的时候保持对象的形状，不让 undefined 字段消失。便于服务端识别
      const replacerToKeepUndefinedFields = (_: string, value: unknown) => (value === undefined ? null : value);
      const request = JSONbig.stringify(data, replacerToKeepUndefinedFields);
      return request;
    }

    return data;
  } catch (error) {
    return data;
  }
}

function transformFileInBody(data, headers) {
  let hasFile = false;

  if (isObject(data) && isObject(data.body)) {
    for (const key in data.body) {
      if (isFile(data.body[key])) {
        hasFile = true;
        break;
      }
    }
  }

  if (hasFile) {
    const formData = new FormData();

    for (const key in data.body) {
      formData.append(`body.${key}`, data.body[key]);
    }

    headers['Content-Type'] = data['contentType'] || 'multipart/form-data';

    return formData;
  }

  return data;
}

export default (requestInfo: RequestInfo) => {
  const { config } = requestInfo;
  const { connectionName } = config || {};

  let list = [defaultTransform];

  // 连接器才调用转换器
  if (connectionName) {
    list = [transformFileInBody, ...list];
  }

  return list;
};
