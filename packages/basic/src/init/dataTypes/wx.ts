/* 仅供小程序使用 */

/* 将路由带http */
const getUrl = (url) => url.startsWith('http') ? url : 'http://' + url;

/* 小程序环境 */
export const isMiniApp = (() => {
  return localStorage.getItem("_wx_is_mini") || window.__wxjs_environment === 'miniprogram'
})()

/* 路由跳转 */
export const navigateTo = ({ url }) => {
    if (!isMiniApp)
        return;
    const origin = location.origin;
    const detailUrl = encodeURIComponent(`${origin}${url}`);
    const miniUrl = `/pages/index/index?detailUrl=${detailUrl}`;
    window.wx.miniProgram.navigateTo({ url: miniUrl });
};

export const navigateBack = ({
  delta = 1
}) => {
  if (!isMiniApp) return;
  
  window.wx.miniProgram.navigateBack({ delta });
}

export const redirectTo = ({ url }) => {
    if (!isMiniApp)
        return;
    const origin = location.origin;
    const detailUrl = encodeURIComponent(`${origin}${url}`);
    const miniUrl = `/pages/index/index?detailUrl=${detailUrl}`;
    window.wx.miniProgram.redirectTo({ url: miniUrl });
};

/* 跳转到头像昵称页面*/
export const navigateToUserInfoPage = () => {
    if (!isMiniApp)
        return;
    const uri = location.href;
    window.wx.miniProgram.navigateTo({ url: `/pages/userinfo/index?redirect_uri=${uri}` });
};

/* 跳转到手机号页面*/
export const navigateToUserPhonePage = () => {
    if (!isMiniApp)
        return;
    const uri = location.href;
    window.wx.miniProgram.navigateTo({ url: `/pages/userphone/index?redirect_uri=${uri}` });
};

/* 跳转到扫一扫页面*/
export const navigateScanCodePage = () => {
    if (!isMiniApp)
        return;
    const uri = location.href;
    window.wx.miniProgram.navigateTo({ url: `/pages/scancode/index?redirect_uri=${uri}` });
};

/* 跳转到定位页面*/
export const navigateLocationPage = () => {
    if (!isMiniApp)
        return;
    const uri = location.href;
    window.wx.miniProgram.navigateTo({ url: `/pages/getlocation/index?redirect_uri=${uri}` });
};
