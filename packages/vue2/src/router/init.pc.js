export function createRouter({ routes, VueRouter }) {
  return new VueRouter({
    mode: 'history',
    base: window.LcapMicro?.routePrefix || process.env.BASE_URL,
    routes,
  });
}
