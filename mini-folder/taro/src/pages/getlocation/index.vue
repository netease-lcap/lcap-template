<template>
  <view class="location-room">
    <image class="location-image" src="../../assets/map.png"></image>
    <text>正在获取定位...</text>
  </view>
</template>

<script>
import Taro from '@tarojs/taro';
import './index.less';

export default {
  data() {
    return {

    };
  },
  onLoad(options) {
    console.log('定位页面参数', options);
    Taro.getLocation({
      type: 'wgs84',
      success: (r) => {
        const location = r.latitude + ',' + r.longitude;
        this.handleSave(location);
      },
      fail: (error) => {
        Taro.showToast({
          title: error,
          icon: 'none',
        });
      },
    });
  },
  methods: {
    handleSave(location) {
      let pages = Taro.getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        userinfo: { wxLocation: location },
      }, () => {
        Taro.navigateBack({
          delta: 1,
        });
      });
    },
  },
};
</script>
