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

export function back() {
    if (isMiniApp) {
        navigateBack({ delta: 1 });
        return;
    }

    this.$router.go(-1);
}

export function go(delta) {
    // delta保留整数
    delta = parseInt(delta);

    // 小程序不支持go方法
    if (isMiniApp) {
        if (delta < 0) {
            navigateBack({ delta: Math.abs(delta) });
        } else {
            console.warn('go: 小程序中不支持前进方法');
        }

        return;
    }

    this.$router.go(delta);
}
