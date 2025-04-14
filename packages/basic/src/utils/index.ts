export * from './encodeUrl';
export * from './route';
export * from './create';

import storage from './localStorage';
import cookie from './cookie';

export { storage, cookie };

// 判断是否是通过 genInitFromSchema 创建的对象
export function isCreatedByGenInitFromSchema(obj) {
  return obj instanceof Object && obj.constructor.name === 'NaslTypeConstructor';
}
