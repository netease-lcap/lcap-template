import * as JSONbig from '../../json-bigint';
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

function transformFileInConnectorBody(data, headers) {
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
    const { contentType, ...rest } = data;

    const formData = traverse(rest);

    headers['Content-Type'] = data['contentType'] || 'multipart/form-data';

    return formData;
  }

  return data;
}

function transformFileInBody(data, headers) {
  let hasFile = false;

  if (isObject(data)) {
    for (const key in data) {
      if (isFile(data[key])) {
        hasFile = true;
        break;
      }
    }
  }

  if (hasFile) {
    const formData = traverse(data);

    headers['Content-Type'] = 'multipart/form-data';

    return formData;
  }

  return data;
}

export default (requestInfo: RequestInfo) => {
  const { config } = requestInfo;
  const { connectionName } = config || {};

  let list = [defaultTransform];

  // 连接器的文件上传 请求体结构有一层body，特殊处理一下
  if (connectionName) {
    list = [transformFileInConnectorBody, ...list];
  } else {
    list = [transformFileInBody, ...list];
  }

  return list;
};

function traverse(obj, parentKey = '', formData = new FormData()) {
  for (const key in obj) {
    const value = obj[key];
    const formKey = parentKey ? `${parentKey}.${key}` : key;

    if (isObject(value) && !isFile(value)) {
      traverse(value, formKey, formData);
    } else {
      formData.append(formKey, value);
    }
  }
  return formData;
}
