import Vue from 'vue';
import { cookie, storage, authService, getBasePath } from '@lcap/core-template';

export const utils = {
    hasAuth(authPath) {
        return authService.has(authPath);
    },
    logout() {
        // FIXME 从全局变量中获取
        Vue.prototype
            .$confirm({
                title: '提示',
                message: '确定退出登录吗?',
                content: '确定退出登录吗？',
            })
            .then(async () => {
                try {
                    await authService.logout();
                } catch (error) {
                    console.warn(error);
                }
                storage.set('Authorization', '');
                // cookie.eraseAll();
                cookie.erase('authorization');
                cookie.erase('username');
                window.location.href = `${getBasePath()}/login`;
            })
            .catch(() => {
                // on cancel
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
        // 更新当前模板的语言
        //appVM.$i18n.locale = newLocale;
        // 调用UI库更新当前语言
        window.Vue.prototype.$vantLang = newLocale;
        // 重新加载页面
        window.location.reload();
    },
}
