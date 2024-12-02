<template>
  <view class="index">
    <web-view :src="url"></web-view>
  </view>
</template>

<script>
import "./index.less";
import Taro from "@tarojs/taro";
import apis from "../../apis";
import { baseUrl, basePath } from "../../utils/config"
import { set as setGlobalData, get as getGlobalData } from "../../global_data";

export default {
  data() {
    return {
      // web-view展示的url
      url: "",
      // 头像
      wxHeadImg: "",
      // 昵称
      wxNickName: "",
      // 手机号
      wxPhone: "",
      // 扫码
      wxScanCode: "",
      // 地址
      wxLocation: "",
      // openid
      wxOpenId: "",
    };
  },
  onLoad(options) {
    this.$instance = Taro.getCurrentInstance();
    this.init(options);
  },
  onShow(options) {
    const {
      detailUrl = baseUrl + basePath.slice(1),
    } = options;

    let url = decodeURIComponent(detailUrl);

    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];

    const {
      wxHeadImg,
      wxNickName,
      wxPhone,
      wxScanCode,
      wxLocation,
    } = currentPage.data;

    url = this.appendUrlParams(url, {
      _wx_openid: this.wxOpenId || getGlobalData("wxOpenId"),
      _wx_headimg: wxHeadImg,
      _wx_nickname: wxNickName,
      _wx_phone: wxPhone,
      _wx_scan_code: wxScanCode,
      _wx_location: wxLocation,
      _wx_is_mini: 1,
      ...(this.$instance.router.params || {}),
    });

    this.url = url;
  },
  methods: {
    async init(options) {
      try {
        const {
          detailUrl = baseUrl + basePath.slice(1),
        } = options;

        let url = decodeURIComponent(detailUrl);
        const userInfo = await this.getOpenid();

        const wxOpenId = userInfo?.openid;
        setGlobalData("wxOpenId", wxOpenId);
        this.wxOpenId = wxOpenId;

        url = this.appendUrlParams(url, {
          _wx_openid: wxOpenId,
          _wx_is_mini: 1,
          ...(this.$instance.router.params || {}),
        });

        // web-view展示的url
        this.url = url;

        const titleList  = await apis.getTitleConfig({}) || []
        setGlobalData("titleList", titleList)
        this.setBarTitle(Array.isArray(titleList) ? titleList : [], url);
      } catch (error) {
        console.log(error);
      }
    },

    async setBarTitle(list = [], decodeUrl) {
      const reg = /(http|https)\:\/\/[^/]*\/([^?]*)\??(\S*)/;
      const defaultUrl = basePath? decodeUrl.replace(basePath, "") : decodeUrl
      const [, , result] = reg.exec(defaultUrl) || []
      let titleInfo = null
      if (result) {
        titleInfo = list?.find((item) => {
          const idx = result.indexOf("/");
          if (~idx) {
            return item.name == result.substring(0, idx);
          }
          return item.name == result;
        });
      } else {
        titleInfo = list.find(item => item.isIndex)
      }
      if (titleInfo) {
        Taro.setNavigationBarTitle({ title: titleInfo?.title });
      }
    },

    async getOpenid() {
      try {
        const { code } = await Taro.login();
        const data = await apis.getOpenid({ code });
        return data;
      } catch (error) {
        console.log('获取openid失败', error);
      }
    },

    // 追加小程序路由上的参数
    appendUrlParams(url, params = {}) {
      let newUrl = url;

      if (params) {
        const keys = Object.keys(params) || [];
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (params[key] === undefined) {
            continue;
          }

          newUrl = `${newUrl}${newUrl.indexOf("?") !== -1 ? "&" : "?"}${key}=${encodeURIComponent(params[key])}`;
        }
      }
      return newUrl;
    },
  },
};
</script>
