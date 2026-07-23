# taro-mini-vue2 概述

`taro-mini-vue2` 是基于 Taro 3.6 和 Vue 2.6 的小程序应用模板，支持多端编译。

## 技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Vue | 2.6.14 | 核心框架 |
| 小程序 | Taro | 3.6.35 | 多端框架 |
| 构建 | Webpack | 5.78.0 | 构建工具 |
| 组件 | @tarojs/components | 3.6.35 | Taro 组件库 |

## 支持平台

- 微信小程序 (weapp)
- 支付宝小程序 (alipay)
- 百度小程序 (swan)
- 字节跳动小程序 (tt)
- QQ 小程序 (qq)
- 京东小程序 (jd)
- H5 (h5)
- React Native (rn)

## 项目结构

```
mini-folder/taro/
├── src/
│   ├── app.js           # 应用入口
│   ├── app.less         # 全局样式
│   ├── pages/           # 页面目录
│   │   └── index/       # 首页
│   │       ├── index.vue
│   │       └── index.config.js
│   └── components/      # 组件目录
├── config/              # 项目配置
│   ├── index.js         # 主配置
│   ├── dev.js           # 开发配置
│   └── prod.js          # 生产配置
└── package.json
```

## 快速开始

```bash
# 进入目录
cd mini-folder/taro

# 安装依赖
pnpm install

# 开发模式 - 微信小程序
pnpm dev:weapp

# 开发模式 - 支付宝小程序
pnpm dev:alipay

# 开发模式 - H5
pnpm dev:h5

# 构建 - 微信小程序
pnpm build:weapp

# 构建 - 支付宝小程序
pnpm build:alipay
```

## 开发命令

| 命令 | 说明 |
|------|------|
| `pnpm dev:weapp` | 微信小程序开发模式 |
| `pnpm dev:alipay` | 支付宝小程序开发模式 |
| `pnpm dev:h5` | H5 开发模式 |
| `pnpm build:weapp` | 构建微信小程序 |
| `pnpm build:alipay` | 构建支付宝小程序 |
| `pnpm build:h5` | 构建 H5 |

## 多端适配

```vue
<template>
  <view class="container">
    <!-- 使用 Taro 组件 -->
    <text class="title">{{ title }}</text>
    <button @click="handleClick">点击</button>
  </view>
</template>

<script>
import Taro from '@tarojs/taro';

export default {
  data() {
    return {
      title: 'Hello Taro'
    };
  },
  methods: {
    handleClick() {
      Taro.showToast({
        title: '点击了按钮',
        icon: 'success'
      });
    }
  }
};
</script>
```

## 注意事项

- 使用 Taro 组件代替 HTML 标签
- 遵循小程序规范（包大小限制、页面配置等）
- 条件编译使用 `process.env.TARO_ENV`
- 独立构建流程，与主包不共享配置
