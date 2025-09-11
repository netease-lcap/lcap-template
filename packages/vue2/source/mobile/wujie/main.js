import "./public-path";
import cloudAdminDesigner from "./init.js";
import metaData from "./meta-data";
import platformConfig from "./platform.config.json";
import { routes } from "./router/routes.js";
import "./library.js";

if (!window.__POWERED_BY_WUJIE__) {
  cloudAdminDesigner.init(platformConfig?.appConfig, platformConfig, routes, metaData);
}
let appVM;

window.__WUJIE_MOUNT = () => {
  window.LcapMicro = window.LcapMicro || {};
  Object.assign(window.LcapMicro, __properties__);

  if (window.LcapMicro.noAuthUrl && !window.LcapMicro.noAuthFn) {
    window.LcapMicro.noAuthFn = () => {
      location.href = window.LcapMicro.noAuthUrl;
    };
  }

  if (window.LcapMicro.loginUrl && !window.LcapMicro.loginFn) {
    window.LcapMicro.loginFn = () => {
      location.href = window.LcapMicro.loginUrl;
    };
  }

  if (window.LcapMicro.notFoundUrl && !window.LcapMicro.notFoundFn) {
    window.LcapMicro.notFoundFn = () => {
      location.href = window.LcapMicro.notFoundUrl;
    };
  }

  window.LcapMicro.container = document.querySelector("#app");
  window.LcapMicro.props = window.$wujie?.props;
  appVM = cloudAdminDesigner.init(platformConfig?.appConfig, platformConfig, routes, metaData);
};

window.__WUJIE_UNMOUNT = () => {
  window.LcapMicro.container.innerHTML = null;
  appVM?.$destroy();
  document.querySelectorAll("script.lazyload").forEach((ele) => {
    ele.active = false;
  });
};
