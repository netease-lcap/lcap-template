import { stringify } from 'qs';

export default function paramsSerializer(params) {
  if (typeof params === 'object') {
    Object.keys(params).forEach((key) => {
      const param = params[key];

      // 修复接口query空参数问题
      if (param === undefined) {
        // 给null的原因是： qs Properties that are set to undefined will be omitted entirely
        params[key] = null;
      }
    });
  }

  return stringify(params, {
    arrayFormat: 'repeat',
    encoder(str, defaultEncoder, charset, type) {
      if (type === 'value' && str.includes && str.includes(',')) return encodeURI(str);
      else return defaultEncoder(str, defaultEncoder, charset, type);
    },
  });
}
