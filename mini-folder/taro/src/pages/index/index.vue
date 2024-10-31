<template>
  <view class="index">
    <web-view :src="url"></web-view>
  </view>
</template>

<script>
import "./index.less";
import Taro from "@tarojs/taro";
import apis from "../../apis";
import {baseUrl,basePath} from "../../utils/config"
import { set as setGlobalData, get as getGlobalData } from "../../global_data";

export default {
  data() {
    return {
      url: "",
    };
  },
  onLoad(options) {
    this.$instance = Taro.getCurrentInstance();
    this.init(options);
  },
  onShow() {
    const pages = Taro.getCurrentPages();
    const currPage = pages[pages.length - 1];
    if (currPage.data.userinfo) {
      const { wxHeadImg, wxNickName,wxPhone,wxScanCode,wxLocation } = currPage.data.userinfo;
      this.originalUrl = this.url
      if (wxNickName) {
        if(!~this.url.indexOf("_wx_headimg")) {
          setGlobalData("originalUrl", this.url)
        }
        const _url = this.getUrl(
          getGlobalData("originalUrl"),
          `_wx_headimg=${wxHeadImg}&_wx_nickname=${wxNickName}`
        );
        currPage.setData({
          userinfo: {},
        });
        this.url = this.appendUrlParams(_url, this.$instance.router.params);
      }
      if(wxPhone){
         if(!~this.url.indexOf("_wx_phone")) {
          setGlobalData("originalUrl", this.url)
        }
         const _url = this.getUrl(
          getGlobalData("originalUrl"),
          `_wx_phone=${wxPhone}`
        );
        currPage.setData({
          userinfo: {},
        });
        this.url = this.appendUrlParams(_url, this.$instance.router.params);;
      }
      if(wxScanCode){
         if(!~this.url.indexOf("_wx_scan_code")) {
          setGlobalData("originalUrl", this.url)
        }
         const _url = this.getUrl(
          getGlobalData("originalUrl"),
          `_wx_scan_code=${wxScanCode}`
        );
        currPage.setData({
          userinfo: {},
        });
        this.url = this.appendUrlParams(_url, this.$instance.router.params);;
      }
      if(wxLocation){
         if(!~this.url.indexOf("_wx_location")) {
          setGlobalData("originalUrl", this.url)
        }
         const _url = this.getUrl(
          getGlobalData("originalUrl"),
          `_wx_location=${wxLocation}`
        );
        currPage.setData({
          userinfo: {},
        });
        this.url = this.appendUrlParams(_url, this.$instance.router.params);;
      }
    }
  },
  mounted() {
  },
  onShareAppMessage() {

  },
  methods: {
    async init(options) {
      try {
        const isFirst = Taro.getStorageSync("isFirst");
        let titleList = []
        if (isFirst) {
          const list  = await apis.getTitleConfig({}) ||[]
          titleList = list
          setGlobalData("titleList", list)
        } else {
          titleList =  getGlobalData("titleList")
        }
        // console.log(options, "options");
        const {
          detailUrl = baseUrl+basePath.slice(1),
        } = options;

        let decodeUrl = decodeURIComponent(detailUrl);
        if (isFirst) {
          const userInfo = await this.getOpenid();
          decodeUrl = this.getUrl(decodeUrl, `_wx_openid=${userInfo?.openid}`);
          decodeUrl = this.getUrl(decodeUrl, `_wx_is_mini=1`);
          Taro.setStorage({
            key: "isFirst",
            data: false,
          });
        }
        console.log(decodeUrl);
        this.url = this.appendUrlParams(decodeUrl, this.$instance.router.params);;

        /* 获取路由
         **  examble aa aa/bb
         */
        this.setBarTitle(Array.isArray(titleList) ? titleList : [], decodeUrl);
      } catch (error) {
        console.log(error);
      }
    },
    async setBarTitle(list=[], decodeUrl) {
      const reg = /(http|https)\:\/\/[^/]*\/([^?]*)\??(\S*)/;
      const defaultUrl = basePath? decodeUrl.replace(basePath, "") :decodeUrl
      const [, , result] = reg.exec(defaultUrl)||[]
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
        titleInfo = list.find(item=>item.isIndex)
      }
      if (titleInfo) {
        Taro.setNavigationBarTitle({ title: titleInfo?.title });
      } else {
        // Taro.setNavigationBarTitle({ title:"未设置标题" });
      }
    },
    getUrl(url, str) {
      return url + (~url.indexOf("?") ? "&" : "?") + str;
    },
    async getOpenid() {
      try {
        const { code } = await Taro.login();
        const data = await apis.getOpenid({ code });
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    // 追加小程序路由上的参数
    appendUrlParams(url, params = {}) {
      let newUrl = url;
      if (params) {
        const keys = Object.keys(params);
        keys.forEach((key) => {
          newUrl = `${newUrl}${newUrl.indexOf("?") !== -1 ? "&" : "?"}${key}=${encodeURIComponent(params[key])}`;
        });
      }
      return newUrl;
    },
  },
};
</script>
