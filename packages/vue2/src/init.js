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

installOptions(Vue);
installDirectives(Vue, directives);

const evalWrap = function (metaData, fnName) {
  // eslint-disable-next-line no-eval
  metaData && fnName && metaData?.frontendEvents[fnName] && eval(metaData.frontendEvents[fnName]);
};

// 需要兼容老应用的制品，因此新版本入口函数参数不做改变
const init = (appConfig, platformConfig, routes, metaData) => {
  // 写入favicon
  if (platformConfig?.documentIcon) {
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = platformConfig?.documentIcon;
  }

  // 注册端事件
  const endEventLists = ['rendered', 'beforeRouter', 'afterRouter', 'preRequest', 'postRequest'];
  if (metaData && metaData.frontendEvents) {
    for (let index = 0; index < endEventLists.length; index++) {
      const name = endEventLists[index];
      if (name && metaData.frontendEvents[name]) {
        // 确保事件函数中的this指向vm
        evalWrap.bind(Vue.prototype)(metaData, name);
        Vue.prototype[name] = window[name];
      }
    }
  }

  if (window.LcapMicro?.container) {
    if (
      document.currentScript &&
      (!document.head.contains(document.currentScript) || document.currentScript.active === false)
    ) {
      return;
    }

    if (Vue.prototype.$auth?._map) {
      Vue.prototype.$auth._map = undefined;
    }
  }

  window.appInfo = Object.assign(appConfig, platformConfig);

  installFilters(Vue, filters);
  installComponents(Vue, Components);

  // 处理当前语言
  const i18n = setI18nLocale(appConfig);

  Vue.use(LogicsPlugin, metaData);
  Vue.use(RouterPlugin);
  Vue.use(ServicesPlugin, metaData);
  Vue.use(AuthPlugin);
  Vue.use(UtilsPlugin, metaData);
  Vue.use(DataTypesPlugin, { ...metaData, i18nInfo: appConfig.i18nInfo });
  Vue.use(ProcessPlugin);

  // 已经获取过权限接口
  Vue.prototype.hasLoadedAuth = false;

  // 是否已经登录
  Vue.prototype.logined = true;

  // 全局catch error，主要来处理中止组件,的错误不想暴露给用户，其余的还是在控制台提示出来
  Vue.config.errorHandler = (err) => {
    if (err.name === 'Error' && err.message === '程序中止') {
      console.warn('程序中止');
    } else {
      // err，错误对象
      // vm，发生错误的组件实例
      // info，Vue特定的错误信息，例如错误发生的生命周期、错误发生的事件
      console.error(err);
    }
  };

  if (!window?.$toast) {
    window.$toast = window.Vue.prototype.$toast;
  }

  if (window?.rendered) {
    window.rendered();
  }

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

  const router = createRouter(baseRoutes);

  window.VueRouterInstance = router;

  const beforeRouter = window.beforeRouter || Vue.prototype.beforeRouter;

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

  router.beforeEach(
    getAuthGuard({
      router,
      routes,
      authResourcePaths,
      appConfig,
      baseResourcePaths,
    }),
  );
  router.beforeEach(getTitleGuard(appConfig));
  router.beforeEach(microFrontend);

  Vue.use(PiniaVuePlugin);
  const pinia = createPinia();
  Vue.use(VueCompositionAPI);

  const app = new Vue({
    name: 'app',
    router,
    i18n,
    pinia,
    ...App,
  });

  const afterRouter = Vue.prototype.afterRouter;

  afterRouter &&
    router.afterEach(async (to, from) => {
      try {
        if (afterRouter) {
          await afterRouter(to, from);
        }
      } catch (err) {
        console.error('afterRouter error:', err);
      }
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
