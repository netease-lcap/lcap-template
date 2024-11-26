import Vue from "vue";

declare global {
  interface Window {
    appVue: any;
    Vue: any;
  }
}

window.appVue = Vue;
window.Vue = Vue;
