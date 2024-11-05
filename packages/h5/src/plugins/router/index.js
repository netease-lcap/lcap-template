import { encodeUrl, downloadClick, navigateTo, navigateBack, isMiniApp } from '@lcap/core-template';

export function destination(url, target = '_self') {
    if (!url) {
        return
    }

    // 微信小程序跳转
    if (isMiniApp) {
        if (target === '_self' && url?.startsWith('http')) {
            location.href = encodeUrl(url)
        } else {
            navigateTo({ url });
        }
        return;
    }

    if (target === '_self') {
        if (url?.startsWith('http')) {
            location.href = encodeUrl(url)
        } else {
            this.$router.push(url);
        }
    } else {
        downloadClick(url, target);
    }
}

export function back(delta = 1) {
    if (isMiniApp) {
        navigateBack({ delta });
        return;
    }

    this.$router.go(-delta);
}
