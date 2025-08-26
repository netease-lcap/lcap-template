import { initLogic } from '@lcap/basic-template';
import { initLogicOverwrite } from './overwrite';

export default {
  install(vm, options = {}) {
    const { naslAPP } = options;

    // 判断如果有 naslApp，就使用 overwrite 逻辑
    if (naslAPP) {
      return initLogicOverwrite(options);
    }

    // 否则使用原来的逻辑
    initLogic(options);
  },
};
