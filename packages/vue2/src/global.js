/**
 * 全局工具
 */

import Vue from 'vue';
import { install } from '@vusion/utils';
import { createService } from '@/common';
import mixins from '@/mixins';
import appUtils from '@/utils';

// 关闭生产提示
Vue.config.productionTip = false;

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
Vue.prototype.$sleep = window.$sleep;

// 全局混入
window.$mixins = mixins;

window.$appUtils = appUtils;

window._lcapCreateService = createService;
window.LcapInstall = install;
