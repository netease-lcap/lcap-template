import Vue from 'vue';
import * as VueCompositionAPI from '@vue/composition-api';
import { install } from '@vusion/utils';

import { createService } from '@/common';
import mixins from '@/mixins';
import appUtils from '@/utils';

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

window.VueCompositionAPI = VueCompositionAPI;

// 全局混入
window.$mixins = mixins;

window.$appUtils = appUtils;

window._lcapCreateService = createService;
window.LcapInstall = install;
