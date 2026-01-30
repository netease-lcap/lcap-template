export function initScale(canvasWidth: number) {
  // 验证 canvasWidth 是否为有效的正数
  const width = Number(canvasWidth);
  if (!Number.isFinite(width) || width <= 0) {
    console.warn('initScale: canvasWidth must be a finite number greater than 0, received:', canvasWidth);
    return;
  }
  const validCanvasWidth = width;

  // mobile 用 viewport 缩放，pc 和 ipad 用 iframe 缩放
  if (navigator.userAgent.match(/mobile/i)) {
    // 使用viewport缩放，用js计算viewport的缩放比例
    // 先查找已存在的 viewport meta，如果没有则创建并添加到 DOM
    let meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no';
      document.head.appendChild(meta);
    }
    function scalePage() {
      // 计算缩放比例
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const baseWidth = validCanvasWidth;
      const scale = windowWidth / baseWidth;
      // 设置viewport缩放
      meta.content =
        'width=' +
        baseWidth +
        ' , initial-scale=' +
        scale +
        ', maximum-scale=' +
        scale +
        ', minimum-scale=' +
        scale +
        ', user-scalable=no';
    }
    // 初始化缩放
    scalePage();
  } else {
    // 如果是顶层页面，才使用iframe缩放，否则会死循环
    if (!window.frameElement || !window.frameElement.getAttribute('isScaledFrame')) {
      // 顶层页面里有个iframe，用来缩放页面
      document.body.innerHTML = '<iframe src="' + location.href + '"></iframe>';
      const iframe = document.querySelector('iframe');
      function scalePage() {
        // 计算缩放比例
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const baseWidth = validCanvasWidth;
        const scale = windowWidth / baseWidth;
        // iframe 按比例缩放
        iframe.style.transform = 'scale(' + scale + ')';
        iframe.style.transformOrigin = '0 0';
        // iframe 的宽高需要缩放回去，使其等于顶层宽高
        iframe.style.width = baseWidth + 'px';
        iframe.style.height = 100 / scale + 'vh';
        // 消除底部白边，参考：stackoverflow.com/a/21025344/5710452
        iframe.style.display = 'block';
        let marginRight = '0px';
        let marginBottom = '0px';
        if (scale < 1) {
          marginRight = ((scale - 1) / scale) * 100 + '%';
          // 由于 marginBottom 的百分比也是基于宽度的，因此需要乘以 windowHeight / windowWidth
          marginBottom = ((((scale - 1) / scale) * windowHeight) / windowWidth) * 100 + '%';
        }
        iframe.style.marginRight = marginRight;
        iframe.style.marginBottom = marginBottom;
      }
      // 监听窗口变化
      window.addEventListener('resize', scalePage);
      // 初始化缩放
      scalePage();
      // 禁止滚动条，原因：缩放后会出现滚动条
      document.documentElement.style.setProperty('--scrollbar-size', '0');
      // 移除 iframe 边框
      iframe.style.border = 'none';
      // 标记全局缩放的iframe，原因：全局缩放页面可能在 iframe 中
      iframe.setAttribute('isScaledFrame', 'true');
      return;
    } else {
      // 点击跳转到外部页面时，通知顶层页面
      document.body.addEventListener('click', (e) => {
        const target = e.target as HTMLAnchorElement;
        if (!target.href) return;
        if (typeof target.href !== 'string') return;
        if (target.tagName !== 'A') return;
        if (target.download) return;
        try {
          const url = new URL(target.href);
          // 只有绝对路径且不是新窗口打开的链接修改顶层页面地址
          if (target.getAttribute('href')?.startsWith('http') && target.target !== '_blank') {
            parent.location.href = target.href;
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  }
}

export function afterEachInScale() {
  // 同步逻辑仅在 iframe 内部执行
  if (window.frameElement && window.frameElement.getAttribute('isScaledFrame')) {
    /**
     * iframe 路由同步的几种情况：
     * 1. 跳转时，iframe 同步到顶层
     * 2. 回退时，顶层同步到 iframe，经测试，即便在 iframe 里调用 back 也会先触发顶层回退
     * 3. 前进时，iframe 同步到顶层
     * 原因：顶层永远在 iframe 后面
     */
    // 自增ID，用于判断路由是否回退
    let incrementID = 0;
    // 当前历史ID，用于判断路由是否回退
    let curHID = 0;
    // 当前顶层历史ID，用于判断顶层路由是否回退
    let curParentHID = 0;
    // 是否是回退
    let isBack = false;
    // 是否是前进
    let isForward = false;
    window.VueRouterInstance?.afterEach((to, from) => {
      if (isBack) {
        // 重置回退状态
        isBack = false;
        return;
      }
      // iframe 前进时，需要让顶层页面也前进
      if (isForward) {
        isForward = false;
        window.parent.history.forward();
        return;
      }
      // 自增ID，用于判断路由是否回退
      incrementID++;
      window.history.replaceState({ HID: incrementID }, '');
      // iframe 路由变化时，需要同步顶层页面的路由
      window.parent.history.pushState({ HID: incrementID }, '', to.fullPath);
      // iframe 路由变化时，title 也要同步
      window.parent.document.title = document.title;
      // 更新当前历史ID
      curHID = incrementID;
      curParentHID = incrementID;
    });
    window.addEventListener('popstate', function (e) {
      // 如果有 state，但没有 HID，说明是未知跳转，不判定前进后退
      if (e.state && e.state.HID === undefined) return;
      if (curHID > (e.state ? e.state.HID : undefined)) {
        isBack = true;
      } else {
        isForward = true;
      }
      // 更新当前历史ID
      curHID = e.state ? e.state.HID : 0;
    });
    // 顶层页面路由回退时，需要同步 iframe 的路由
    window.parent.addEventListener('popstate', function (e) {
      if (curParentHID > (e.state ? e.state.HID : undefined)) {
        window.VueRouterInstance?.back();
      }
      // 更新当前顶层历史ID
      curParentHID = (e.state ? e.state.HID : undefined) || 0;
    });
    // 首次加载同步 title 和 shortcut icon
    window.parent.document.title = document.title;
    const shortcutIconLink = document.querySelector('link[rel="shortcut icon"]');
    if (shortcutIconLink) {
      parent.document.head.appendChild(shortcutIconLink);
    }
  }
}
