<template>
  <view class="userphone">
    <view class="userphone-label"> 点击“获取手机号”授权 </view>
    <image class="userphone-bg" src="../../assets/phone.jpg" />
    <button class="userphone-btn" open-type="getPhoneNumber" @getphonenumber="handleLaunch">获取手机号</button>
  </view>
</template>

<script>
import apis from '../../apis';
import Taro from '@tarojs/taro';
import './index.less';

export default {
  data() {
    return {
      wxPhone: '',
    };
  },
  onLoad(options) {
    console.log('用户手机号页面参数', options);
  },
  methods: {
    async handleLaunch(e) {
      try {
        const { code, errMsg, errno } = e.detail;

        if (errMsg !== 'getPhoneNumber:ok') {
          throw new Error(errMsg);
        }

        const { phone_info, errmsg, errcode } = await apis.getPhone({ code });
        if (errcode !== '0') {
          throw new Error(errmsg);
        }

        let pages = Taro.getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
          userinfo: { wxPhone: phone_info.countryCode + '-' + phone_info.purePhoneNumber },
        }, () => {
          Taro.navigateBack({
            delta: 1,
          });
        });
      } catch (error) {
        Taro.showToast({
          title: error.message,
          icon: 'none',
        });
      }
    },
  },
};
</script>
