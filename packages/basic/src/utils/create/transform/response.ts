import BigNumber from 'bignumber.js';
import { get } from 'es-toolkit/compat';
import JSONbig from '../../json-bigint';
import type { RequestInfo } from '../index';

function getJsonParse() {
  let hasSource = false;
  const jsonStr = `{"myBigInt":6028792033986383748 }`;
  JSON.parse(jsonStr, (...arg) => {
    if (get(arg, '2')) hasSource = true;
    return arg[1];
  });
  const warpJsonParse = (jsonStr) =>
    JSON.parse(jsonStr, (...arg) => {
      if (typeof arg[1] === 'number' && Number.isInteger(arg[1]) && !Number.isSafeInteger(arg[1])) {
        return new BigNumber(get(arg, '2.source'));
      }
      return arg[1];
    });
  return hasSource ? warpJsonParse : JSONbig.parse;
}
const jsonParse = getJsonParse();

function defaultTransform(data) {
  try {
    const response = jsonParse(data);
    return response;
  } catch (error) {
    return data;
  }
}

export default (requestInfo: RequestInfo) => [defaultTransform];
