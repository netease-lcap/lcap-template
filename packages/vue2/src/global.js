/**
 * 全局工具
 */

import Vue from 'vue';
import * as VueCompositionAPI from '@vue/composition-api';
import { install } from '@vusion/utils';
import { createService, request as LcapRequest, _ } from '@/common';
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

window.VueCompositionAPI = VueCompositionAPI;
window.Lodash = _;

// 全局混入
window.$mixins = mixins;

window.$appUtils = appUtils;

window.LcapRequest = LcapRequest;

window._lcapCreateService = createService;
window.LcapInstall = install;

const loadedLibs = [];
window.loadLibs = async function (libs) {
  for (const lib of libs) {
    const { name, js = [], css = [] } = lib;
    if (loadedLibs.includes(name)) {
      continue;
    }

    // CSS 可以并行加载
    const cssTasks = css.map((cssUrl) => loadResource('css', cssUrl));
    await Promise.all(cssTasks);

    // JS 需要串行加载以保证依赖顺序
    for (const jsUrl of js) {
      await loadResource('js', jsUrl);
    }

    const kebab2Camel = (name) => name.replace(/(?:^|-)([a-zA-Z0-9])/g, (m, $1) => $1.toUpperCase());
    const camelName = kebab2Camel(name);

    if (window[camelName]) {
      try {
        install(Vue, window[camelName]);
      } catch (error) {
        console.log(new Error(`Failed to install library: ${name}`));
      }
    }

    loadedLibs.push(name);
  }

  function loadResource(type, url) {
    return new Promise((resolve, reject) => {
      let element;
      if (type === 'js') {
        element = document.createElement('script');
        element.type = 'text/javascript';
        element.src = url;
        element.async = true;
      } else if (type === 'css') {
        element = document.createElement('link');
        element.rel = 'stylesheet';
        element.href = url;
      } else {
        console.log(new Error(`Unsupported resource type: ${type}`));
        resolve();
        return;
      }

      element.onload = () => resolve();
      element.onerror = () => {
        console.log(new Error(`Failed to load ${type} resource: ${url}`));
        resolve();
      };

      document.head.appendChild(element);
    });
  }
};
