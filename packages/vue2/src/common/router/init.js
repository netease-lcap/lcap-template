import Vue from "vue";
import VueRouter from "vue-router";
import { Config } from "@lcap/basic-template";

export function createRouter(routes) {
  Vue.use(VueRouter);

  const router = Config?.router?.createRouter({ routes, VueRouter });

  return router;
}
