import Vue from 'vue';
import { createPinia, PiniaVuePlugin } from 'pinia';
import VueCompositionAPI from '@vue/composition-api';
import { installOptions, installFilters, installComponents, installDirectives } from '@vusion/utils';

import '@/global';

import '@/setConfig';

import {
  filters,
  directives,
  AuthPlugin,
  DataTypesPlugin,
  LogicsPlugin,
  RouterPlugin,
  ServicesPlugin,
  UtilsPlugin,
  ProcessPlugin,
  createRouter,
  microFrontend,
  filterRoutes,
  parsePath,
  getBasePath,
  filterAuthResources,
  findNoAuthView,
} from '@/common';

import * as Components from '@/components';

import { getTitleGuard } from './router';

import App from './App.vue';
import { setI18nLocale } from './i18n';
import { unsafeEval, setFavicon } from './utils';

/**
 * 初始化函数
 *
 * @param appConfig: 应用配置
 * @param platformConfig: 平台配置
 * @param routes: 路由配置
 * @param metaData: 元数据
 */
const init = (appConfig, platformConfig, routes, metaData) => {
  /**
   * 合并应用配置和平台配置至window.appInfo
   */
  window.appInfo = Object.assign(appConfig, platformConfig);

  /**
   * Vue全局错误捕获
   */
  Vue.config.errorHandler = (err) => {
    if (err.name === 'Error' && err.message === '程序中止') {
      console.error('程序中止');
    } else {
      console.error('errorCaptured: ');
      console.error('err:', err);
      console.error('vm:', vm);
      console.error('info:', info);
    }
  };

  /**
   * 设置页面图标（favicon）
   */
  if (platformConfig?.documentIcon) {
    setFavicon(platformConfig?.documentIcon);
  }

  /**
   * 挂载端事件到全局window
   */
  const endEventLists = ['rendered', 'beforeRouter', 'afterRouter', 'preRequest', 'postRequest'];
  if (metaData && metaData.frontendEvents) {
    for (let index = 0; index < endEventLists.length; index++) {
      const name = endEventLists[index];
      if (metaData && name && metaData.frontendEvents[name]) {
        // 确保事件函数中的this指向Vue.prototype
        unsafeEval.bind(Vue.prototype)(metaData.frontendEvents[name]);
        Vue.prototype[name] = window[name];
      }
    }
  }

  /**
   * 微前端场景判断
   * 如果当前脚本不是在头部或脚本未激活，则不执行初始化
   */
  if (window.LcapMicro?.container) {
    if (
      document.currentScript &&
      (!document.head.contains(document.currentScript) || document.currentScript.active === false)
    ) {
      return;
    }
  }

  /**
   * 为Vue.prototype安装工具函数
   */
  installOptions(Vue);
  /**
   * 安装指令
   */
  installDirectives(Vue, directives);
  /**
   * 安装过滤器
   */
  installFilters(Vue, filters);
  /**
   * 注册业务组件
   */
  installComponents(Vue, Components);

  /**
   * 安装逻辑插件
   * 在全局window上挂载$logics
   */
  Vue.use(LogicsPlugin, metaData);
  /**
   * 安装路由插件
   * 在全局window上挂载$destination $link
   */
  Vue.use(RouterPlugin);
  /**
   * 安装服务插件
   * 在全局window上挂载$services
   */
  Vue.use(ServicesPlugin, metaData);
  /**
   * 安装认证插件
   * 在全局window上挂载$auth
   */
  Vue.use(AuthPlugin);
  /**
   * 安装内置函数插件
   * 在全局window上挂载$utils
   */
  Vue.use(UtilsPlugin, metaData);
  /**
   * 安装数据类型插件
   * 在全局window上挂载$genInitFromSchema $global
   */
  Vue.use(DataTypesPlugin, { ...metaData, i18nInfo: appConfig.i18nInfo });
  /**
   * 安装流程业务插件
   * 在全局window上挂载$process
   */
  Vue.use(ProcessPlugin);

  Vue.use(PiniaVuePlugin);
  Vue.use(VueCompositionAPI);

  /**
   * 兼容全局toast
   */
  if (!window?.$toast) {
    window.$toast = window.Vue.prototype.$toast;
  }

  /**
   * 执行端事件---应用进入时
   */
  if (typeof window?.rendered === 'function') {
    window.rendered();
  }

  /**
   * 过滤路由
   * 只初始化基础路由， 权限路由通过‘端事件---页面进入前’进行守卫
   */
  const baseResourcePaths = platformConfig.baseResourcePaths || [];
  const authResourcePaths = platformConfig.authResourcePaths || [];
  const baseRoutes = filterRoutes(routes, null, (route, ancestorPaths) => {
    const routePath = route.path;
    const completePath = [...ancestorPaths, routePath].join('/');
    let completeRedirectPath = '';
    const redirectPath = route.redirect;
    if (redirectPath) {
      completeRedirectPath = [...ancestorPaths, redirectPath].join('/');
    }
    return baseResourcePaths.includes(completePath) || completeRedirectPath;
  });

  /**
   * 创建路由实例
   */
  const router = createRouter(baseRoutes);

  const beforeRouter = window.beforeRouter || Vue.prototype.beforeRouter;
  const afterRouter = window.afterRouter || Vue.prototype.afterRouter;

  const getAuthGuard = (params) => async (to, from, next) => {
    try {
      if (beforeRouter) {
        await beforeRouter({
          ...params,
          to,
          from,
          next,
          parsePath,
          getBasePath,
          filterAuthResources,
          findNoAuthView,
          filterRoutes,
        });
      } else {
        next();
      }
    } catch (err) {
      console.error('beforeRouter error:', err);
      next();
    }
  };

  // 权限路由守卫
  router.beforeEach(
    getAuthGuard({
      router,
      routes,
      authResourcePaths,
      appConfig,
      baseResourcePaths,
    }),
  );
  // 页面标题守卫
  router.beforeEach(getTitleGuard(appConfig));
  // 微前端场景守卫
  router.beforeEach(microFrontend);

  /**
   * 路由后置守卫
   * 执行‘端事件---页面进入前’
   */
  router.afterEach(async (to, from) => {
    try {
      if (afterRouter) {
        await afterRouter(to, from);
      }
    } catch (err) {
      console.error('afterRouter error:', err);
    }
  });

  const app = new Vue({
    name: 'app',
    router,
    i18n: setI18nLocale(appConfig),
    pinia: createPinia(),
    ...App,
  });

  if (window.LcapMicro?.container) {
    const container = window.LcapMicro.container;
    container.innerHTML = '';
    app.$mount();
    container.appendChild(app.$el);
  } else {
    app.$mount('#app');
  }

  return app;
};

export default {
  init,
};
