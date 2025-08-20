import Vue from 'vue';
import VueRouter from 'vue-router';
import { Config } from '@lcap/basic-template';

export function createRouter(routes) {
  Vue.use(VueRouter);

  const router = Config?.router?.createRouter({ routes, VueRouter });
  /**
   * 将路由实例挂载到window对象
   * 作用：提供全局访问路由实例的能力
   */
  window.VueRouterInstance = router;

  return router;
}
