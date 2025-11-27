<template>
  <view class="index">
    <web-view :src="url" @message="onWebViewMessage" @load="onWebViewLoad" @error="onWebViewError"></web-view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro';
import qs from 'qs';
import apis from '../../apis';
import { baseUrl, basePath } from '../../utils/config';
import './index.less';

export default {
  data() {
    return {
      url: '',
      shareUrl: '',
    };
  },

  onLoad(options) {
    this.$instance = Taro.getCurrentInstance();
    this.init(options);
  },

  onShow() {
    this.updateUrl();
  },

  onShareAppMessage() {
    return {
      path: `/pages/index/index?detailUrl=${encodeURIComponent(this.shareUrl)}`,
    };
  },

  methods: {
    async init(options) {
      const isFirst = Taro.getStorageSync('isFirst');

      const { detailUrl = baseUrl + basePath.slice(1) } = options;
      let decodeUrl = decodeURIComponent(detailUrl);
      // 设置分享的链接
      this.shareUrl = decodeUrl;

      const [url, search] = decodeUrl.split('?');
      let query = qs.parse(search);

      try {
        if (isFirst) {
          const { code } = await Taro.login();
          const userInfo = await apis.getOpenid({ code });
          query._wx_openid = userInfo?.openid || '';
        }
      } catch (error) {}

      // 标识小程序访问
      query._wx_is_mini = 1;

      // 支持调试模式
      const appBaseInfo = Taro.getAppBaseInfo();
      if (appBaseInfo?.enableDebug) {
        query.lcap_debug = true;
      }

      // 拼接路由参数
      query = this.appendRouterParams(query, this.$instance.router.params);
      this.url = `${url}?${qs.stringify(query)}`;

      // 重置首次标识
      if (isFirst) {
        Taro.setStorageSync('isFirst', false);
      }

      // 设置标题配置
      try {
        this.setBarTitle(url);
      } catch (error) {}
    },

    updateUrl() {
      const pages = Taro.getCurrentPages();
      const currPage = pages[pages.length - 1];

      if (!currPage.data.userinfo) {
        return;
      }

      const { wxHeadImg, wxNickName, wxPhone, wxScanCode, wxLocation } = currPage.data.userinfo || {};

      const [url, search] = this.url.split('?');
      let query = qs.parse(search);

      if (wxNickName) {
        query._wx_nickname = wxNickName;
        query._wx_headimg = wxHeadImg;
      }

      if (wxPhone) {
        query._wx_phone = wxPhone;
      }

      if (wxScanCode) {
        query._wx_scan_code = wxScanCode;
      }

      if (wxLocation) {
        query._wx_location = wxLocation;
      }

      if (wxNickName || wxPhone || wxScanCode || wxLocation) {
        currPage.setData({
          userinfo: null,
        });
        // 拼接路由参数
        query = this.appendRouterParams(query, this.$instance.router.params);

        this.url = `${url}?${qs.stringify(query)}`;
      }
    },

    appendRouterParams(query, params = {}) {
      let newQuery = { ...query };
      if (params) {
        const keys = Object.keys(params);
        keys.forEach((key) => {
          newQuery[key] = params[key];
        });
      }

      delete newQuery.detailUrl;

      return newQuery;
    },

    async setBarTitle(url) {
      let titleList = [];
      try {
        titleList = (await apis.getTitleConfig({})) || [];
      } catch (error) {}

      const reg = /(http|https)\:\/\/[^/]*\/([^?]*)\??(\S*)/;
      const defaultUrl = basePath ? url.replace(basePath, '') : url;
      const [, , result] = reg.exec(defaultUrl) || [];
      let titleInfo = null;
      if (result) {
        titleInfo = titleList?.find((item) => {
          const idx = result.indexOf('/');
          if (~idx) {
            return item.name == result.substring(0, idx);
          }
          return item.name == result;
        });
      } else {
        titleInfo = titleList.find((item) => item.isIndex);
      }

      if (titleInfo) {
        Taro.setNavigationBarTitle({ title: titleInfo?.title });
      }
    },

    onWebViewMessage(event) {
      console.log(`[onWebViewMessage]`, event);
      const { data = [] } = event.detail;

      (data || []).forEach((item) => {
        const { method, params = {} } = item || {};
        // 直接调用
        if (typeof Taro[method] === 'function') {
          Taro[method]({
            ...params,
            success: (res) => {
              console.log(`[onWebViewMessage] 调用${method}成功`, res);
            },
            fail: (err) => {
              console.log(`[onWebViewMessage] 调用${method}失败`, err);
            },
          });
        }
      });
    },

    onWebViewLoad(event) {
      console.log(`[onWebViewLoad]`, event);
    },

    onWebViewError(event) {
      console.log(`[onWebViewError]`, event);
    },
  },
};
</script>
