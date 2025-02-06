import { encodeUrl, downloadClick, wx } from "@/common";

export function destination(url, target = "_self", replace = false) {
  if (!url) {
    return;
  }

  // 微信小程序跳转
  if (wx.isLcapMiniApp()) {
    if (target === "_self" && url?.startsWith("http")) {
      location.href = encodeUrl(url);
    } else {
      if (replace) {
        wx.redirectTo({ url });
      } else {
        wx.navigateTo({ url });
      }
    }
    return;
  }

  if (target === "_self") {
    if (url?.startsWith("http")) {
      location.href = encodeUrl(url);
    } else {
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
  if (wx.isLcapMiniApp()) {
    wx.navigateBack({ delta: 1 });
    return;
  }

  window.VueRouterInstance?.back();
}

export function go(delta) {
  // delta保留整数
  delta = parseInt(delta, 10);

  // 小程序不支持go方法
  if (wx.isLcapMiniApp()) {
    if (delta < 0) {
      wx.navigateBack({ delta: Math.abs(delta) });
    } else {
      console.warn("go: 小程序中不支持前进方法");
    }

    return;
  }

  window.VueRouterInstance?.go(delta);
}
