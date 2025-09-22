export function createRouter({ routes, VueRouter }) {
  const router = new VueRouter({
    mode: window.LcapVueRouterConfig?.mode || 'history',
    base: window.LcapMicro?.routePrefix,
    routes,
  });

  if (window.LcapVueRouterConfig?.initRoute) {
    router.replace(window.LcapVueRouterConfig.initRoute);
  }

  return router;
}
