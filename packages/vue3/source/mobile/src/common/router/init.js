
import { createRouter, createWebHistory } from 'vue-router';

export function createRouterInstance(routes) {
  const router = createRouter({
    history: createWebHistory(window.LcapMicro?.routePrefix || import.meta.env.BASE_URL),
    routes,
  })

  return router;
}
