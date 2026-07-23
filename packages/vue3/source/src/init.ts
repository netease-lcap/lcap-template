import { createApp } from 'vue';
import { createPinia } from 'pinia';

import '@/global';
import * as UIMCP from '@lcap/ui-libraries-mcp';
import * as Components from '@/components';
import * as Libraries from '@/libraries';
import {
  directives,
  AuthPlugin,
  DataTypesPlugin,
  LogicsPlugin,
  RouterPlugin,
  ServicesPlugin,
  UtilsPlugin,
  ProcessPlugin,
  createRouterInstance,
  microFrontend,
  filterRoutes,
  parsePath,
  getBasePath,
  filterAuthResources,
  findNoAuthView,
} from '@/common';
import { installComponents, installDirectives, installLibraries } from '@/common/utils';
import { getTitleGuard } from '@/router/guards';

import App from './App.vue';
import { createI18nInstance } from './i18n';
import { setConfig } from './setConfig';
import { setFavicon } from './utils';

// 注册组件库MCP JSON
try {
  const registerTool = UIMCP.registerTool;
  if (typeof registerTool === 'function' && window.lcapStandardUI?.mcpToolJson?.result?.tools) {
    registerTool(window.lcapStandardUI.mcpToolJson?.result.tools);
  }
} catch (error) {
  console.error('注册组件库MCP JSON失败:', error);
}

const init = async (appConfig, platformConfig, routes, metaData) => {
  /**
   * 合并应用配置和平台配置至window.appInfo
   */
  window.appInfo = Object.assign(appConfig, platformConfig);

  /**
   * 设置页面图标（favicon）
   */
  if (platformConfig?.documentIcon) {
    setFavicon(platformConfig?.documentIcon);
  }

  /**
   * 微前端场景判断
   * 如果当前脚本不是在头部或脚本未激活，则不执行初始化
   */
  if (window.LcapMicro?.container && window.ICESTARK && window.ICESTARK.root) {
    if (
      document.currentScript &&
      (!document.head.contains(document.currentScript) || document.currentScript.active === false)
    ) {
      return;
    }
  }

  const pinia = createPinia();
  const app = createApp(App);

  // 给basic设置配置
  setConfig({ app });

  /**
   * Vue全局错误捕获
   */
  app.config.errorHandler = (err: Error) => {
    if (err.name === 'Error' && err.message === '程序中止') {
      console.warn('程序中止');
    } else {
      console.error(err);
    }
  };

  // 注册端事件
  const endEventLists = ['rendered', 'beforeRouter', 'afterRouter', 'preRequest', 'postRequest'];
  if (metaData && metaData.frontendEvents) {
    for (let index = 0; index < endEventLists.length; index++) {
      const name = endEventLists[index];
      if (metaData.frontendEvents[name]) {
        const evalWrap = function (code: string) {
          code && eval(code);
        };
        // 确保事件函数中的this指向app
        evalWrap.bind(app.config.globalProperties)(metaData.frontendEvents[name]);
        app.config.globalProperties[name] = window[name];
      } else if (window[name] && typeof window[name] === 'function') {
        window[name] = window[name].bind(app.config.globalProperties);
        app.config.globalProperties[name] = window[name];
      }
    }
  }

  installDirectives(app, directives);
  // 注册业务组件
  installComponents(app, Components);
  // 注册依赖库
  installLibraries(app, Libraries);

  /**
   * 国际化实例
   * 一定要放在DataTypesPlugin之前注册，因为数据类型插件中会用到国际化实例
   */
  app.use(createI18nInstance(appConfig));

  app.use(LogicsPlugin, metaData);
  app.use(RouterPlugin);
  app.use(ServicesPlugin, metaData);
  app.use(AuthPlugin);
  app.use(UtilsPlugin, metaData);
  app.use(DataTypesPlugin, { ...metaData, i18nInfo: appConfig.i18nInfo });
  app.use(ProcessPlugin);

  app.use(pinia);

  // rendered 事件
  if (typeof window?.rendered === 'function') {
    await window.rendered({
      appConfig,
      platformConfig,
      routes,
      metaData,
    });
  }

  // ------ router begin ------
  const baseResourcePaths = platformConfig.baseResourcePaths || [];
  const authResourcePaths = platformConfig.authResourcePaths || [];

  const router = createRouterInstance(routes);

  window.VueRouterInstance = router;

  const beforeRouter = window.beforeRouter;
  if (beforeRouter) {
    router.beforeEach(async (to, from, next) => {
      try {
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
      } catch (err) {
        console.error('beforeRouter error:', err);
        next();
      }
    });
  }

  router.beforeEach(getTitleGuard(appConfig));
  router.beforeEach(microFrontend);

  const afterRouter = window.afterRouter;
  if (afterRouter) {
    router.afterEach(async (to, from) => {
      try {
        await afterRouter(to, from);
      } catch (err) {
        console.error(err);
      }
    });
  }

  app.use(router);
  // ------ router end ------

  // 挂载
  if (window.LcapMicro?.container) {
    const container = window.LcapMicro.container;
    container.innerHTML = '';
    app.mount(container);
  } else {
    app.mount('#app');
  }

  return app;
};

export default {
  init,
};
