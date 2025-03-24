import Vue from 'vue';
import { cookie } from '@/common';

export const utils = {
  logout() {
    const $confirm = typeof Vue.prototype.$confirm === 'function' ? Vue.prototype.$confirm : () => Promise.resolve();
    $confirm({
      title: '提示',
      content: '确定退出登录吗？',
      message: '确定退出登录吗?',
    })
      .then(() => Vue.prototype.$auth.logout())
      .then(() => {
        cookie.erase('authorization');
        cookie.erase('username');
        location.reload();
      });
  },
  setI18nLocale(newLocale) {
    // 修改local中的存储的语言标识
    localStorage.i18nLocale = newLocale;
    // 修改当前template的语言
    window.$global.i18nInfo.locale = newLocale;
    window.$global.i18nInfo.currentLocale = newLocale;
    // 修改当前语言名称
    window.$global.i18nInfo.localeName = window.$global.getI18nList().find((item) => item.id === newLocale)?.name;
    // 调用UI库更新当前语言
    //appVM.$i18n.locale = newLocale;
    // 调用UI库更新当前语言
    window.Vue.prototype.$CloudUILang = newLocale;
    // 重新加载页面
    window.location.reload();
  },
};
