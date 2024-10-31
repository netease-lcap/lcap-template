<template>
<view></view>
</template>

<script>
import { baseUrl } from "../../utils/config"
import Taro from "@tarojs/taro"

export default {
  data () {
    return {
      wxScanCode:"",
    }
  },
  onLoad(options) {
    this.init(options);
    Taro.scanCode({
      success:(r)=>{
        this.wxScanCode = r.result
        this.handleSave()
      },
      fail:(error)=>{
        Taro.showToast({
          title: '扫码失败',
          icon:"none"
        })
        Taro.navigateBack({
          delta: 1
        });
      }
    })
  },
  methods: {
    init(options) {
      console.log(options);
    },
    handleSave(e) {
      let pages = Taro.getCurrentPages()
      let prevPage = pages[pages.length - 2]
      const { wxScanCode } = this
      prevPage.setData({
          userinfo: {wxScanCode},
        });
      Taro.navigateBack({
        delta: 1
      });
    }
  }
}
</script>
