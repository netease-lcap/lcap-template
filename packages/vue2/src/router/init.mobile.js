import Vue from 'vue';
import VueRouter from 'vue-router';

export function createRouter(routes) {
  Vue.use(VueRouter);

  const router = new VueRouter({
    mode: 'history',
    base: window.LcapMicro?.routePrefix || process.env.BASE_URL,
    routes,
  });

  /**
   * 将路由实例挂载到window对象
   * 作用：提供全局访问路由实例的能力
   */
  window.VueRouterInstance = router;

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
