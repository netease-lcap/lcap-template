<template>
  <view></view>
</template>

<script>
import Taro from '@tarojs/taro';

export default {
  data() {
    return {
    };
  },
  onLoad(options) {
    console.log('扫码页面参数', options);
    Taro.scanCode({
      success: (r) => {
        const wxScanCode = r.result;
        this.handleSave(wxScanCode);
      },
      fail: (error) => {
        Taro.showToast({
          title: '扫码失败',
          icon: 'none',
        });
        Taro.navigateBack({
          delta: 1,
        });
      },
    });
  },
  methods: {
    handleSave(wxScanCode) {
      let pages = Taro.getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        userinfo: { wxScanCode },
      }, () => {
        Taro.navigateBack({
          delta: 1,
        });
      });
    },
  },
};
</script>
