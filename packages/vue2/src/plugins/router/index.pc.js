import { encodeUrl, downloadClick } from "@/common";

export function destination(url, target = "_self", replace = false) {
  if (target === "_self") {
    // 修复访问路径为默认首页 / 时跳转可能失效的问题
    if (url.startsWith("http")) {
      location.href = encodeUrl(url);
    } else {
      // 处理同页面锚点跳转无效的问题
      const beforeHashUrl = url.slice(0, url.indexOf("#"));
      if (url.indexOf("#") !== -1 && beforeHashUrl.indexOf(location.pathname) !== -1) {
        const hash = url.slice(url.indexOf("#"))?.replace("#", "");
        if (document.getElementById(hash)) {
          document.getElementById(hash).scrollIntoView();
        }

        if (replace) {
          window.VueRouterInstance?.replace(url);
        } else {
          window.VueRouterInstance?.push(url);
        }

        return;
      }

      if (replace) {
        window.VueRouterInstance?.replace(url);
      } else {
        window.VueRouterInstance?.push(url);
      }
    }
  } else {
    downloadClick(url, target);
  }
}

export function back() {
  window.VueRouterInstance?.back();
}

export function go(delta) {
  window.VueRouterInstance?.go(delta);
}
