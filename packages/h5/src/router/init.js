export function createRouter({ routes, VueRouter }) {
  const router = new VueRouter({
    mode: "history",
    base: window.LcapMicro?.routePrefix || process.env.BASE_URL,
    routes,
  });

  //  微信小程序环境下才需要这个逻辑
  if (window.__wxjs_environment === "miniprogram") {
    router.beforeEach((to, from, next) => {
      // 这些参数是微信传过来的，web端转存在localStorage中， 所以web端查询都是在localStorage中查询
      const wx_query_list = [
        "_wx_is_mini",
        "_wx_openid",
        "_wx_headimg",
        "_wx_nickname",
        "_wx_phone",
        "_wx_scan_code",
        "_wx_location",
      ];

      if (to.query) {
        for (const key in to.query) {
          if (wx_query_list.includes(key)) {
            window.localStorage.setItem(key, to.query[key]);
          }
        }
      }

      next();
    });
  }

  return router;
}
