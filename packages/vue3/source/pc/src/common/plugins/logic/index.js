import * as Basic from '@lcap/basic-template'

export default {
  install(vm, options = {}) {
    // 使用 override 逻辑
    if (options?.override?.enabled) {
      return options.override.initLogic(options, Basic);
    }

    // 否则使用原来的逻辑
    Basic.initLogic(options);
  },
};
