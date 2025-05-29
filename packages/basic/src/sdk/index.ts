import type { IOptions } from './types';
import { Utils } from './modules/utils';

export default class NaslSDK {
  static init(optinos: IOptions): { utils: Utils } {
    if (!optinos) {
      throw new Error('请传入参数');
    }

    return {
      utils: new Utils(optinos),
    };
  }

  static initUtils(optinos: IOptions): Utils {
    if (!optinos) {
      throw new Error('请传入参数');
    }

    return new Utils(optinos);
  }
}

export * as Formatters from './Formatters';
export type { Utils } from './modules/utils';

export * as Helpers from './helper';
