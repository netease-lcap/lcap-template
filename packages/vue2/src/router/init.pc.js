export function createRouter({ routes, VueRouter }) {
  return new VueRouter({
    mode: 'history',
    base: window.LcapMicro?.routePrefix,
    routes,
  });
}
