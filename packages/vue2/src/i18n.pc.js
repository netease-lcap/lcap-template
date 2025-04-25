import Vue from 'vue';
import VueI18n from 'vue-i18n';

export function setI18nLocale(appConfig) {
  let locale = 'zh-CN';
  if (appConfig.i18nInfo) {
    const { I18nList, messages } = appConfig.i18nInfo;
    locale = getUserLanguage(appConfig, messages);
    // 重置当前生效语言
    appConfig.i18nInfo.locale = locale;
    appConfig.i18nInfo.currentLocale = locale;
    // 设置当前语言名称
    appConfig.i18nInfo.localeName = I18nList?.find((item) => item.id === locale)?.name;
    // 设置当前语言的翻译信息
    Vue.prototype.$CloudUILang = locale;

    Object.keys(messages).forEach((key) => {
      if (Vue.prototype.$CloudUIMessages[key]) {
        Object.assign(Vue.prototype.$CloudUIMessages[key], messages[key]);
      } else {
        Vue.prototype.$CloudUIMessages[key] = messages[key];
      }
    });
  }
  const i18nInfo = appConfig.i18nInfo;
  const i18n = new VueI18n({
    locale: locale,
    messages: i18nInfo.messages,
  });
  window.$i18n = i18n;

  return i18n;
}

function getUserLanguage(appConfig, messages = {}) {
  let locale = localStorage.i18nLocale;
  // 如果local里没有就读主应用的默认语言
  if (!messages[locale]) {
    // 如果当前浏览器的设置也没有，就读取主应用的默认语言
    locale = navigator.language || navigator.userLanguage;

    if (!messages[locale]) {
      // 如果不在列表中，获取语言代码的前两位
      let baseLang = locale.substring(0, 2);
      const languageList = Object.keys(messages);
      // 查找列表中是否有与基础语言代码相同的项
      let match = languageList.find((lang) => lang.startsWith(baseLang));
      // 如果存在前两位一样的就用这个
      if (match) {
        locale = match;
      } else {
        // 如果不存在，就用默认语言
        locale = appConfig.i18nInfo.locale || 'zh-CN';
      }
    }
  }
  return locale;
}
