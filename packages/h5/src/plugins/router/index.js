import { encodeUrl, downloadClick, wx } from "@lcap/core-template";

export function destination(url, target = "_self", replace = false) {
  if (!url) {
    return;
  }

  // 微信小程序跳转
  if (wx.isMiniApp) {
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
  if (wx.isMiniApp) {
    wx.navigateBack({ delta: 1 });
    return;
  }

  window.VueRouterInstance?.back();
}

export function go(delta) {
  // delta保留整数
  delta = parseInt(delta, 10);

  // 小程序不支持go方法
  if (wx.isMiniApp) {
    if (delta < 0) {
      wx.navigateBack({ delta: Math.abs(delta) });
    } else {
      console.warn("go: 小程序中不支持前进方法");
    }

    return;
  }

  window.VueRouterInstance?.go(delta);
}
