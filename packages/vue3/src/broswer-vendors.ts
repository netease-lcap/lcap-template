import * as Vue from 'vue';
import * as VueRouter from 'vue-router';
import * as Pinia from 'pinia';
import * as VueI18n from 'vue-i18n';
import * as VueCompilerSFC from 'vue/compiler-sfc';
import lodash from 'lodash';

declare global {
  interface Window {
    Vue: typeof Vue;
    VueRouter: typeof VueRouter;
    Pinia: typeof Pinia;
    VueI18n: typeof VueI18n;
    VueCompilerSFC: typeof VueCompilerSFC;
    Lodash: typeof lodash;
  }
}

window.Vue = Vue;
window.VueRouter = VueRouter;
window.Pinia = Pinia;
window.VueI18n = VueI18n;
window.VueCompilerSFC = VueCompilerSFC;
window.Lodash = lodash;
