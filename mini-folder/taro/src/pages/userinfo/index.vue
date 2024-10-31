<template>
  <view class="userinfo">
    <form @submit="handleSubmit" >
    <view class="userinfo-room">
      <button
        class="userinfo-avatar"
        open-type="chooseAvatar"
        @chooseavatar="handleLaunch"
      >
        <image v-if="wxHeadImg" class="avatar" :src="wxHeadImg"></image>
        <image v-else class="avatar" src="../../assets/headimg.png"></image>
      </button>
      <view class="userinfo-nickname">
        <view class="userinfo-nickname-label">昵称</view>
        <input name="nickname" id="nickname-input"   type="nickname" @nicknamereview="handleChangeNickName" placeholder-class="wechat-input-placeholder" class="wechat-input" placeholder="请输入昵称" />
      </view>
     
    </view>
    <button  form-type="submit" class="userinfo-btn" >确定</button>
  </form>
  </view>
</template>

<script>
import { baseUrl } from "../../utils/config"
import Taro from "@tarojs/taro"
import './index.less'

export default {
  data () {
    return {
      wxHeadImg: "",
      wxNickName:"",
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
        const { avatarUrl } = e.detail
        const {data}  = await Taro.uploadFile({
            filePath: avatarUrl,
            url: baseUrl+"upload",
            name:"file"
        })
        const result =   JSON.parse(data)?.result
        this.wxHeadImg = result
      } catch (error) {
        Taro.showToast({
          title: '上传头像失败',
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
