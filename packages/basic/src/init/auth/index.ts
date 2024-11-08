import authService from "./authService";
import type { NASLUserInfo } from "./authService";
import Global from "../../global";

function initAuth(
  options: {
    allowList?: string[];
    router?: any;
    base?: string;
  } = {},
) {
  authService.start();
  options.allowList = options.allowList || [];
  const router = options.router;
  const base = (options.base || "").replace(/\/$/, "");
  /**
   * 是否有当前路由下的子权限
   * 该方法只能在 Global 中调用
   * @param {*} subPath 子权限路径，如 /createButton/enabled
   */
  authService.hasSub = function (subPath) {
    const currentPath = base + router.currentRoute.path;
    if (subPath[0] !== "/") subPath = "/" + subPath;
    return this.has(currentPath + subPath);
  };
  authService.hasFullPath = function (path) {
    if (path[0] !== "/") path = "/" + path;
    return this.has(base + path);
  };

  /**
   * 账号与权限中心
   */
  window.$auth = authService;
  Global.prototype.$auth = authService;

  return {
    auth: authService,
  };
}

export { initAuth, authService };

export type { NASLUserInfo };
