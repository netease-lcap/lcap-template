/* 仅供小程序使用 */
import qs from 'qs';

/* 小程序环境 */
export const isLcapMiniApp = () => {
  // 这样判断的原因：有用户希望在他们自己的小程序内嵌入webview，所以不能通过__wxjs_environment来判断
  const [_, search] = window.location.href.split('?');
  const query = qs.parse(search);
  if (query._wx_is_mini === '1') {
    return true;
  }

  return localStorage.getItem('_wx_is_mini') === '1';
};

/* 路由跳转 */
export const navigateTo = ({ url }) => {
  if (!isLcapMiniApp()) return;
  const origin = location.origin;
  const detailUrl = encodeURIComponent(`${origin}${url}`);
  const miniUrl = `/pages/index/index?detailUrl=${detailUrl}`;
  window.wx.miniProgram.navigateTo({ url: miniUrl });
};

export const navigateBack = ({ delta = 1 }) => {
  if (!isLcapMiniApp()) return;

  window.wx.miniProgram.navigateBack({ delta });
};

export const redirectTo = ({ url }) => {
  if (!isLcapMiniApp()) return;
  const origin = location.origin;
  const detailUrl = encodeURIComponent(`${origin}${url}`);
  const miniUrl = `/pages/index/index?detailUrl=${detailUrl}`;
  window.wx.miniProgram.redirectTo({ url: miniUrl });
};

/* 跳转到头像昵称页面*/
export const navigateToUserInfoPage = () => {
  if (!isLcapMiniApp()) return;
  const uri = location.href;
  window.wx.miniProgram.navigateTo({ url: `/pages/userinfo/index?redirect_uri=${uri}` });
};

/* 跳转到手机号页面*/
export const navigateToUserPhonePage = () => {
  if (!isLcapMiniApp()) return;
  const uri = location.href;
  window.wx.miniProgram.navigateTo({ url: `/pages/userphone/index?redirect_uri=${uri}` });
};

/* 跳转到扫一扫页面*/
export const navigateScanCodePage = () => {
  if (!isLcapMiniApp()) return;
  const uri = location.href;
  window.wx.miniProgram.navigateTo({ url: `/pages/scancode/index?redirect_uri=${uri}` });
};

/* 跳转到定位页面*/
export const navigateLocationPage = () => {
  if (!isLcapMiniApp()) return;
  const uri = location.href;
  window.wx.miniProgram.navigateTo({ url: `/pages/getlocation/index?redirect_uri=${uri}` });
};

/* 微信webview环境 */
export const isWeixinWebview = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  return /micromessenger/.test(ua);
};

/* 自动注入微信js-sdk */
function autoInjectWxJsSdk() {
  window.addEventListener('load', () => {
    if (isWeixinWebview() && !window.wx) {
      const script = document.createElement('script');
      script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
      document.head.appendChild(script);
    }
  });
}

autoInjectWxJsSdk();
