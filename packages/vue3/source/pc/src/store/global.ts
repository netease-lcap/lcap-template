import { defineStore } from "pinia";
export const useGlobalStore = defineStore("global", {
  state: () => ({
    userInfo: window.$global.userInfo,
    frontendVariables: window.$global.frontendVariables,
  }),
});
