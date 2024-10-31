<template>
  <view class="userphone">
    <view class="userphone-label">
      点击“获取手机号”授权
    </view>
    <image
      class="userphone-bg"
      src="../../assets/phone.jpg"
    />
    <button
      class="userphone-btn"
      open-type="getPhoneNumber"
      @getphonenumber="handleLaunch"
    >
      获取手机号
    </button>
  </view>
</template>

<script>
import apis from "../../apis";
import { baseUrl } from "../../utils/config"
import Taro from "@tarojs/taro"
import './index.less'

export default {
  data () {
    return {
      wxPhone: "",
    }
  },
  onLoad(options) {
    this.init(options);
  },
  methods: {
    init(options) {
      console.log(options);
    },
    async handleLaunch(e) {
      try {
        console.log(e)
        const { code,errMsg,errno } = e.detail
        if(errMsg!=="getPhoneNumber:ok"){
          throw new Error(errMsg)
        }
        const {phone_info,errmsg,errcode}  = await apis.getPhone({ code });
        if(errcode!=="0"){
          throw new Error(errmsg)
        }
        let pages = Taro.getCurrentPages()
        let prevPage = pages[pages.length - 2]
        prevPage.setData({
            userinfo: {wxPhone:phone_info.countryCode+'-'+phone_info.purePhoneNumber},
        });
        Taro.navigateBack({
          delta: 1
        });
      } catch (error) {
        Taro.showToast({
          title: error.message,
          icon:"none"
        })
      }
    },
    handleChangeNickName(e) {
      const { detail } = e
    },  
    handleSubmit(e) {
      let pages = Taro.getCurrentPages()
      let prevPage = pages[pages.length - 2]
      this.wxNickName =  e.detail.value.nickname
      const { wxHeadImg, wxNickName } = this
      if (!wxHeadImg  ||!wxNickName) {
       return Taro.showToast({
          icon: "none",
          title: "昵称和头像不能为空"
        })
      }
      prevPage.setData({
          userinfo: {wxHeadImg, wxNickName},
        });
      Taro.navigateBack({
        delta: 1
      });
    }
  }
}
</script>
