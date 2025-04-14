<template>
    <view class="location-room">
       <image class="location-image" src="../../assets/map.png"></image>
       <text>正在获取定位...</text>
    </view>
</template>

<script>
import Taro from "@tarojs/taro"
import './index.less'

export default {
  data () {
    return {
      location:"",
    }
  },
  onLoad(options) {
    this.init(options);
    Taro.getLocation({
      type: 'wgs84',
      success:(r)=>{
        this.location = r.latitude+","+r.longitude
        setTimeout(()=>{
          this.handleSave()
        },1000)
      },
      fail:(error)=>{
        Taro.showToast({
          title: error,
          icon:"none"
        })
      }
    })
  },
  methods: {
    init(options) {
      console.log(options,222);
    },
    handleSave(e) {
      let pages = Taro.getCurrentPages()
      let prevPage = pages[pages.length - 2]
      const { location } = this
      prevPage.setData({
          userinfo: {wxLocation:location},
        });
      Taro.navigateBack({
        delta: 1
      });
    }
  }
}
</script>
