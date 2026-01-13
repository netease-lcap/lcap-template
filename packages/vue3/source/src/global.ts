import * as hooks from '@/hooks';
import * as globalVariables from '@/global-variables';

window.$hooks = hooks;
window.$globalVariables = globalVariables;

/**
 * 睡眠函数
 * 用途：组件属性赋值功能
 * 作用：休眠，保证下一段逻辑执行能拿到最新的组件状态
 */
window.$sleep = function () {
  return new Promise((resolve) => {
    if (typeof this?.$nextTick === 'function') {
      this.$nextTick(resolve);
    } else {
      setTimeout(resolve, 0);
    }
  });
};
