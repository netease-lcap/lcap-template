export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/userinfo/index',
    'pages/userphone/index',
    'pages/getlocation/index',
    'pages/scancode/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  "requiredPrivateInfos": ["getLocation"],
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将会被收集"
    }
  }
})
