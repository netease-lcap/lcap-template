import Vue from 'vue';
import { install } from '@vusion/utils';

import { createService } from '@/common';
import mixins from '@/mixins';

// 关闭生产提示
Vue.config.productionTip = false;

Vue.prototype.$sleep = function () {
  return new Promise((resolve) => {
    if (typeof this?.$nextTick === 'function') {
      this.$nextTick(resolve);
    } else {
      setTimeout(resolve, 0);
    }
  });
};
window.$sleep = Vue.prototype.$sleep;

// 全局混入
window.$mixins = mixins;

window._lcapCreateService = createService;
window.LcapInstall = install;
