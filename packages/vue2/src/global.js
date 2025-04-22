// 定义一下全局变量
import Vue from 'vue';
import { install } from '@vusion/utils';

import { createService } from '@/common';
import mixins from '@/mixins';

// 关闭生产提示
Vue.config.productionTip = false;

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

window._lcapCreateService = createService;
window.LcapInstall = install;
