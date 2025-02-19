import { createApp, configureCompat } from "vue";
import { createPinia } from 'pinia';
import * as Components from "@/components";
import * as Libraries from "@/libraries";
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
} from "@/common";
import { installComponents, installDirectives, installLibraries } from "@/common/utils";
import { getTitleGuard } from '@/guards'

import App from "./App.vue";
import { setConfig } from "./setConfig";

import "./index.css";

configureCompat({
  MODE: 3,
})

const evalWrap = function (metaData, fnName) {
  metaData && fnName && metaData?.frontendEvents[fnName] && eval(metaData.frontendEvents[fnName]);
};

const $sleep = function () {
  return new Promise((resolve) => {
    this.$nextTick(resolve);
  });
};

const init = (appConfig, platformConfig, routes, metaData) => {
  // 写入favicon
  if (platformConfig?.documentIcon) {
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = platformConfig?.documentIcon;
  }

  // 微前端相关
  if (window.LcapMicro?.container) {
    if (
      document.currentScript &&
      (!document.head.contains(document.currentScript) || document.currentScript.active === false)
    ) {
      return;
    }
  }

  window.appInfo = Object.assign(appConfig, platformConfig);

  const pinia = createPinia();
  const app = createApp(App)

  // 给basic设置配置
  setConfig({ app });

  // 全局catch error，主要来处理中止组件,的错误不想暴露给用户，其余的还是在控制台提示出来
  app.config.errorHandler = (err, vm, info) => {
    if (err.name === "Error" && err.message === "程序中止") {
      console.warn("程序中止");
    } else {
      // err，错误对象
      // vm，发生错误的组件实例
      // info，Vue特定的错误信息，例如错误发生的生命周期、错误发生的事件
      console.error(err);
    }
  };

  // 注册端事件
  const endEventLists = ['rendered', 'beforeRouter', "afterRouter", "preRequest", "postRequest"];
  if (metaData && metaData.frontendEvents) {
    for (let index = 0; index < endEventLists.length; index++) {
      const name = endEventLists[index];
      if (name && metaData.frontendEvents[name]) {
        // 确保事件函数中的this指向app
        evalWrap.bind(app.prototype)(metaData, name);
        app.config.globalProperties[name] = window[name];
      }
    }
  }

  // properties
  app.config.globalProperties.$sleep = $sleep;
  app.config.globalProperties.hasLoadedAuth = false;
  app.config.globalProperties.logined = true;
  if (window.LcapMicro?.container) {
    app.config.globalProperties.$auth._map = undefined;
  }

  installDirectives(app, directives);
  // 注册业务组件
  installComponents(app, Components);
  // 注册依赖库
  installLibraries(app, Libraries);

  app.use(LogicsPlugin, metaData);
  app.use(RouterPlugin);
  app.use(ServicesPlugin, metaData);
  app.use(AuthPlugin);
  app.use(UtilsPlugin, metaData);
  app.use(DataTypesPlugin, { ...metaData, i18nInfo: appConfig.i18nInfo });
  app.use(ProcessPlugin);

  app.use(pinia);

  // rendered 事件
  if (typeof window?.rendered === "function") {
    window.rendered();
  }

  // ------ router begin ------
  const baseResourcePaths = platformConfig.baseResourcePaths || [];
  const authResourcePaths = platformConfig.authResourcePaths || [];
  const baseRoutes = filterRoutes(routes, null, (route, ancestorPaths) => {
    const routePath = route.path;
    const completePath = [...ancestorPaths, routePath].join("/");
    let completeRedirectPath = "";
    const redirectPath = route.redirect;
    if (redirectPath) {
      completeRedirectPath = [...ancestorPaths, redirectPath].join("/");
    }
    return baseResourcePaths.includes(completePath) || completeRedirectPath;
  });

  const router = createRouterInstance(baseRoutes);
  // FIXME: 来点骚操作
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

  app.use(router)
  // ------ router end ------

  // 挂载
  if (window.LcapMicro?.container) {
    const container = window.LcapMicro.container;
    container.innerHTML = "";
    app.mount();
    container.appendChild(app.$el);
  } else {
    app.mount("#app");
  }

  return app;
};

export default {
  init,
};
