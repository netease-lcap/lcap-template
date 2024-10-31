import Vue from 'vue'
import './app.less'

import Taro from "@tarojs/taro"

const App = {
  onShow(options) {
    Taro.setStorage({
      key: "isFirst",
      data:true
    })
    const updateManager = Taro.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    })
    updateManager.onUpdateReady(function () {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
  },
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  }
}

export default App
