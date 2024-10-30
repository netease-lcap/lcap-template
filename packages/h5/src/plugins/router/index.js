import { encodeUrl, downloadClick, navigateTo, isMiniApp } from '@lcap/core-template';

export function destination(url, target = '_self') {
    if (!url) {
        return
    }

    if (target === '_self') {
        // 修复访问路径为默认首页 / 时跳转可能失效的问题
        if (url?.startsWith('http')) {
            location.href = encodeUrl(url)
        } else {
            /* 判断是否在小程序当中 */
            if (isMiniApp) {
                navigateTo({ url });
            } else {
                this.$router.push(url);
            }
        }
    } else {
        if (isMiniApp) {
            navigateTo({ url });
        } else {
            downloadClick(url, target);
        }
    }
}
