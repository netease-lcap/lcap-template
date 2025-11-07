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

  if (window.LcapVueRouterConfig?.initRoute) {
    router.replace(window.LcapVueRouterConfig.initRoute);
  }

  return router;
}
