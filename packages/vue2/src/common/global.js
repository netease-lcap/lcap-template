import Vue from 'vue';
import { camelCase } from 'lodash';

window.appVue = Vue;
window.Vue = Vue;

window.$camelCase = Vue.prototype.$camelCase = camelCase;
