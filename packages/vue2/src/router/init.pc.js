/**
 * 创建路由实例
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

export function createRouter(routes) {
  Vue.use(VueRouter);

  const router = new VueRouter({
    mode: window.LcapVueRouterConfig?.mode || 'history',
    base: window.LcapMicro?.routePrefix,
    routes,
  });
  /**
   * 将路由实例挂载到window对象
   * 作用：提供全局访问路由实例的能力
   */
  window.VueRouterInstance = router;

  if (window.LcapVueRouterConfig?.initRoute) {
    router.replace(window.LcapVueRouterConfig.initRoute);
  }

  return router;
}
