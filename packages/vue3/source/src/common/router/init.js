import { createRouter, createWebHistory, createMemoryHistory, createWebHashHistory} from 'vue-router';

export function createRouterInstance(routes) {
  const fnMap = {
    history: createWebHistory,
    abstract: createMemoryHistory,
    hash: createWebHashHistory,
  }
  const mode = window.LcapVueRouterConfig?.mode || 'history';
  const createHistory = fnMap[mode] || fnMap.history;
  if (!fnMap[mode]) {
    console.warn(`Unknown router mode: ${mode}, falling back to history mode`);
  }

  const router = createRouter({
    history: createHistory(window.LcapMicro?.routePrefix),
    routes,
    sensitive: true,
  });

  router.afterEach((to) => {
    const miniEnvQueryList = [
      '_wx_openid',
      '_wx_headimg',
      '_wx_nickname',
      '_wx_phone',
      '_wx_scan_code',
      '_wx_location',
      '_wx_is_mini',
    ];
    if (to.query) {
      for (const i in to.query) {
        if (miniEnvQueryList.includes(i)) {
          window.localStorage.setItem(i, to.query[i]);
        }
      }
    }
  })

  if (window.LcapVueRouterConfig?.initRoute) {
    router.replace(window.LcapVueRouterConfig.initRoute);
  }

  return router;
}
