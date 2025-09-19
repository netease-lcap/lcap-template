import { createRouter, createWebHistory, createMemoryHistory, createWebHashHistory} from 'vue-router';

export function createRouterInstance(routes) {
  const fnMap = {
    history: createWebHistory,
    memory: createMemoryHistory,
    hash: createWebHashHistory,
  }
  const createHistory = fnMap[window.LcapVueRouterConfig?.mode || 'history']
  const router = createRouter({
    history: createHistory(window.LcapMicro?.routePrefix),
    routes,
  });

  if (window.LcapVueRouterConfig?.initRoute) {
    router.replace(window.LcapVueRouterConfig.initRoute);
  }

  return router;
}
