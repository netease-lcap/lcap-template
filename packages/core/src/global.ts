import Vue from "vue";

declare global {
  interface Window {
    appVue: typeof Vue;
  }
}

window.appVue = Vue;
window.Vue = Vue;
