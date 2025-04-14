import Vue from 'vue';
import { installOptions, installFilters, installComponents, installDirectives, install } from '@vusion/utils';

import * as Components from '@/components';

import './setConfig';

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
  createService,
} from '@/common';

import { getTitleGuard } from './router';

import App from './App.vue';
import { setI18nLocale } from './i18n';
import mixins from './mixins';

Vue.config.productionTip = false;

window.$sleep = function () {
  return new Promise((resolve) => {
    this.$nextTick(resolve);
  });
};
Vue.prototype.$sleep = window.$sleep;

// 全局混入
window.$mixins = mixins;

window._lcapCreateService = createService;
window.LcapInstall = install;

installOptions(Vue);
installDirectives(Vue, directives);

const fnList = ['afterRouter'];
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
    )
      return;

    if (Vue.prototype.$auth?._map) Vue.prototype.$auth._map = undefined;
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
  Vue.config.errorHandler = (err, vm, info) => {
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

  const beforeRouter = Vue.prototype.beforeRouter;
  const getAuthGuard =
    (router, routes, authResourcePaths, appConfig, baseResourcePaths, beforeRouter) => async (to, from, next) => {
      try {
        if (beforeRouter) {
          const event = {
            baseResourcePaths,
            router,
            routes,
            authResourcePaths,
            appConfig,
            beforeRouter,
            to,
            from,
            next,
            parsePath,
            getBasePath,
            filterAuthResources,
            findNoAuthView,
            filterRoutes,
          };
          await beforeRouter(event);
        } else {
          next();
        }
      } catch (err) {
        console.error('beforeRouter error:', err);
        next();
      }
    };
  beforeRouter &&
    router.beforeEach(
      getAuthGuard(router, routes, authResourcePaths, appConfig, baseResourcePaths, window.beforeRouter),
    );
  router.beforeEach(getTitleGuard(appConfig));
  router.beforeEach(microFrontend);

  const app = new Vue({
    name: 'app',
    router,
    i18n,
    ...App,
  });

  const afterRouter = Vue.prototype.afterRouter;

  afterRouter &&
    router.afterEach(async (to, from, next) => {
      try {
        if (afterRouter) {
          await afterRouter(to, from);
        }
      } catch (err) {}
    });

  if (window.LcapMicro?.container) {
    const container = window.LcapMicro.container;
    container.innerHTML = '';
    app.$mount();
    container.appendChild(app.$el);
  } else app.$mount('#app');

  return app;
};

export default {
  init,
};
