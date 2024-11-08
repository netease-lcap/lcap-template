import { formatMicroFrontUrl, formatMicroFrontRouterPath } from "./microFrontUrl";

import Config from "../../config";
import Global from "../../global";

function initRouter() {
  function $destination(...args) {
    Config.router?.destination?.call(this, ...args);
  }

  async function $link(url, target = "_self") {
    let realUrl;
    if (typeof url === "function") {
      realUrl = await url();
    } else if (url?.charAt(0) === "/") {
      Config.router?.destination?.call(this, url, target);
      return;
    } else {
      realUrl = url;
    }
    downloadClick(realUrl, target);
  }

  function $toQueryString(params) {
    const query = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    return query.length > 0 ? `?${query}` : "";
  }

  Global.prototype.$destination = $destination;
  Global.prototype.$link = $link;

  Global.prototype.$formatMicroFrontUrl = formatMicroFrontUrl;
  Global.prototype.$formatMicroFrontRouterPath = formatMicroFrontRouterPath;

  Global.prototype.$toQueryString = $toQueryString;

  return {
    formatMicroFrontUrl: formatMicroFrontUrl,
    formatMicroFrontRouterPath: formatMicroFrontRouterPath,
    link: $link,
    destination: $destination,
  };
}

function downloadClick(realUrl, target) {
  const a = document.createElement("a");
  a.setAttribute("href", realUrl);
  a.setAttribute("target", target);
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
  }, 500);
}

export { initRouter, downloadClick };

export * from "./microFrontUrl";
