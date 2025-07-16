import * as Formatters from './Formatters';
import * as Helpers from './helper';
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

export type { Utils } from './modules/utils';

export { Formatters, Helpers };
