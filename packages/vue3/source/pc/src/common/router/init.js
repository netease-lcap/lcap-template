import { createRouter, createWebHistory } from 'vue-router';

export function createRouterInstance(routes) {
  const router = createRouter({
    history: createWebHistory(window.LcapMicro?.routePrefix),
    routes,
  });

  return router;
}
