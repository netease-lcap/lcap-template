---
layout: home

hero:
  name: "LCAP Template"
  text: "低代码应用模板"
  tagline: 支持 Vue2/Vue3/React 的多框架前端解决方案，助力企业快速构建现代化应用
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/
    - theme: alt
      text: GitHub
      link: https://github.com/netease-lcap/lcap-template

features:
  - icon: 🚀
    title: 多框架支持
    details: 同时支持 Vue 2.6、Vue 3.5 和 React 三大主流框架，满足不同项目需求，灵活选择技术栈
  - icon: 📦
    title: 模块化设计
    details: 基础包与框架包分离，通过 workspace 依赖管理，按需引入，避免冗余代码
  - icon: 🛠️
    title: 企业级特性
    details: 完整的权限认证、动态路由、状态管理、流程处理等企业级功能开箱即用
  - icon: ⚡
    title: 高性能构建
    details: 基于 Rspack 和 Webpack 5 的现代化构建体系，支持代码分割、懒加载和 Tree Shaking
  - icon: 📱
    title: 小程序支持
    details: 基于 Taro 3.6 的多端小程序解决方案，一套代码编译到微信、支付宝等多个平台
  - icon: 🔧
    title: 低代码集成
    details: 与 LCAP 低代码平台深度集成，提供元数据驱动、可视化配置等低代码能力
---

## 技术栈

| 包名 | 框架版本 | 构建工具 | 状态管理 | 特点 |
|------|---------|---------|---------|------|
| `@lcap/basic-template` | 框架无关 | Rollup | - | 纯函数库，工具函数和 API 封装 |
| `@lcap/vue-template` | Vue 2.6.14 | Webpack 5 | Pinia 2.2.8 | 兼容 Vue 2 生态，稳定可靠 |
| `@lcap/vue3-template` | Vue 3.5.13 | Rspack 1.3.10 | Pinia 2.3.1 | 现代化构建，高性能 |
| `@lcap/react-template` | React | 自定义脚本 | - | React 框架支持 |
| `taro-mini-vue2` | Vue 2.6.14 | Taro 3.6.35 | - | 多端小程序支持 |

## 快速开始

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/netease-lcap/lcap-template.git
cd lcap-template

# 安装依赖（必须使用 pnpm）
pnpm install
```

### 构建所有包

```bash
# 开发构建
pnpm build

# 生产构建
LCAP_RELEASE=1 pnpm build
```

### 运行测试

```bash
pnpm test
```

## 项目结构

```
lcap-template/
├── packages/
│   ├── basic/          # 通用纯函数库，不依赖框架
│   ├── vue2/           # Vue 2 框架应用模板
│   ├── vue3/           # Vue 3 框架应用模板
│   └── react/          # React 框架应用模板
├── mini-folder/
│   ├── taro/           # Taro 小程序应用模板
│   └── build/          # 小程序构建配置
├── docs/               # 文档站点（本站点）
└── scripts/            # 根目录脚本
```

## 相关链接

- [API 文档](https://netease-lcap.github.io/lcap-template/)
- [GitHub 仓库](https://github.com/netease-lcap/lcap-template)
- [问题反馈](https://github.com/netease-lcap/lcap-template/issues)

## 许可证

[MIT](https://github.com/netease-lcap/lcap-template/blob/main/LICENSE)
