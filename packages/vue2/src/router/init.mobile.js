export function createRouter({ routes, VueRouter }) {
  const router = new VueRouter({
    mode: 'history',
    base: window.LcapMicro?.routePrefix,
    routes,
  });

  router.afterEach((to, from) => {
    const saveList = [
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
        if (saveList.includes(i)) {
          window.localStorage.setItem(i, to.query[i]);
        }
      }
    }
  });
  return router;
}
